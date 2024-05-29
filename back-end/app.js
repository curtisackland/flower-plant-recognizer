const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
/**
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
    */
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Hello World!!!!');
});

app.post('/send-message', upload.single('image'), (req, res) => {
    if (req.body.message && req.body.image) {
        res.json({
            from: 'app',
            image: req.body.image,
            message: "The message and image you sent was: " + req.body.message
        });
    } else if (req.body.message) {
        return res.json({ from: 'app', image: null, message: "The message you sent was: " + req.body.message });
    }

    return res.json({error: "No message given"});
})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});