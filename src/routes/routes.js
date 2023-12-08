const express = require('express');
const router = express.Router();
const { generateLimiter } = require('../middlewares/middlewares');
const { validateTextToSpeech, checkValidationResult } = require('../validations/validations');
const { convertTextToSpeech, listVoices } = require('../controllers/controller');

/**
 * @swagger
 * /generate:
 *   post:
 *     summary: Convert text to speech
 *     description: Converts provided text to speech using Azure AI services.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
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
 *       400:
 *         description: Bad request, invalid input data.
 *       500:
 *         description: Server error or issue with Azure AI services.
 */
router.post('/generate', generateLimiter, validateTextToSpeech, checkValidationResult, convertTextToSpeech);

/**
 * @swagger
 * /voices:
 *   get:
 *     summary: List available voices
 *     description: Retrieves a list of available voices from Azure Text to Speech service.
 *     responses:
 *       200:
 *         description: A list of available voices.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Name:
 *                     type: string
 *                     description: Unique name of the voice.
 *                   DisplayName:
 *                     type: string
 *                     description: Display name of the voice.
 *                   LocalName:
 *                     type: string
 *                     description: Localized name of the voice.
 *                   ShortName:
 *                     type: string
 *                     description: Shortened name of the voice.
 *                   Gender:
 *                     type: string
 *                     description: Gender of the voice.
 *                   Locale:
 *                     type: string
 *                     description: Locale of the voice.
 *                   LocaleName:
 *                     type: string
 *                     description: Full name of the locale.
 *                   SampleRateHertz:
 *                     type: string
 *                     description: Sample rate in hertz.
 *                   VoiceType:
 *                     type: string
 *                     description: Type of the voice (e.g., Neural).
 *                   Status:
 *                     type: string
 *                     description: Availability status of the voice.
 *                   WordsPerMinute:
 *                     type: integer
 *                     description: Speech rate in words per minute.
 *       500:
 *         description: Error in fetching the list of voices.
 */
router.get('/voices', listVoices);

module.exports = router;
