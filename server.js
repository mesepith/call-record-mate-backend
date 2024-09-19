const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Twilio credentials
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());

// API endpoint to start a call and initiate recording
app.post('/start-call', async (req, res) => {
    const { to } = req.body;
    try {
        const call = await client.calls.create({
            url: 'http://your-server-url/twiml', // URL to TwiML for handling the call
            to: to,
            from: 'YOUR_TWILIO_PHONE_NUMBER',
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
