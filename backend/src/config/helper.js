

const multer  = require('multer')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = './src/uploads'
        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName); // Create the folder if it doesn't exist
        }
        cb(null, folderName);
      },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = { upload }