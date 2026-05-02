//var { raw } = require("express");

//Selecting all required elements
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = document.querySelector("button"),
input = dropArea.querySelector("input");

//This is a global variable
var file;

//This logic changes the "form action" to send to ARCM/CSV Route. Function below saves checkbox value in "route" var.

var route =''

document.addEventListener("change", function() {
    
    let a = document.getElementById("ch1")
    let b = document.getElementById("ch2")
    //user message text
    //let texto = document.getElementById("text-option")
    
    
    //toggle
    b.checked = !a.checked 
   
    if (b.checked == true) {
        route = b.value
        document.getElementById("text-option").innerHTML = "csv"
    } else if(a.checked == true) {
        route = a.value
        document.getElementById("text-option").innerHTML = "arcm";
    } else {
        console.log("A click is required on an option to process the data")
    };
    console.log(a.checked)
    console.log(b.checked)
});
console.log("checking if route loads outside the switch function")
console.log(route)


//If user click on the button then the input also clicked
button.onclick = () => {

    input.click;
};

input.addEventListener("change", function() {
    /*Getting user select file and [0]
    this mean if user select multiple files then we'll 
    select only the first one*/
    file = this.files[0]
});

//If user drag File Over DragArea
dropArea.addEventListener("dragover", (event)=> {
    event.preventDefault(); //Preventing default behaviour
    console.log("File is over DragArea")
    dropArea.classList.add("active");
    dragText.textContent = "Release to upload file";
});

//If user leave dragged File from DragArea
dropArea.addEventListener("dragleave", ()=> {
    console.log("File is outside of DragArea")
    dropArea.classList.remove("active");
    dragText.textContent = "Drag and drop to upload file";
});


