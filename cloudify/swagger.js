const swaggerJsDoc = require("swagger-jsdoc");
const dotenv = require("dotenv");

dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Kenffy Mini Cloud",
      version: "1.0.0",
      description: "API for uploading and deleting files",
    },
    servers: [
      {
        url: process.env.UPLOAD_SERVICE_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
