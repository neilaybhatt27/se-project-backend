const mongoose = require("mongoose");
const fs = require("fs");

const Schema = mongoose.Schema;

const defaultImageData = fs.readFileSync("./defaults/default-img.jpg");

const BookSchema = new Schema({

    userid : {
        type: Schema.Types.ObjectId,
        ref : 'User',
        required:true
    },

    title : {
        type: String,
        required : true
    },

    description : {
        type: String,
        required : true
    },

    author: {
        type : String,
        required: true
    },

    genre : {
        type : String,
        required: false
    },

    status : {
        type : Boolean,
        default : true
    },

    bookimage: {
        data: {
            type: Buffer,
            default: defaultImageData
        },
        contentType: {
            type: String,
            default: "default-image.jpg"
        }
    },
    
    location: {
        type: {
                type: String,
                default: 'Point',
            },
        coordinates: [Number]
    },
    
})

BookSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Book", BookSchema);