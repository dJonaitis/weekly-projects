// get context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently : true});

// const width = 900;
// const height = 900;

const width = window.innerWidth;
const height = window.innerHeight;

const wallCount = 10;
const elementColour = 'white';
let wallColour = "rgba(255, 255, 255, 255)";

let emitter = {
    radius : 30,
    colour : "rgba(255, 255, 255, 100%)",
    rayColour : "rgba(255, 255, 255, 10%)",
    rays : 2000,
    raySeparationAngle : 0,
    rayLength : 100,
    rayWidth : 1,
}

let person = {
    size: 10,
    colour : "rgba(255, 255, 255, 100%)"
}

emitter.raySeparationAngle = Math.PI * 2 / emitter.rays
console.log(emitter.raySeparationAngle, 'radians')

ctx.canvas.width = width;
ctx.canvas.height = height;


let wallsStart = [];
let wallsEnd = [];
let people = [];

for(var i = 0; i < wallCount; i++){
    wallsStart.push([Math.floor(Math.random()*width), Math.floor(Math.random()*height)])
    wallsEnd.push([Math.floor(Math.random()*width), Math.floor(Math.random()*height)])
    people.push([Math.floor(Math.random()*width), Math.floor(Math.random()*height)])
}

function drawBackground(){
    //fill background with black
    ctx.beginPath()
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //fill border and walls
    ctx.beginPath()
    ctx.strokeStyle = wallColour;
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);
    
    for(var i = 0; i < wallsStart.length; i++){
        ctx.beginPath();
        ctx.moveTo(wallsStart[i][0], wallsStart[i][1])
        ctx.lineTo(wallsEnd[i][0], wallsEnd[i][1])
        ctx.stroke();
    }
}

// code for capturing mouse position

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

let mousePos = {x: 100, y: 100}

canvas.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(canvas, evt);
    // console.log('Mouse position:', mousePos.x, mousePos.y);
}, false);

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    if((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }
    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))  
    if(denominator === 0) {
        return false
    }

        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
    if(ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }  
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {x, y}
}

function draw(){
    drawBackground();
    // console.log('Mouse position:', mousePos.x, mousePos.y);


    circCenter = {
        x: mousePos.x - emitter.radius / 2,
        y: mousePos.y - emitter.radius / 2
    }
    ctx.beginPath();
    ctx.fillStyle = emitter.colour;
    ctx.arc(circCenter.x, circCenter.y, emitter.radius, Math.PI*2, 0)
    ctx.fill();

    
    for(var theta = 0; theta < emitter.rays; theta++){
        // RAY CASTING STRUCTURED ENGLISH
        // 1. cast rays to the edge of the canvas
        // 2. for loop through the arrays of the lines for each ray and check whether ray touches any line
        // 3. set end point for ray at point of intersection
        ctx.beginPath();
        ctx.strokeStyle = emitter.rayColour;
        let rayEnd = {
            x: circCenter.x,
            y: circCenter.y
        };
        ctx.moveTo(circCenter.x, circCenter.y);
        rayEnd.x = circCenter.x + Math.cos(theta * emitter.raySeparationAngle) * width // cosine = adjacent/hypotenuse
        rayEnd.y = circCenter.y + Math.sin(theta * emitter.raySeparationAngle) * height // sine = opposite/hypotenuse
        for(var i = 0; i < wallsStart.length; i++){
            let intersection = intersect(circCenter.x, circCenter.y, rayEnd.x, rayEnd.y, wallsStart[i][0], wallsStart[i][1], wallsEnd[i][0], wallsEnd[i][1])
            if(intersection){
                rayEnd.x = intersection.x;
                rayEnd.y = intersection.y;
            }
        }
        for(var i = 0; i < people.length; i++){
            let intersection = intersect(circCenter.x, circCenter.y, rayEnd.x, rayEnd.y, people[i][0], people[i][1], people[i][0] + person.size, people[i][1] + person.size) 
            if(intersection){
                ctx.beginPath();
                ctx.fillStyle = person.colour;
                // let gradient = ctx.createLinearGradient(intersection.x, intersection.y, intersection.x + 5, intersection.y + 5)
                // gradient.addColorStop(0, person.colour);
                // gradient.addColorStop(1, 'black')
                // ctx.fillStyle = gradient;
                ctx.fillRect(people[i][0], people[i][1], person.size, person.size)
            }
        }
        ctx.lineTo(rayEnd.x, rayEnd.y)
        ctx.lineWidth = emitter.rayWidth;
        ctx.stroke();
    }
    
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

