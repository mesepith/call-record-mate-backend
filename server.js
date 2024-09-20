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
            url: domain + '/twiml', // TwiML URL where the call instructions are provided
            to: to,                 // Phone number of the recipient
            from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number as the caller ID
            record: true            // Record the call
        });
        res.status(200).json({ callSid: call.sid });
    } catch (error) {
        console.log('Error starting call:', error.message);
        res.status(500).json({ error: error.message });
    }
});



//Twilio for two way communication
app.post('/twiml', (req, res) => {
    console.log('Generating TwiML response for two-way communication');
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Create a conference room for two-way communication
    const dial = twiml.dial();
    dial.conference({
        startConferenceOnEnter: true, // Join the conference when call starts
        endConferenceOnExit: true,    // End the conference when both parties hang up
        waitUrl: '',  // Set this empty to prevent Twilio's default hold music
        record: 'record-from-start'   // Start recording when the conference begins
    }, 'MyConferenceRoom');

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
