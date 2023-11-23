const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;
const subscriptionKey = process.env.SPEECH_KEY;
const serviceRegion = process.env.SPEECH_REGION;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Text to Speech API',
      version: '1.0.0',
      description: 'Text to Speech API using Azure AI',
    },
    servers: [],
  },
  apis: ['./app.js'],
};

const generateLimiter = rateLimit({
  windowMs: 5 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(400).send("Multiple requests received. 5 seconds timeout.");
  },
});

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/generate", generateLimiter);
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * @swagger
 * /generate:
 *   post:
 *     summary: Generate speech from text
 *     description: Converts text to speech using Azure AI services.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to be converted to speech.
 *                 example: Hello world
 *               voice:
 *                 type: string
 *                 description: The voice to be used for speech synthesis.
 *                 example: en-US-JennyNeural
 *     responses:
 *       200:
 *         description: Audio file generated successfully.
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request, invalid input data.
 *       500:
 *         description: Server error or issue with Azure AI services.
 */
app.post('/generate', async (req, res) => {
  if (req.body.text == null) {
    res.status(400).send("Text is null");
    return;
} else if (req.body.text.length === 0) {
    res.status(400).send("Text is empty");
    return;
} else if (req.body.text.length > 300) {
    res.status(400).send("Text length exceeds 100 characters");
    return;
}
  import('microsoft-cognitiveservices-speech-sdk').then((sdk) => {
    const filename = "voice.wav";
    var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    const voiceName = req.body.voice || "en-US-JennyNeural";
    speechConfig.speechSynthesisVoiceName = voiceName;
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(req.body.text, function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("Synthesis finished.");
        res.sendFile(path.join(__dirname, filename));
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails + "\nDid you update the subscription info?");
        res.status(500).send("Error in speech synthesis");
      }
      synthesizer.close();
    }, function (err) {
      console.trace("Error - " + err);
      synthesizer.close();
      res.status(500).send("Error in speech synthesis");
    });
  }).catch((error) => {
    console.error(error);
    res.status(500).send("Error in importing SDK");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
