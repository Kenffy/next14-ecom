const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");
const routes = require("./routes");

dotenv.config();
const app = express();

const port = process.env.PORT || 5001;
const root = process.env.ROOT_FOLDER || "root";

app.use(express.json());
app.use(cors());

// static files
app.use(express.static(root));
app.use("/", express.static(__dirname + root));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", routes);

app.listen(port, () => {
  console.log(`Cloud Kenffy service is running on port ${port}`);
});
