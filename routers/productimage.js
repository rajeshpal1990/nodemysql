var express = require("express");
var multer = require("multer");
var router = express.Router();

var storage = multer.diskStorage({
  
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
  
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

  var upload = multer({ storage: storage });

  router.post("/upload", upload.array("uploads[]", 10), function (req, res) {
    console.log('files', req.files);
    res.send(req.files);
  });

module.exports = router;