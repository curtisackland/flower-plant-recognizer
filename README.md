# Flower Plant Recognizer

**Flower Plant Recognizer** is a web application designed to help you identify and learn about different flowers
and plants. It uses **Google's Gemini AI API** to identify flowers and plants through the images or text descriptions 
that the user provides and other insightful information about flowers and plants. This project was developed with **React**, **Express.js.**,
and **Node.js**.

**Features:**

- **Image Recognition:** Simply upload a photo of a flower or plant, and it will suggest possible matches.
- **Text-Based Search:** Describe the plant's characteristics (color, shape, size, etc.), and it will provide you with potential candidates.
- **Detailed Plant Information:** Once you've identified a plant, learn more about its scientific name, origin, growing conditions, care tips, and interesting facts.

## How to Run

### Back-end - Express.js

Copy the `.env.example` file from the `./back-end` folder into a new `.env` file and update the `GOOGLE_API_KEY`
with your own key. You can find a key here: https://ai.google.dev/gemini-api/docs/api-key

```bash
cp back-end/.env.example back-end/.env
```

Then run `npm start` in the `./back-end` directory to run the Express.js back-end. It should be available at: http://localhost:3001

### Front-end - React

Copy the `.env.example` file from the `root project folder` into a new `.env` file and update its contents if needed.

```bash
cp .env.example .env
```

Then run `npm start` to serve the React app. (See below for more information)

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


