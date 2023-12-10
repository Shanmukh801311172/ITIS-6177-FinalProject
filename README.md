
# Text to Speech API using Azure AI Services

## Overview
This project provides an API for converting text to speech using Azure AI services. It includes a web interface for user interaction and an underlying Node.js server that handles API requests to Azure's Text to Speech service. The project is designed as part of ITIS 6177 - Final Project by Shanmukh Gorle.

## Features
- **Text to Speech Conversion**: Converts user-inputted text to speech using Azure AI services.
- **Voice Selection**: Allows users to select different voices for speech synthesis.
- **Web Interface**: A user-friendly web interface to input text and listen to the converted speech.
- **API Endpoints**: Includes endpoints for converting text to speech and listing available voices.

## Installation

1. Clone the repository to your local machine.
2. Navigate to the root directory of the project.
3. Install the necessary Node.js dependencies:
   ```bash
   npm install
   ```
4. Set up the `.env` file in the root directory with your Azure AI credentials:
   ```
   SPEECH_KEY=<Your_Azure_Speech_Key>
   SPEECH_REGION=<Your_Azure_Service_Region>
   BASE_URL=<Your_Base_URL>
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```
2. Open a web browser and navigate to `http://localhost:3000`.
3. Use the web interface to enter text, select a voice, and convert it to speech.
4. The API documentation is available at `http://localhost:3000/api-docs`.

## API Endpoints

- `POST /generate`: Converts provided text to speech.
- `GET /voices`: Retrieves a list of available voices from Azure Text to Speech service.

## Web Interface

- **Text Input**: Enter the text you want to convert to speech.
- **Voice Selection**: Choose from a list of available voices.
- **Convert**: Submit the text for conversion and listen to the output.

## Technologies Used

- Node.js
- Express.js
- Azure Cognitive Services Speech SDK
- Swagger for API documentation

## Directory Structure

- `index.html`: Main HTML file for the web interface.
- `styles.css`: Stylesheet for the web interface.
- `script.js`: Client-side JavaScript for handling form submissions and dynamic content.
- `controllers.js`: Server-side controllers for handling API requests.
- `routes.js`: Express routes for the API endpoints.
- `validations.js`: Validation middleware for API requests.
- `app.js`: Main server file.
- `config.js`: Configuration settings for the server and Azure AI services.
- `Userguide.pdf`: A user guide to use the API.

# Deployment

## DigitalOcean Setup and PM2 Management

This section outlines the steps taken to deploy the Text to Speech API on a DigitalOcean server and manage the application using PM2.
Create a DigitalOcean droplet with CentOS 8 and SSH into the server.

### Server Setup

1. **Install NVM (Node Version Manager):**
   ```sh
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
   ```

2. **Load NVM:**
   ```sh
   source ~/.bashrc
   ```

3. **Install Node.js and npm:**
   ```sh
   nvm install node
   ```

4. **Install Additional Packages:**
   ```sh
   yum install epel-release yum-utils firewalld git mariadb-server -y
   ```

5. **Start and Enable firewalld:**
   ```sh
   systemctl start firewalld
   systemctl enable firewalld
   ```

6. **Configure Firewall Rules:**
   ```sh
   firewall-cmd --permanent --zone=public --add-service=http
   firewall-cmd --permanent --zone=public --add-service=https
   firewall-cmd --zone=public --add-port=3000/tcp --permanent
   firewall-cmd --zone=public --add-port=3001/tcp --permanent
   firewall-cmd --zone=public --add-port=3002/tcp --permanent
   firewall-cmd --zone=public --add-port=3003/tcp --permanent
   firewall-cmd --reload
   ```

7. **Check Installed Versions:**
   - Git Version: `git --version`
   - Node.js Version: `node --version`
   - npm Version: `npm --version`

### PM2 Management

1. **Install PM2:**
   After logging into the server, PM2 (Process Manager for Node.js) is installed globally using npm.

2. **Run the Node.js App with PM2:**
   ```sh
   pm2 start app.js --name "my-app" --output /root/output.log --error /root/error.log
   ```

3. **Monitor Application:**
   - To show details about the app: `pm2 show my-app`
   - To view logs: `cat /root/output.log`

The application is now successfully deployed and managed using PM2 on a DigitalOcean server.

## References

### Azure Cognitive Services Speech SDK Quickstart for Text-to-Speech

You can find a comprehensive example and quickstart guide for using Azure Cognitive Services Speech SDK with JavaScript/Node.js for text-to-speech on the official Azure Samples GitHub repository:

[**Azure Cognitive Services Speech SDK Quickstart for Text-to-Speech (JavaScript/Node.js)**](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node/text-to-speech)

This guide provides step-by-step instructions and sample code to help you get started with text-to-speech using the Azure Cognitive Services Speech SDK. It covers setting up the SDK, authentication, and synthesizing text into speech. 

For detailed documentation and more information about the Azure Cognitive Services Speech SDK, refer to the [official Azure Cognitive Services documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/).

Get Speech Services API key from [Microsoft Cognitive Services - Speech Services API](https://azure.microsoft.com/en-us/try/cognitive-services/?api=speech-services)

## Contributions

Contributions are welcome. Please submit a pull request or an issue for any features or fixes.

---

Developed as part of ITIS 6177 - Final Project
Submitted By: Shanmukh Gorle
