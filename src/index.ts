// Import necessary modules.
import readline from "readline";
import { ChatOpenAI, OpenAIEmbeddings, AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import "dotenv/config";

// Define constants.
const EMBEDDING_MODEL = "text-embedding-ada-002";
const GPT_MODEL = "gpt-4o-2024-11-20";
const CONTEXT_FILE_PATH = "./context/client.txt";
const HISTORY_KEY = "history";
const USER_QUERY_KEY = "input";

// Initialize Pinecone client and index.
// Ensure that the API key and index name are set as environment variables.
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string, // Access Pinecone API key from .env.
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME as string); 

// Hint: Use the `OpenAIEmbeddings` class to initialize the embedding model with the correct API key and model name.
export const getEmbeddingModel = (): AzureOpenAIEmbeddings => {
  return new AzureOpenAIEmbeddings({
    model: EMBEDDING_MODEL,
    azureOpenAIApiKey: process.env.DIAL_API_KEY,
    azureOpenAIBasePath: "https://ai-proxy.lab.epam.com",
    azureOpenAIApiDeploymentName: "openai/deployments/text-embedding-ada-002",
    azureOpenAIApiVersion: "2023-12-01-preview",
  });
};

// Hint: Use the `ChatOpenAI` class to initialize the chat model with parameters like maxTokens, temperature, and model name.
export const getChatOpenAI = (): AzureChatOpenAI => {
  return new AzureChatOpenAI({
    model: GPT_MODEL,
    maxTokens: 8192,
    azureOpenAIApiKey: process.env.DIAL_API_KEY,
    azureOpenAIBasePath: "https://ai-proxy.lab.epam.com",
    azureOpenAIApiDeploymentName: "openai/deployments/gpt-4o-2024-11-20",
    azureOpenAIApiVersion: "2023-12-01-preview",
  });
};

// Hint: Perform a similarity search on the Pinecone index to find documents matching a query like "John Doe".
export const retrieveContextFromPinecone = async (query: string): Promise<string> => {
  const embeddings = getEmbeddingModel();
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });
  const results = await vectorStore.similaritySearch(query, 1, {
    source: "./client.txt",
  });
  return results.map((document) => document.pageContent).join("\n");
};

// Hint: Use the `ChatPromptTemplate.fromMessages` method to include placeholders for `context` and `history`.
export const getPromptTemplate = (): ChatPromptTemplate => {
  return ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a dedicated health assistant tasked with providing tailored advice on nutrition, exercises, and general health. Each response should be a direct recommendation that is relevant and specific to the provided context: {context}. Focus solely on delivering actionable advice without additional commentary.",
    ],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);
};

// Hint: Use the prompt template, chat model, and `StringOutputParser` to create the chain.
export const getChainWithHistory = () => {
  const messageHistory = new ChatMessageHistory();
  const chatModel = getChatOpenAI();
  const prompt = getPromptTemplate();
  return new RunnableWithMessageHistory({
    runnable: prompt.pipe(chatModel).pipe(new StringOutputParser()),
    inputMessagesKey: "input",
    historyMessagesKey: "history",
    getMessageHistory: (_sessionId) => messageHistory,
  });
};

// Hint: Use `readline` for user input and the chat chain for generating AI responses.
export const startHealthAssistantChat = async (): Promise<void> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };

  async function chat() {
    const config = { configurable: { sessionId: "1" } }; // Configuration for the chain
    const userInput = await askQuestion("You: ");
    const context = await retrieveContextFromPinecone(userInput); // Pass userInput
    const chainWithHistory = getChainWithHistory();      // Get the chat chain with history

    // Invoke the chain with the user input and context
    const output = await chainWithHistory.invoke(
      { input: userInput, context: context },
      config
    );
    console.log("Assistant:", output);

    // Recursive call to continue the chat
    await chat();
  }

  await chat()
    .catch((error) => {
      console.error("An error occurred during chat:", error);
    })
    .finally(() => {
      rl.close();
    });
};

// If this script is the main module, start the chat.
// Do not modify this part of the code.
if (require.main === module) {
  startHealthAssistantChat().catch((error) => {
    console.error("An error occurred:", error);
  });
}