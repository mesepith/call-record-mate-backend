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
    
    // Set up a conference call to connect both the app and recipient
    const dial = twiml.dial();
    dial.conference({
        startConferenceOnEnter: true, // Start conference when the caller joins
        endConferenceOnExit: true     // End the conference when the caller hangs up
    }, 'MyConferenceRoom'); // 'MyConferenceRoom' is the name of the conference
    
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
