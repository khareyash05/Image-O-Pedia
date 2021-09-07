const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    imgName : {
        type : String,
        required : true
    },
    imgUrl : {
        type : String,
        required : true
    },
    imgDetails : {
        type : String,
        required : true
    }
})
const Image = mongoose.model('Imgpedia',imgSchema)

module.exports = Image