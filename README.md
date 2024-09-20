## CallRecordMate Backend

CallRecordMate Backend is the server-side application for the <a href="https://github.com/mesepith/CallRecordMate">CallRecordMate</a> mobile app, built using Node.js and Express. It integrates with Twilio to facilitate seamless and secure call recording, providing a robust API for handling recordings, managing user data, and ensuring smooth communication between the app and the server. This backend ensures efficient storage, retrieval, and management of call recordings, offering a reliable foundation for the CallRecordMate experience on both iPhone and Android.

## Features:

Integration with Twilio for secure call recording

RESTful API for call recording management

Secure storage and data handling

User authentication and authorization

Built with Node.js and Express for high performance

Scalable architecture to support a growing user base

## Project Setup

mkdir call-record-mate-backend

cd call-record-mate-backend

npm init -y

npm install express body-parser twilio

npm install dotenv

## Create Twilio Account

visit <a href="twilio.com" target="_blank">Twilio</a>. Register and get SID, Auth Token, Twilio Phone Number

## Create a .env File

Create a file named .env in the root directory of your Express.js project (call-record-backend).

Add the following lines to this file:

```bash
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER
DOMAIN=https://twilio.zahiralam.com/
```

# Note: twiml url must be publicly accessible by twilio.  If your backend server is running on a local machine, it will not be accessible to Twilio.

To access your nodejs application publicly follow this tutorial <a href="https://zahiralam.com/blog/how-to-make-your-node-js-application-accessible-via-a-domain/">Go Live in Minutes: Host Your Node.js Application on Ubuntu Server</a>