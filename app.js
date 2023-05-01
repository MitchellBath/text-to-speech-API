//require  modules
const express = require('express')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
const sdk = require('microsoft-cognitiveservices-speech-sdk')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const cors = require('cors')

// create app
const app = express();

const options = {
    swaggerDefinition: {
        info: {
            title: 'Text-To-Speech API',
            version: '1.0.0',
            description: 'Text-To-Speech API using Microsoft Azure\'s Text-To-Speech API created by Mitch Bath',    
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ],
        basePath: '/',
    },
    apis: ['./app.js'],
}

const specs = swaggerJsdoc(options)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors())

// speech stuff
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.APIKEY, process.env.REGION);

// config app
let port = 3000;
let host = 'localhost';

app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function(err, req, res, next) {
    if (err.status === 404) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

/**
 * @swagger
 * /:
 *    get:
 *      description: Returns landing page for text-to-speech and voice selection
 *      responses:
 *          200:
 *              description: Redirect to text-to-speech synthesis for requested text and voice
 *          404:
 *              description: Error
 */
app.get('/', async (req, res)=>{
    // var synthesizer = new sdk.SpeechSynthesizer(speechConfig, undefined)
    // voices = await synthesizer.getVoices();
    // const voiceNames = [];
    // for (const voiceId in voices) {
    //     const voice = voices[voiceId];
    //     if (voice.voiceName) voiceNames.push(voice.voiceName);
    // }
    // console.log(`Number of voices found: ${voiceNames.length}`)

    // Note: limited number of East US voices available
    voices = [
        'en-US-AIGenerate1Neural',
        'en-US-AmberNeural',
        'en-US-AnaNeural',
        'en-US-AriaNeural',
        'en-US-AshleyNeural',
        'en-US-BrandonNeural',
        'en-US-ChristopherNeural',
        'en-US-CoraNeural',
        'en-US-DavisNeural',
        'en-US-ElizabethNeural',
        'en-US-EricNeural',
        'en-US-GuyNeural',
        'en-US-JacobNeural',
        'en-US-JaneNeural',
        'en-US-JasonNeural',
        'en-US-JennyMultilingualNeural',
        'en-US-JennyNeural',
        'en-US-MichelleNeural',
        'en-US-MonicaNeural',
        'en-US-NancyNeural',
        'en-US-RogerNeural',
        'en-US-SaraNeural',
        'en-US-SteffanNeural',
        'en-US-TonyNeural'
    ]
    res.render('index', { voices })
});

app.post('/synthesize', async (req, res) => {
    const text = req.body.text;
    const voice = req.body.voice
    const encodedText = encodeURIComponent(text);
    const redirectUrl = `/synthesize?text=${encodedText}&voice=${voice}`;
    res.redirect(redirectUrl);
    //res.redirect(`/synthesize?text=${encodeURIComponent(text)}`);
})

/**
 * @swagger
 * /voices:
 *    get:
 *      description: Returns the list of supported voices as a JSON for text-to-speech
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Returned list of supported voices
 *              schema:
 *                  type: array
 *                  items:
 *                      type: string
 *          500:
 *              description: Internal server error
 */
app.get('/voices', (req, res) => {
    res.status(200).json(voices);
})

/**
 * @swagger
 * /synthesize/:
 *    get:
 *      description: Returns a Buffer object of the audio data from requested text-to-speech synthesis
 *      parameters:
 *          - name: text
 *            in: query
 *            description: Text to synthesize using Text-To-Speech
 *            schema:
 *              type: string
 *          - name: voice
 *            in: query
 *            description: Voice model to use during speech synthesis
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Text-to-speech completed and returned
 *          400:
 *              description: Invalid voice selection
 *          404:
 *              description: Error
 */
app.get('/synthesize', async (req, res, next) => {
    const text = req.query.text
    const voice = req.query.voice
    console.log(`Text to synthesize: ${text}`)
    console.log(`Voice to synthesize: ${voice}`)

    const voices = [
        'en-US-AIGenerate1Neural',
        'en-US-AmberNeural',
        'en-US-AnaNeural',
        'en-US-AriaNeural',
        'en-US-AshleyNeural',
        'en-US-BrandonNeural',
        'en-US-ChristopherNeural',
        'en-US-CoraNeural',
        'en-US-DavisNeural',
        'en-US-ElizabethNeural',
        'en-US-EricNeural',
        'en-US-GuyNeural',
        'en-US-JacobNeural',
        'en-US-JaneNeural',
        'en-US-JasonNeural',
        'en-US-JennyMultilingualNeural',
        'en-US-JennyNeural',
        'en-US-MichelleNeural',
        'en-US-MonicaNeural',
        'en-US-NancyNeural',
        'en-US-RogerNeural',
        'en-US-SaraNeural',
        'en-US-SteffanNeural',
        'en-US-TonyNeural'
    ]

    if (!voices.includes(voice)) {
        var err = "Error: Invalid voice selection"
        console.error(err)
        const error = new Error(err);
        error.status = 400;
        return next(error);
    }

    speechConfig.speechSynthesisVoiceName = voice
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz64KBitRateMonoMp3

    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, undefined)

    synthesizer.speakTextAsync(text, result => {
            if (result.errorDetails) {
                var err = `TTS failed: ${result.errorDetails}`
                console.error(err)
                const error = new Error(err);
                error.status = 404;
                return next(error);
            } else {
                res.setHeader("Content-Type", "audio/mpeg");
                fileSizeInBytes = result.audioData.byteLength
                console.log(`Audio data byte size: ${fileSizeInBytes}.`)
                res.writeHead(200, {
                    "Accept-Ranges": "bytes",
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': fileSizeInBytes})
                res.write(Buffer.from(result.audioData))
                res.end()
            }
            synthesizer.close()
        },
        error => {
            synthesizer.close()
            console.error(`Error during TTS: ${error}`)
            var err = `Error during TTS: ${error}`
            console.error(err)
            const error1 = new Error(err);
            error1.status = 404;
            return next(error);
            
        }
    );

  });

// start server
app.listen(port, ()=> {
    console.log('Server is running on port', port)
})