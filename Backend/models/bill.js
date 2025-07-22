const mongoose = require("mongoose");
const { Schema } = mongoose;

const billSchema = new Schema ({
    bill_id : {
        type : String,
        required : true
    },
    products : [{
        _id : {
        type : String,
        required : true
        },
        name : {
        type : String,
        required : true
        },
        quantity : {
        type : Number,
        required : true
        },
        price : {
        type : Number,
        required : true 
        }
    }],
    discount : {
        type : Number,
        required : true
    },
    total : {
        type : Number,
        required : true
    },
    Date : {
        type : String,
        required : true
    } 
})

module.exports = mongoose.model("bills", billSchema);