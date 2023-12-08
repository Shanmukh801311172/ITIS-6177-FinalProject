const path = require('path');
const config = require('../../config');
const https = require('https');
const VOICES_DIR = path.join(__dirname, '../../converted-voices');

const convertTextToSpeech = async (req, res) => {
  try {
    const sdk = await import('microsoft-cognitiveservices-speech-sdk');
    const filename = "voice.wav";
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(path.join(VOICES_DIR, filename));
    const speechConfig = sdk.SpeechConfig.fromSubscription(config.subscriptionKey, config.serviceRegion);
    const voiceName = req.body.voice || "en-US-JennyNeural";
    speechConfig.speechSynthesisVoiceName = voiceName;
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(req.body.text, (result) => {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("Synthesis finished for text: " + req.body.text);
        res.status(200).sendFile(path.join(VOICES_DIR, filename));
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails);
        res.status(500).send("Error in speech synthesis");
      }
      synthesizer.close();
    }, (err) => {
      console.error("Error - " + err);
      synthesizer.close();
      res.status(500).send("Error in speech synthesis");
    });

  } catch (error) {
    console.error("Error in importing SDK or synthesizing speech: ", error);
    res.status(500).send("Error in speech synthesis process");
  }
};

const listVoices = (req, res) => {
  const subscriptionKey = config.subscriptionKey;
  const options = {
    hostname: 'eastus.tts.speech.microsoft.com',
    path: '/cognitiveservices/voices/list',
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  };
  const httpRequest = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        res.json(parsedData);
      } catch (error) {
        res.status(500).send('Error parsing the response data');
      }
    });
  });

  httpRequest.on('error', (error) => {
    console.error('Error making the request:', error);
    res.status(500).send('Error making the request to Azure service');
  });
  httpRequest.end();
};

module.exports = { convertTextToSpeech, listVoices };
