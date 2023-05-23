const express = require('express');
const app = express();
const dotenv = require('dotenv');

const cors = require('cors');

app.use(cors());

dotenv.config();
const bp = require('body-parser');

app.use(bp.json());

app.use(bp.urlencoded({ extended: true }));

// Importing and setting up the OpenAI API client
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const conversationContextPrompt = "The following is a conversation with an AI assistant. \
                The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, \
                who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ";


// Defining an endpoint to handle incoming requests
app.post("/get_answer", (req, res) => {
    // Extracting the user's message from the request body
    const message = req.body.message;

    console.log("Message = ", message);

    // Calling the OpenAI API to complete the message
    openai.createCompletion({
        model: "text-davinci-003",
        // Adding the conversation context to the message being sent
        prompt: conversationContextPrompt + message,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
    }).then((response) => {
        // Sending the response data back to the client
        // console.log("RESSS = ",response)
        return res.status(200).json(response.data.choices);

        // AXIOS RESPONSE FORMAT
        // console.log(response.data[0].text) for axios response from frontend
    }).catch((error) =>{
        return res.status(500).json(error)
    });
});

// Starting the Express app and listening on port 3000
app.listen(3500, () => {
    console.log("Conversational AI assistant listening on port 3500!");
});

console.log("Index Js Running");