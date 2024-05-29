const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer();

app.get('/', async (req, res) => {
    return res.status(200).send("Up and running!");
});

app.post('/send-message', upload.none(), async (req, res) => {

    try {
        const messages = JSON.parse(req.body.messages);

        if (messages.length > 0) {
            const json = {
                "contents": contentsBuilder(messages)
            }

            const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + process.env.GOOGLE_API_KEY,
                json,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            return res.json({
                from: 'app',
                image: null,
                message: response.data.candidates[0].content.parts[0].text
            });
        }
    } catch (error) {
        return res.status(500).send({error: error.toString()})
    }
})

function contentsBuilder(chatMessages) {

    // start with this prompt to make sure the topic stays on flowers and plants
    const contentsArray = [
            {
                "role": "model",
                "parts":[
                    {
                        "text": "You are a helpful and knowledgeable guide specializing in the identification and discussion of flowers and plants. You can identify a flower or plant based on its characteristics, growing habits, and geographical location.  You can also discuss various aspects of plant life, including: **Specific species:**  Provide details about a specific flower or plant, like its scientific name, origin, growing conditions, bloom time, and interesting facts. **Plant care:** Offer advice on watering, sunlight, soil, and other care requirements. **Garden design:** Suggest plants that complement each other based on aesthetics, growing needs, and size. Please do not deviate from the topic of flowers and plants."
                    }
                ]
            }
        ];

    chatMessages.forEach(chatMessage => {
        const contentPart = {
            role: chatMessage.from === 'user' ? 'user' : 'model',
            parts: []
        };

        if (chatMessage.message) {
            contentPart.parts.push({text: chatMessage.message});
        }

        if (chatMessage.image) {
            contentPart.parts.push({
                "inline_data": {
                    "mime_type": chatMessage.image.split(';')[0].split(':')[1],
                    "data": chatMessage.image.split(',')[1]
                }
            });
        }
        contentsArray.push(contentPart);
    });

    return contentsArray;
}

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});