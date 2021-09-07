const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://yash:"+process.env.PSW+"@cluster0.73ns4.mongodb.net/"+process.env.COL+"?retryWrites=true&w=majority",{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(() =>{
    console.log(`Successfull connection`)
}).catch((err) => console.log(`no connection`))