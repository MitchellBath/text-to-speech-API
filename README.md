# text-to-speech-API

Text-To-Speech API
This is a web server that allows users to generate text-to-speech data based on their input text and voice selection. The server is built using Node.js and Express, and it uses Microsoft Azure's Text-To-Speech API to synthesize speech from the given text.

Installation
To use this server, you will need Node.js (tested on version 16.17.0) and npm installed on your machine. Once you have those installed, clone this repository and navigate to the root directory. Run the following command to install the necessary dependencies:

npm install

Usage
To start the server, run the following command:

node app.js
By default, the server will run on http://localhost:3000/. You can access the landing page for the text-to-speech API by navigating to that URL in your web browser.

On the landing page, you can enter the text you want to convert to speech and select a voice model. Once you submit the form, the server will redirect you to a page that plays the synthesized speech.

You can also access the list of supported voice models by navigating to http://localhost:3000/voices in your web browser.

Additionally, a page that plays synthesized speech from a Request URL can be accessed at http://localhost:3000/synthesize?text=Lorem%20Ipsum&voice=en-US-CoraNeural where text and voice are parameters that take input text and a provided voice name respectively

License
This project is licensed under the MIT License. See the LICENSE file for more information.
