require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.use(bodyParser.json());

app.post('/start-call', async (req, res) => {
    console.log('start-call');
    const { to } = req.body;
    try {
        const call = await client.calls.create({
            url: domain + 'twiml',
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER,
            record: true
        });
        res.status(200).json({ callSid: call.sid });
    } catch (error) {
        console.log('error : '+ error.message);
        res.status(500).json({ error: error.message });
    }
});

//Twilio for two way communication
app.post('/twiml', (req, res) => {
    console.log('Generating TwiML response for two-way communication');
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Dial the phone number directly for testing
    twiml.dial({
        callerId: process.env.TWILIO_PHONE_NUMBER,
        record: 'record-from-ringing',
    }, '+919167638852'); // Replace with the actual phone number you want to call
    
    res.type('text/xml');
    res.send(twiml.toString());
});



//Twilio for one way communication
app.post('/twiml1', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('This call is being recorded.');
    twiml.record();
    res.type('text/xml');
    res.send(twiml.toString());
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
