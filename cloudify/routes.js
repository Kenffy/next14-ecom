const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { uploadFile, deleteFile } = require("./controllers");

dotenv.config();
const router = express.Router();

const secret = process.env.SECRET_KEY;
const root = process.env.ROOT_FOLDER || "root";

const verifyAccessKey = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .send({ message: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = root; // Default path
    const location = req.query.dir || "";

    // Check for a custom path in the query
    uploadPath = location ? path.join(root, location) : root;
    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
    req.location = location;
  },
  filename: (req, file, cb) => {
    const filename = uuid.v4() + "-" + file.originalname;
    cb(null, filename);
    req.originalName = file.originalname;
    req.filename = filename;
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check.
 *     responses:
 *       200:
 *         description: Service is running.
 *         schema:
 *           type: object
 *           properties:
 *              message: string
 */
router.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Kenffy cloud service is running..." });
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Uploads a file.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload.
 *       - in: query
 *         name: dir
 *         type: string
 *         description: Destination path of the file.
 *     responses:
 *       200:
 *         description: File uploaded successfully.
 *         schema:
 *           type: object
 *           properties:
 *              message: string
 *              location: string
 *              fileName: string
 *              url: string
 *       400:
 *          description: Missing parameters of file
 *       401:
 *          description: Unauthorized
 *       500:
 *         description: Unexpected error occured.
 */
router.post("/api/upload", verifyAccessKey, upload.single("file"), uploadFile);

/**
 * @swagger
 * /api/delete:
 *   delete:
 *     summary: Deletes a file.
 *     parameters:
 *       - in: params
 *         name: filename
 *         required: true
 *       - in: query
 *         name: dir
 *         type: string
 *         description: Location path of the file.
 *     responses:
 *       200:
 *         description: File deleted successfully.
 *       400:
 *         description: Missing parameters.
 *       401:
 *          description: Unauthorized
 *       500:
 *         description: Error deleting file.
 */
router.delete("/api/delete/:name", verifyAccessKey, deleteFile);

module.exports = router;
