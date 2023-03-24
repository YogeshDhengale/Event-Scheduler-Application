const express=require('express')
const mongoose=require("mongoose")
const bodyParser=require('body-parser')
const app=express();
const Event=require('./module/model')
//
mongoose.connect('mongodb+srv://yogesh:yogesh@cluster0.ywc5325.mongodb.net/?retryWrites=true&w=majority')
const db=mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', function(){
    console.log("connected database successfully")
});

app.use(express.json())
app.use(bodyParser.json())


app.post("/v1/events", async (req, res)=>{
    try {
        const event=new Event(req.body);
        await event.save()
        res.status(201).json(event);
        
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
})

app.get("/v1/events", async(re1, res)=>{
    try {
        const events=await Event.find();
        res.status(200).json(events)
        console.log(events)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

app.get("/v1/events/:id", async(re1, res)=>{
    try {
        const event=await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({error: "There is no event with that id"})
        }
        res.status(200).json(event)
        console.log(event)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }
})


app.delete("/v1/events/:id", async (req, res)=>{
    const {id}= req.params;

    try {
        const deletedEvent= await Event.findByIdAndDelete(id);
        if (!deletedEvent){
            return res.status(404).json({error: "There is no event with that id"})
        }
        res.send("Successfull")
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.put("/v1/events/:id", async (req, res)=>{
    try {
        const {title, description, location, startTime, endTime}=req.body;
        const {id}=req.params;

        if(!title || !description || !location || !startTime || !endTime){
            return res.status(400).json({error: "Validation error: All fields are required"})
        }

        const maxlength=100;
        if(title.length > maxlength || description.length > maxlength || location.length > maxlength){
            return res.status(400).json({error: "Validation error: Maximum length exceed"})
        }

        const event =await Event.findById(id);

        if(!event){
            return res.status(404).json({error: 'Event Not Found'})
        }

        event.title=title;
        event.description=description;
        event.location=location;
        event.startTime=startTime;
        event.endTime=endTime;

        await event.save();
        res.send("Successfull")
        res.status(200).json(event);

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Server Error"})
    }
})

app.listen(3000, ()=>{
    console.log("Server Is Started On 3000")
})
