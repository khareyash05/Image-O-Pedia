const express = require('express');
const app = express();
const dotenv  = require('dotenv');
const mongoose = require('mongoose');
const Image = require("./models/imgModel")

const PORT = process.env.PORT || 5000;

dotenv.config({path : './config.env'})
require("./db/conn")

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))
// a get route to get all images from the database
app.get('/', async (req, res) => {
    res.redirect('/'+1)
})
app.get("/:page",async(req,res)=>{
    var perPage = 9
    var page = req.params.page
    try{
        const images = await Image.find().skip((perPage * page) - perPage).limit(perPage).exec()
        res.render('index',{images:images,current:page,pages:Math.ceil(images.length/perPage)+1})
    }catch(err){
        res.json({
            success : false,
            err : err
        }) 
    }
});


// a get request to /show/:id should list details of the image with the given id
app.get("/show/:id",async(req,res)=>{
    try{
        const imgFind = await Image.findById(req.params.id)
        res.render("detail",{imgFind})
        res.json({
            success : true,
            data : imgFind
        })
    }catch(err){
        res.json({
            success : false,
            err : err
        })
    }
})

// a get request to /new should show a form to upload a new image
app.get("/new",(req,res)=>{
    console.log("dfhgufguu");
    res.render("new")
})

// a get request to /:id/edit should show a form to edit the image with the given id
app.get("/show/:id/edit",async(req,res)=>{
    try{
        const imgFind = await Image.findById(req.params.id)
        res.render("edit",{imgFind})
        res.json({
            success : true,
            data : imgFind
        })
    }catch(err){
        res.json({
            success : false,
            err : err
        })
    }
})

// a post request to submit image to the database
app.post("/new",async(req,res)=>{
    const{name,url,details} = req.body
    console.log("image details"+name+url+details);
    if(!name || !url || !details){
        return res.json({
            success : false,
            msg : "Please provide all the fields"
        })
    }
    try{
        const imageCheck = await Image.findOne({imgUrl:url}).exec()
        console.log(imageCheck);
        if(imageCheck){
            return res.json({
                success : false,
                msg : "Image already exists"
            })
        }
        else{
            const image = new Image({imgName:name,imgUrl:url,imgDetails:details})
            console.log(image);
            await image.save()
            res.redirect("/")
        }
    }catch(err){
        console.log(err);
    }
})

// a put request to /:id/edit should submit the form and change the appropriate details from the database for the image with the given id
app.post("/show/:id/edit",async(req,res)=>{
    const{name,url,details} = req.body
    console.log("image details"+name+url+details);
    if(!name || !url || !details){
        return res.json({
            success : false,
            msg : "Please provide all the fields"
        })
    }
    try{
        const image = await Image.findById(req.params.id)
        image.imgName = name
        image.imgUrl = url
        image.imgDetails = details
        await image.save()
        res.redirect("/")
    }catch(err){
        res.json({
            success : false,
            err : err
        })
    }
})

// a get request to /delete/:id should delete the image with the given id
app.get("/show/delete/:id",async(req,res)=>{
    try{
        await Image.findByIdAndDelete(req.params.id)
        res.redirect("/")
    }catch(err){
        res.json({
            success : false,
            err : err
        })
    }
})

app.listen(PORT,()=>{
    console.log("Server is running on port 5000");
});
