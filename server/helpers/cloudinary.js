// server/helpers/cloudinary.js 

const cloudinary = require('cloudinary').v2;

const multer = require('multer');

cloudinary.config({
    cloud_name: 'dcctsoam8', 
    api_key: '444478558688429', 
    api_secret: 'qcEW7ygY5aD1LnWIqB5gVH_bzrU'    // Click 'View API Keys' above to copy your API secret
    });
    
    
const storage = new multer.memoryStorage();

async function imageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file, {
        resource_type : 'auto',
    });
    return  result;
}

const upload = multer({storage});

module.exports = {upload, imageUploadUtil };