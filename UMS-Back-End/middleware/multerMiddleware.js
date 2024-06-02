const multer = require('multer')
const path = require('path')

//storage setting 

const storage = multer.diskStorage({
    destination:'./uploads/',
    filename:function(req,file,cb){
        cb(null,file.filename +'_'+Date.now()+path.extname(file.originalname))
    }
})

//cheching file type and decide to insert or not image 

function checkfileType(file,cb){
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimeType)

    if(extname && mimeType){
        return cb(null,true)
    }else{
        cb('Error: Images Only!');
    }
}

//uploading the image

const upload= multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        checkfileType(file,cb)
    }
}).single('image')

module.exports = upload