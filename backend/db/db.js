const mongoose = require("mongoose");
const { boolean, date } = require("zod");
const moment = require("moment");

const todoSchema = new mongoose.Schema({
    title : {
        type: String
    },
    description : {
        type: String
    },
    createdAt : {
        type: String,
        default : ()=>moment().format("DD-MM-YYYY HH:mm:ss") ,
        immutable : true
    }
    ,
    status : {
        type: Boolean,
        default: false
    },
    completeTime : {
        type: String,
        default: null
    }
})

module.exports = mongoose.model("todos", todoSchema);