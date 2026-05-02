//Development environment.
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    
};

//Import required modules
let express = require('express')
let app = express()
const path = require('path')
const csv = require('./js/b-dragon.js')


//To read files
let fs = require('fs')
const res = require('express/lib/response')
const csvData = require('./js/b-dragon.js')
const csvDataDragon = require('./js/b-dragon.js')
const csvDataAe = require('./js/b-ae.js')

//Define listening port
let PORT = 3000

//Publish the entire public folder to make it available
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static(__dirname + '/public'));
app.use("/public/css/", express.static(__dirname + '/public/css/'));
app.use('/public/img/', express.static(__dirname + '/public/img/'));
app.use('/public/js/', express.static(__dirname + '/public/js/'));

//Routes
app.get("/",(req,res) => {
    res.sendFile(__dirname + '/public/html/index.html')
});

//Router
app.use("/", csvDataAe);
app.use("/", csvDataDragon);




//Run server
//app.listen(PORT, () =>{`Server running on http://localhost/${PORT}`});
app.listen(process.env.PORT || 3000);
console.log(`running on http://localhost:${PORT}`)