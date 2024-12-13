const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const publicUrl = process.env.UPLOAD_SERVICE_URL || "http://localhost:5000";
const root = process.env.ROOT_FOLDER || "root";

const uploadFile = (req, res) => {
  if (req.location || (req.originalName && req.filename)) {
    const filepath = req.location
      ? `${req.location}/${req.filename}`
      : `${req.filename}`;
    res.status(200).json({
      message: "file successfully uploaded.",
      location: req.location || "",
      fileName: req.filename,
      url: `${publicUrl}/${filepath}`,
    });
  } else {
    res.status(400).json({
      error: "Something went wrong. couldn't upload the file.",
    });
  }
};

const deleteFile = (req, res) => {
  const fileName = req.params.name;
  const location = req.query.dir || "";

  if (!fileName) {
    res.status(400).json({ error: "File name is required" });
    return;
  }

  const fileLocation = location ? path.join(location, fileName) : fileName;
  const filePath = path.join(__dirname, root, fileLocation);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).json({ error: "Error deleting file" });
    } else {
      res.status(200).json({
        message: "File successfully deleted.",
      });
    }
  });
};

module.exports = {
  uploadFile,
  deleteFile,
};
