//This logic module reads CSV, transforms it to stream and finally returns an array with arrays of keyframe data 
const fs = require('fs');
const { parse } = require('csv-parse');
const parser = parse(
    {columns: true}, 
    function (err, records) {
	console.log(records);
});
const { create } = require("xmlbuilder2")
const { builtinModules } = require('module');
const { on } = require('events');
const { resourceLimits } = require('worker_threads');
const res = require('express/lib/response');

//Router
var express = require('express')
var router = express.Router()

/*We organize everything inside a Router. This allows taking variables directly
from Fetch saving the problem of transferring from Server to a Module*/
router.post('/b-dragon', function(req,res){

    //Pass what was in POST method from server.js
    //res.sendFile(__dirname + '/public/html/index.html');

    try {
    var arrFetch = req.body.file
    var dir = req.body.dir_export//Define broader scope outside to use it in b-dragon.js

        //Array container variable
        const results = [];

        //Create the function to read CSV using CSV-Parser
        function csvDataDragon() {  
      
            function cargaDatosExp() {
            //Reformulate function to divide array from the reader immediately   
                function csvToDragonLineal() {

                    //Try to simplify function that creates multidimensional array
                    //Here we contain all the data
                    /*
                    let file = results;
                    var arr = results.toString().split(",");
                    */
                    /*
                    let arrNum = arrFetch.map(str => {
                        return Number(str);
                      });
                    */
                    //var arr = arrNum;
                    var arr2 = JSON.parse(arrFetch)//Parse data from fetch. It was a json
                    var arr = arr2;
                    console.log("See what loads the csv variable from fetch")
                    console.log(arr)

        //Values of vTrack+ according to Kuper MOCO nomenclature, translation in X+ axis.
                    //PositionX
                    var keyMocoPosX =[];
                    var keyMocoCtrlPointPosX =[];
                    var keyMocoCtrlPointPosXRep = []; 
        
                
                    //Try getting the values but with a For loop with two variables for the same array
                    for (let i = 0; i < arr.length/3 ; i = i + 2) {
                        
                        
                        const a = arr[i];
                        const b = (parseFloat(arr[i+1])).toFixed(3);//This index gets the previous value to the one iterated by the general loop

                        //textPos.push(element)
                        keyMocoPosX.push(`<scen:points x="${a}" y="${b}" type="5"/>`)
                        keyMocoCtrlPointPosX.push(`<scen:controlPoints x="${a}" y="${b}"/>`)
                        keyMocoCtrlPointPosXRep.push(`<scen:controlPoints x="${a}" y="${b}"/>`)
                        
                    }

                    //To repeat the control points we will join arrays and then remove start and end with Pop() and Merge(). This Function is for vTRACK 
                    let run1 = 0, first1 = 0, second1 = 0;
                    const keyMocoCtrlPointPosXWrite = [];

                    while(run1 < keyMocoCtrlPointPosX.length + keyMocoCtrlPointPosXRep.length) {

                        if(first1 > second1){
                            keyMocoCtrlPointPosXWrite[run1] = keyMocoCtrlPointPosXRep[second1];
                        second1++;
                        }else{
                            keyMocoCtrlPointPosXWrite[run1] = keyMocoCtrlPointPosX[first1];
                        first1++;
                        }
                        run1++;
                    };
                    //Remove the start and the end
                    keyMocoCtrlPointPosXWrite.shift()
                    keyMocoCtrlPointPosXWrite.pop()
                    //Check if it has the required format
                    console.log("check the new array, if it writes and has repeated x pos control points")
                    console.log(keyMocoCtrlPointPosXWrite);

        //End reformulation for vTRACK. Unit tests ok.


        //Develop function to read rotation in X axis or vTILT movement according to Kuper MOCO nomenclature
                
                    //Variable with multiplier value to convert Radians to Degrees.
                    const convertRad = 180/Math.PI;
        
                    //Variables for X rot data
                    console.log("X rotation values")
                    var keyMocoRotX =[];
                    var keyMocoCtrlPointRotX =[];
                    var keyMocoCtrlPointRotXRep = []; 

                    //This function is for x axis rotation values. vTILT
                    
                    for (let i = arr.length/3; i < arr.length/3 + (arr.length/3); i = i + 2) {
                    
                        let resp = arr[i];
                        
                        let a = resp == 0 ? 1: resp;//Ternary. If the response equals 0, then change to 1 else it equals the response
                        let b = ((parseFloat(arr[i+1])) * convertRad).toFixed(3);//This index gets the previous value to the one iterated by the general loop
                
                        console.log("Check the ternary of vTILT")
                        console.log(a)
                        //textPos.push(element)
                        keyMocoRotX.push(`<scen:points x="${a}" y="${b}" type="5"/>`)
                        keyMocoCtrlPointRotX.push(`<scen:controlPoints x="${a}" y="${b}"/>`)
                        keyMocoCtrlPointRotXRep.push(`<scen:controlPoints x="${a}" y="${b}"/>`)
                        
                    };
                
                    //To repeat the control points we will join arrays and then remove start and end with Pop() and Merge(). This for X axis. 
                    let run2 = 0, first2 = 0, second2 = 0;//These variables are already declared above
                    const keyMocoCtrlPointRotXWrite = [];

                    while(run2 < keyMocoCtrlPointRotX.length + keyMocoCtrlPointRotXRep.length) {

                        if(first2 > second2){
                            keyMocoCtrlPointRotXWrite[run2] = keyMocoCtrlPointRotXRep[second2];
                        second2++;
                        }else{
                            keyMocoCtrlPointRotXWrite[run2] = keyMocoCtrlPointRotX[first2];
                        first2++;
                        }
                        run2++;
                    };
                    
                    //Remove the start and the end
                    keyMocoCtrlPointRotXWrite.shift()
                    keyMocoCtrlPointRotXWrite.pop()
                    //Check if it has the required format
                    console.log("check the new array, if it has repeated x rot control points");
                    console.log(keyMocoCtrlPointRotXWrite);

        //Develop the function to process rotation in Z axis or vPAN movement according to Kuper MOCO nomenclature
                    //Declare the variables to save Z rot data
                
                    var keyMocoRotZ =[];
                    var keyMocoCtrlPointRotZ =[];
                    var keyMocoCtrlPointRotZRep = []; 
                
                    //Function to get Z axis values. vPAN

                    for (let i =arr.length/3 + (arr.length/3); i < arr.length; i = i + 2) {
                    
                        let resp = arr[i];
                        
                        let a = resp == 0 ? 1 : resp;//Ternary. If the response equals 0, then change to 1 else it equals the response
                        let b = ((parseFloat(arr[i+1])) * convertRad).toFixed(3);//This index gets the previous value to the one iterated by the general loop
                    
                        console.log("see what Z rot ternary responds.a")
                        console.log(a)
                        //textPos.push(element)
                        keyMocoRotZ.push(`<scen:points x="${a}" y="${b}" type="5"/>`)
                        keyMocoCtrlPointRotZ.push(`<scen:controlPoints x="${a}" y="${b}"/>`)
                        keyMocoCtrlPointRotZRep.push(`<scen:controlPoints x="${a}" y="${b}"/>`)
                        
                    };
                    
                    //To repeat the control points we will join arrays and then remove start and end with Pop() and Merge(). This for X axis. 
                    let run3 = 0, first3 = 0, second3 = 0;//These variables are already declared above
                    const keyMocoCtrlPointRotZWrite = [];

                    while(run3 < keyMocoCtrlPointRotZ.length + keyMocoCtrlPointRotZRep.length) {

                        if(first3 > second3){
                            keyMocoCtrlPointRotZWrite[run3] = keyMocoCtrlPointRotZRep[second3];
                        second3++;
                        }else{
                            keyMocoCtrlPointRotZWrite[run3] = keyMocoCtrlPointRotZ[first3];
                        first3++;
                        }
                        run3++;
                    };
                    //Remove the start and the end
                    keyMocoCtrlPointRotZWrite.shift()
                    keyMocoCtrlPointRotZWrite.pop()
                    //Check if it has the required format
                    console.log("check the new array for Z rot, if it has repeated control points")
                    console.log(keyMocoCtrlPointRotZWrite);


        //Here we develop the function that generates the XMLBuilder file and writes it to a directory
        //This function is for linear interpolation of the keyframes, therefore the control points are the same as the keyframes

                    function arcmWriter() {

                        //This function writes the values of the 3 components, that is TRACK, TILT and PAN.      
                        const root =`
                        <?xml version="1.0" encoding="UTF-8"?>
                            <scen:scene xmlns:scen="http://caliri.com/motion/scene" cameraOperator="">
                                <scen:axis preset="eMotimo" pulseRate="10000" units="m" stepsPerUnit="444.444" graphSolo="true" connectionType="1" graphColor="-244974" integral="false" name="vTRACK" base="0" connectionChannel="3" runMaxVelocity="40000" runMaxAcceleration="200000" viewPosition="20">
                                    ${keyMocoPosX.join(" ")}
                                    ${keyMocoCtrlPointPosXWrite.join(" ")}      
                                </scen:axis> 
                                <scen:axis preset="eMotimo" pulseRate="10000" units="deg" stepsPerUnit="444.444" graphSolo="true" connectionType="1" graphColor="-461291" integral="false" name="vTILT" base="0" connectionChannel="2" runMaxVelocity="40000" runMaxAcceleration="200000" viewPosition="20">
                                    ${keyMocoRotX.join(" ")}
                                    ${keyMocoCtrlPointRotXWrite.join(" ")}      
                                </scen:axis>
                                <scen:axis preset="eMotimo" pulseRate="10000" units="deg" stepsPerUnit="444.444" graphSolo="true" connectionType="1" graphColor="-11039745" integral="false" name="vPAN" base="0" connectionChannel="1" runMaxVelocity="40000" runMaxAcceleration="200000" viewPosition="20">
                                    ${keyMocoRotZ.join(" ")}
                                    ${keyMocoCtrlPointRotZWrite.join(" ")}      
                                </scen:axis>
                            </scen:scene>`  

                            //We use the join() method to remove commas from array
                            // Convert to XML string
                            const xml = create(root)
                            const xmlExport = xml.end({ prettyPrint: true })
                            console.log(xmlExport)
                            

                            //We finally write the .ARCM file   
                            fs.writeFile(`${dir}.arcm`, xmlExport, (err) => {
                                if (err) throw err;
                                console.log('File .arcm written!');
                                //console.log(fs.readFileSync("/Users/mauricio/Desktop/arcm/movInterpLineal2.arcm","utf8"))
                                });    
                            }; 
                        
                            arcmWriter();//Self-execute the function that takes the data and writes it. End logic.         
                    };

                var arr = results //put in the array variable the results of reading the CSV
                //console.log("arr results further out. NOT processed by For Loop")
                //console.log(arr)
                csvToDragonLineal()
            }
            cargaDatosExp();
        };
        csvDataDragon();

    } catch (error) {
        console.log(error)
    };
    res.redirect('back');
    res.end()
})

//Export the router
module.exports =  router;