//If user drop File in DropArea
dropArea.addEventListener("drop", (event)=> {
    event.preventDefault(); //Preventing default behaviour
    dragText.textContent = "File uploaded";
    console.log("File is dropped in DragArea")
    /*Getting user select file and [0]
    this mean if user select multiple files then we'll 
    select only the first one*/
    file = event.dataTransfer.files[0];
    let fileType = file.type;
    console.log(fileType)
    console.log("See what loads the File variable defined outside")
    console.log(file)

    //Validate extension via JS
    let validExtensions = ["text/csv"]

    if (validExtensions.includes(fileType)) {
        //From here reads file to get data to use in graphs
        let fileReader = new FileReader();//Creating a news Reader Object
        //console.log("here we see what FileReader loads after validating")
        //console.log(fileReader)

        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let datos = fileURL.split("\r\n")
            let datos_2 = datos.pop()
            let arr = datos.toString().split(",");
            console.log("see if we have arrays of unit strings")
            console.log(arr)

            //Request body only loads field input, missing file
            form_id.addEventListener('submit', e => {
            let file = JSON.stringify(arr);//Convert to string to be able to send with Fetch the variable with Array
            console.log("See if it loads CSV values inside Fetch function")
            console.log(file)
            
            e.preventDefault()
            let form = {file}//Here we add variable with object defined before and send succeeded ;)
                new FormData(form_id).forEach((value,key) => form[key] = value)
    
                fetch(route, {
                    method:'POST',
                    headers: {
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify(form),
                })
                //.then((res) => res.json())
                .then(data => console.log(data))
                .catch((err) => console.log(err))  
            })

            //Variables to save keyframe data
            const resPosXvTRACK = []; //x variables for graph
            const resPosYvTRACK = []; //y variables for graph
            const resPosXvTILT = []; //x variables for graph
            const resPosYvTILT = []; //y variables for graph
            const resPosXvPAN = []; //x variables for graph
            const resPosYvPAN = []; //y variables for graph
           
            /*Important*/

            /*This loop takes array length value to capture keyframes value corresponding to number of values
            so it adjusts automatically and there is no need to enter value to capture corresponding ones.
            We will apply this same in backend to simplify function and remove a value to introduce in DOM*/
            
            //X axis keyframes vTRACK
            for (let a = 0; a < arr.length/3; a = a + 2) {
                let element = arr[a]
                resPosXvTRACK.push(element)
            };

            /*Same as above but testing with readings of more keyframes from CSV*/
            //Y axis keyframes vTRACK
            for (let b = 1; b < arr.length/3 + 1; b = b + 2) {
                let element = arr[b]
                resPosYvTRACK.push(element)
            };

            //Constant value to convert rotation to degrees in radians
            const convertRad = 180/Math.PI;

            //X axis keyframes vTILT
            for (let a = arr.length/3; a < arr.length - arr.length/3; a = a + 2) {
                let element = arr[a]
                resPosXvTILT.push(element)
            };

            /*Same as above but testing with readings of more keyframes from CSV*/
            //Y axis keyframes vTILT
            for (let b = arr.length/3 + 1; b < arr.length - arr.length/3; b = b + 2) {
                let element = arr[b] * convertRad
                resPosYvTILT.push(element)
            };

            //Z axis keyframes vPAN
            for (let a = arr.length/3 + arr.length/3; a < arr.length ; a = a + 2) {
                let element = arr[a]
                resPosXvPAN.push(element)
            };

            /*Same as above but testing with readings of more keyframes from CSV*/
            //Z axis keyframes vPAN
            for (let b = arr.length/3 + arr.length/3 + 1; b < arr.length ; b = b + 2) {
                let element = arr[b] * convertRad
                resPosYvPAN.push(element)
            };

//Here we will add the ChartJS logic
//We read the same data as from back to generate movement graph

                const colorGrilla = '#606060'

                const myForm = document.getElementById("form_id");
                const csvFile = document.getElementById("csvFile");

                myForm.addEventListener("submit", function (e) {
                    e.preventDefault();   
                    //We load the .csv and create a file reader by JS Object
                    const input = csvFile.files[0];
                    const reader = new FileReader();
                    
                    //We define what the function does when loading the .csv file
                    reader.onload = function (event) {
                        console.log(event.target.result); // the CSV content as string
                    };
                    //console.log("This response is from frontend - graph.js")
                    //console.log("File sent");
                    //reader.readAsText(input)//here there is a problem with argument 1
                    //console.log(input)
                });


                //Configuration
                const labels = resPosXvTRACK;

                const data = {
                    labels: labels,
                    datasets: [{
                    label: 'vTILT',
                    backgroundColor: 'green',
                    borderColor: 'green',
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15,
                    data: resPosYvTILT,
                    },{
                    label: 'vPAN',
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15,
                    data: resPosYvPAN,
                    }],
                };

                const config = {
                    type: 'line',
                    data: data,
                    options: {    
                        scales: {
                            x:{
                                grid: {
                                    display:true,
                                    color:colorGrilla,
                                }
                            },
                            y:{
                                grid: {
                                    display:true,
                                    color:colorGrilla,
                                }
                            },
                            
                        }
                    }  
                };

                //Render
                const myChart = new Chart(
                    document.getElementById('myChart'),
                    config
                );

//End chart.js logic

//Here we will add ChartJS02 logic
//We read the same data as from back to generate movement graph

                const myForm2 = document.getElementById("form_id");
                const csvFile2 = document.getElementById("csvFile");

                myForm.addEventListener("submit", function (e) {
                    e.preventDefault();
                    //We load the .csv and create a file reader by JS Object
                    const input = csvFile.files[0];
                    const reader = new FileReader();
                    
                    //We define what the function does when loading the .csv file
                    reader.onload = function (event) {
                        console.log(event.target.result); // the CSV content as string
                    };
                    //console.log("This response is from frontend - graph.js")
                    //console.log("File sent");
                    //reader.readAsText(input)//Also problem with argument
                    //console.log(input)
                });


                //Configuration
                const labels2 = resPosXvTRACK;

                const data2 = {
                    labels: labels2,
                    datasets: [{
                    label: 'vTRACK',
                    backgroundColor: 'red',
                    borderColor: 'red',
                    pointStyle: 'circle',
                    pointRadius: 10,
                    pointHoverRadius: 15,
                    data: resPosYvTRACK,
                    },
                    ],
                };

                const config2 = {
                    type: 'line',
                    data: data2,
                    options: {
                        scales: {
                            x:{
                                grid: {
                                    display:true,
                                    color:colorGrilla,
                                }
                            },
                            y:{
                                grid: {
                                    display:true,
                                    color:colorGrilla,
                                }
                            },
                            
                        }
                    }
                };

                //Render
                const myChart2 = new Chart(
                    document.getElementById('myChart2'),
                    config2
                );

//End chart.js logic
        }

        fileReader.readAsText(file)//was missing file, input file

    } else {
        alert("This file is not valid!")
        dropArea.classList.remove("active")
    }
});