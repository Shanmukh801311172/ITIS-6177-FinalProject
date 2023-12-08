require('dotenv').config();
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const routes = require('./src/routes/routes');
const config = require('./config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Text to Speech API',
      version: '1.0.0',
      description: 'Text to Speech API using Azure AI',
    },
    servers: [{
      url: `http://198.199.83.188:${config.port}`,
    }],
  },
  apis: ['./src/routes/routes.js'],
};
const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
app.use(express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
