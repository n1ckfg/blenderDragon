/*The logic has to convert the String coming from the frontend
to a CSV with 3 columns, with all the keyframes. That correspond to the 3 axes
of movement or vTRACK, vTILT, vPAN in KUPER Motion Control nomenclature.
That CSV (without headers) will be interpreted in Adobe After Effects as
1 Row == 1 Frame, therefore it must come "Baked" from Blender (all frames with a keyframe).
To do that AE uses scripts part of the software integration set.
Thus we complete the unidirectional integration between Blender 3D ==> App BlenderConvert ==> Dragonframe, After Effects.
*/


//Copy the function from b-dragon
//This logic module reads CSV, transforms it to stream and finally returns an array with arrays of keyframe data 
const fs = require('fs');
var express = require('express')
var router = express.Router()


router.post('/b-ae', function(req,res){ 

    try {
    var arrFetch = req.body.file
    var dir = req.body.dir_export//Define broader scope outside to use it in b-dragon.js

        //Array container variable
        const results = [];

        //Create the function to read CSV using CSV-Parser
        function csvDataAe() {  
      
            function cargaDatosExp() { 

                    var arr2 = JSON.parse(arrFetch)//Parse data from fetch. It was a json
                    var arr = arr2;
                    console.log("Stream with Fetch for AE route-Check what it captures")
                    console.log(arr)

        //vTrack+ 
                    var posX =[];
                    
                    for (let i = 0; i < arr.length/3 ; i = i + 2) {
                    
                        const a = arr[i];
                        const b = (parseFloat(arr[i+1])).toFixed(3);

                        posX.push(`${a},${b}`)       
                    };
                    console.log("vTRACK - BlenderAE")
                    console.log(posX)

        //vTILT              
                    //Variable with multiplier value to convert Radians to Degrees. Blender exports in Radians.
                    const convertRad = 180/Math.PI;
        
                    var rotX =[];

                    //This function is for x axis rotation values. vTILT
                    
                    for (let i = arr.length/3; i < arr.length/3 + (arr.length/3); i = i + 2) {
                    
                        let resp = arr[i];
                        
                        let a = resp == 0 ? 1: resp;//Ternary. If the response equals 0, then change to 1 else it equals the response
                        let b = ((parseFloat(arr[i+1])) * convertRad).toFixed(3);//This index gets the previous value to the one iterated by the general loop
                        rotX.push(`${b}`)    
                    };
                    console.log("vTILT - BlenderAE")
                    console.log(rotX)   

        //vPAN
                
                    var rotZ =[];

                    for (let i =arr.length/3 + (arr.length/3); i < arr.length; i = i + 2) {
                    
                        let resp = arr[i];
                        
                        let a = resp == 0 ? 1 : resp;//Ternary. If the response equals 0, then change to 1 else it equals the response
                        let b = ((parseFloat(arr[i+1])) * convertRad).toFixed(3);//This index gets the previous value to the one iterated by the general loop
                        rotZ.push(`${b}`)       
                    };
                    console.log("vPAN - BlenderAE")
                    console.log(rotZ)

        //Add values to then create a CSV with the necessary format

                    var arrCsv = [];
                    posX.forEach(agregaColumn);

                    function agregaColumn(item,i,arr) {
                        arr[i] = `${item},${rotX[i]},${rotZ[i]}`
                        arrCsv.push(arr[i])
                    };
                    console.log("See if it adds value at the end of each array value")
                    console.log(arrCsv)

        //Write CSV
    
                    function csvWriter() {

                        //This function writes the values of the 3 components, that is TRACK, TILT and PAN.      
                        
                        var csv = "";

                        for (let i of arrCsv) {

                            //csv += i.join(",") + "\r\n"
                            csv +=  i + "\r\n"

                        };
                        console.log("see what pushes to csv variable")
                        console.log(csv)

                        fs.writeFile(`${dir}.csv`, csv, (err) => {
                            if (err) throw err;
                            console.log('CSV file written');
                                //console.log(fs.readFileSync("/Users/mauricio/Desktop/arcm/movInterpLineal2.arcm","utf8"))
                            });    
                        };
                        csvWriter()
                    };
            cargaDatosExp();
            };
        csvDataAe();   
    } catch (error) {
        console.log(error)
    };
    res.redirect('back');
    res.end()
});

//Export the router
module.exports =  router;