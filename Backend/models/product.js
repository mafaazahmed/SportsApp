const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    img : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model("products", productSchema);