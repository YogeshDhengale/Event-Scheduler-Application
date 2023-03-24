const mongoose=require("mongoose")

const eventSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    location: {
        type: String,
        required: true,
        maxlength: 255,
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
})


module.exports=mongoose.model('Event', eventSchema)

