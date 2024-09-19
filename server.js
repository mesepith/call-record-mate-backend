require('dotenv').config(); // Add this line at the top

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

const domain = process.env.DOMAIN

// Use environment variables for Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());

// API endpoint to start a call and initiate recording
app.post('/start-call', async (req, res) => {
    const { to } = req.body;
    try {
        const call = await client.calls.create({
            url: domain + 'twiml', // URL to TwiML for handling the call
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER, // Use the environment variable here
            record: true // Start recording
        });
        res.status(200).json({ callSid: call.sid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle the TwiML response for the call
app.post('/twiml', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('This call is being recorded.');
    twiml.record();
    res.type('text/xml');
    res.send(twiml.toString());
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
