const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

let config = {
    welcomeMessage:  process.env.WELCOME_MESSAGE,
};

app.use(bodyParser.json());

const logFilePath = path.join(__dirname, 'app', 'logs', 'app.log');

app.get('/', (req, res) => {
    res.send(config.welcomeMessage);
});

app.get('/status', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/log', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const logMessage = `${new Date().toISOString()} - ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).json({ error: 'Failed to write to log file' });
        }

        res.status(201).json({ message: 'Log saved' });
    });
}); 

app.get('/logs', (req, res) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return res.status(500).json({ error: 'Failed to read log file' });
        }

        res.type('text/plain').send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});