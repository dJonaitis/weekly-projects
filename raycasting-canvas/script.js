// get context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently : true});

const width = 900;
const height = 900;

const elementColour = 'white';
let wallColour = "rgba(112, 128, 144, 255)";

let emitter = {
    radius : 30,
    colour : 'white',
    rays : 10,
    raySeparationAngle : 0,
    rayLength : 100,
    rayWidth : 1,
    test: this.rays
}

emitter.raySeparationAngle = Math.PI * 2/ emitter.rays
console.log(emitter.raySeparationAngle)

ctx.canvas.width = width;
ctx.canvas.height = height;


function drawBackground(){
    //fill background with black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //fill border and walls
    ctx.strokeStyle = wallColour;
    ctx.lineWidth = 15;
    ctx.strokeRect(0, 0, width, height);
    
    ctx.fillStyle = wallColour;
    ctx.fillRect(width - width / 3, height / 4 * 3, 30, height / 4)
    ctx.fillRect(0, height / 3, width / 5, height / 4)
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
    // console.log('Colour (red channel): ', ctx.getImageData(mousePos.x, mousePos.y, mousePos.x, mousePos.y).data[0])
}, false);


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
        ctx.beginPath();
        ctx.strokeStyle = emitter.colour;
        ctx.moveTo(circCenter.x, circCenter.y);

        let wallTouched = false;
        let rayEnd = {
            x: circCenter.x,
            y: circCenter.y
        }
        while(!wallTouched){
            let arr = ctx.getImageData(rayEnd.x, rayEnd.y, rayEnd.x, rayEnd.y).data
            let pixelColour = `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]})`
            if(pixelColour == wallColour){
                wallTouched = true;
            } else {
                rayEnd.x += Math.cos(theta * emitter.raySeparationAngle) * 5
                rayEnd.y += Math.sin(theta * emitter.raySeparationAngle) * 5
            }
        }
        // ctx.lineTo(circCenter.x + Math.cos(theta * emitter.raySeparationAngle) * emitter.rayLength, circCenter.y + Math.sin(theta * emitter.raySeparationAngle) * emitter.rayLength)
        ctx.lineTo(rayEnd.x, rayEnd.y)
        console.log(rayEnd.x, rayEnd.y)
        ctx.lineWidth = emitter.rayWidth;
        ctx.stroke();
    }
    
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

