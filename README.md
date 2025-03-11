# Advanced-AI-chatbot-with-RAG-and-Pinecone

**Overview**

This project is an advanced AI chatbot that leverages Pinecone for context retrieval and Retrieval-Augmented Generation (RAG) to enhance its responses. By integrating Pinecone, a vector database, with AI-driven chat models, the chatbot provides more context-aware and informed interactions.

**Objectives**

1. Integrate Pinecone: Retrieve relevant context data using similarity searches.

2. Context-aware chatbot: Use the retrieved context to generate accurate, helpful responses.

3. Augmented Generation (RAG): Blend external content with generative AI to enhance replies.

**How to complete the template**

**Step 1:** Pinecone initialization
Set up Pinecone by providing your API key. This will allow you to connect to the Pinecone database and retrieve context data for the AI chatbot.

![image](https://github.com/user-attachments/assets/8483d724-7228-4200-9487-053074023c1d)


**Step 2:** Define AI model and embeddings
Configure the OpenAI embeddings. This setup will be used to encode text into vector form that Pinecone can understand and retrieve efficiently.

![image](https://github.com/user-attachments/assets/09803ff3-fd7f-40ad-bd4f-b867b2ad6e08)

**Step 3:** Initialize ChatOpenAI model
Configure your ChatOpenAI model. This model will generate responses based on the context fetched from Pinecone.

![image](https://github.com/user-attachments/assets/0612fdcc-147f-4b95-be25-449788bc073e)

**Step 4:** Fetch context from Pinecone
Define a function to retrieve the relevant context for your chatbot’s responses. This function uses Pinecone’s similarity search to find the most pertinent data based on incoming queries.

![image](https://github.com/user-attachments/assets/19c9aa16-6944-4dc2-8f68-c1be92ebc652)

**Step 5:** Setup interactive chat Interface
Utilize readline to create an interactive command-line interface for real-time user interaction.

![image](https://github.com/user-attachments/assets/ba8f9e96-2743-4e02-9d21-229fbb8ba947)

**Step 6:** Setup prompt template and chat chain
Define a prompt template using ChatPromptTemplate.fromMessages. This template includes placeholders for both the user’s context and the conversation history.

![image](https://github.com/user-attachments/assets/4d467aa3-f079-4611-91bf-58dc919a0f0f)

**Step 7:** Chat chain with history
Create a chat chain that includes message history to keep track of the conversation. This uses RunnableWithMessageHistory to manage the input, context, and conversation history.

![image](https://github.com/user-attachments/assets/ddc762fe-7a61-46f9-a9f2-509ab1a1e3d1)


**Step 8:** Implement the chat function
Implement the main chat function that handles the interactive chat session. This function will prompt the user for input, retrieve context from Pinecone, and use the chat chain to generate responses.

![image](https://github.com/user-attachments/assets/a7193209-47d4-46cd-b645-d894a9f452aa)


**Running the code**
Start the chat interaction by calling the chat() function. Handle any errors and ensure the readline interface is properly closed when the chat ends.

![image](https://github.com/user-attachments/assets/1d0948c5-d117-4213-8136-c87b38961aca)


**Expected results**
After running the code locally, you should see the chatbot in action, providing personalized health advice based on the context retrieved from Pinecone.

The chatbot’s responses should be relevant, actionable, and tailored to the user’s specific health needs, making the interaction more engaging and informative.

You can test the chatbot with different user inputs to see how it adapts its responses based on the context retrieved from Pinecone.

_**Happy Coding!**_

