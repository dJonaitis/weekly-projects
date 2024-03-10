let canvas = document.getElementById("main");
let ctx = canvas.getContext("2d");

const backgroundColour = "black";
const gravity = 0.01;
const starRadius = 2;
const starColour = "white";
const floorY = canvas.height - 100;
const floorColour = 'rgba(246, 241, 213, 1)'
const textColour = "white";

const failAngle = 10 * Math.PI/180;
const failHorV = 2;
const failVerV = 2;

let gameWidth = canvas.width;
let gameHeight = canvas.height;
let gameOver = false;

function generateStars(count){
    let stars = [];
    let y = [];

    for(let i = 0; i < count; i++){
        stars.push([0, 0]);
        stars[i][0] = Math.floor(Math.random()*canvas.width);
        stars[i][1] = Math.floor(Math.random()*canvas.height);
    }

    console.log(count)
    console.log(stars)
    return stars
}

let lander = {
    //colours
    colour: "white",
    exhaustColour: "orange",
    //dimensions, positioning and rotation
    width: 20,
    height: 40,
    position: {
        x: 100,
        y: 100
    },
    velocity: {
        x: 3,
        y: 0
    },
    //rotation
    angle: 0,
    rotatingLeft: false,
    rotatingRight: false,
    //engine
    engineStatus: false,
    fuel: 1000,
    fuelBurnRate: 1,
    thrust: 0.02,
    exploded: false,
}

//event listeners
function keyPressed(event){
    switch(event.keyCode){
        case 37: // left arrow
            lander.rotatingLeft = true;
            break;
        case 39: // right arrow
            lander.rotatingRight = true;
            break;
        case 38: // up arrow
            if (lander.fuel > 0) lander.engineStatus = true; // checks if the lander still has fuel
            break;
        case 65: // a
            lander.rotatingLeft = true;
            break;
        case 68: // d
            lander.rotatingRight = true;
            break;
        case 87: // w
            if (lander.fuel > 0) lander.engineStatus = true; // checks if the lander still has fuel
            break;
    }
}
function keyLifted(event){
    switch(event.keyCode){
        case 37: // left arrow
            lander.rotatingLeft = false;
            break;
        case 39: // right arrow
            lander.rotatingRight = false;
            break;
        case 38: // up arrow
            lander.engineStatus = false;
            break;
        case 65: // a
            lander.rotatingLeft = false;
            break;
        case 68: // d
            lander.rotatingRight = false;
            break;
        case 87: // w
            lander.engineStatus = false;
            break;
    }
}

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyLifted);

//math for rotation and position of lander
function calcLander(){
    if(lander.position.y >= floorY){
        // the below if statement checks whether the lander is straight enough and slow enough in either direction
        if(lander.velocity.x > failHorV || lander.velocity.y > failVerV || (lander.angle % Math.PI * 2) <= -failAngle || (lander.angle % Math.PI * 2) >= failAngle ){
            lander.exploded = true;
        }     
        gameOver = true;
        return;
    }
    lander.position.x += lander.velocity.x;
    lander.position.y -= lander.velocity.y;
    //loop lander position to start if the canvas is left
    if(lander.position.x >= canvas.width) lander.position.x = 0;
    //rotate ship
    if(lander.rotatingLeft){
        lander.angle += Math.PI / 180
    }
    if(lander.rotatingRight){
        lander.angle -= Math.PI / 180
    }

    //adjust for thrust
    if(lander.engineStatus){
        console.log(lander.fuel);
        lander.fuel -= lander.fuelBurnRate
        // lander.position.x += Math.sin(lander.angle);
        // lander.position.y -= Math.cos(lander.angle);
        lander.velocity.x += lander.thrust * Math.sin(lander.angle);
        lander.velocity.y += lander.thrust * Math.cos(lander.angle);
    }
    lander.velocity.y -= gravity;
}

//draw functions
function drawLander(){
    ctx.save();
    ctx.beginPath();
    ctx.translate(lander.position.x, lander.position.y); // shifts where the lander is drawn based on the angle
    ctx.rotate(lander.angle);
    ctx.rect(lander.width * -0.5, lander.height * -0.5, lander.width, lander.height);
    ctx.fillStyle = lander.colour;
    ctx.fill();
    ctx.closePath();


    if(lander.engineStatus){
        ctx.beginPath();
        ctx.moveTo(lander.width * -0.5, lander.height * 0.5);
        ctx.lineTo(lander.width * 0.5, lander.height * 0.5);
        ctx.lineTo(0, lander.height * 0.5 + Math.random() * 15);
        ctx.lineTo(lander.width * -0.5, lander.height * 0.5);
        ctx.closePath();
        ctx.fillStyle = lander.exhaustColour;
        ctx.fill();
    }
    ctx.restore(); // restores the context and thus prevents the canvas from overdrawing
}

function drawStars(){
    for(let i = 0; i < stars.length; i++){
        ctx.beginPath();
        ctx.fillStyle = starColour;
        ctx.arc(stars[i][0], stars[i][1], starRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

function draw(){
    calcLander();

    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // fill background
    drawStars();
    ctx.fillStyle = floorColour;
    ctx.fillRect(0, floorY, canvas.width, canvas.height); // fill floor
    drawLander();
    ctx.beginPath();
    ctx.fillStyle = textColour;
    ctx.font = "30px Courier New";
    ctx.fillText(`Fuel: ${lander.fuel}`, canvas.width - 200, 40)

    if(gameOver){
        if(lander.exploded && lander.position.y >= floorY){
            ctx.font = "30px Courier New";
            ctx.fillStyle = textColour;
            ctx.fillText("GAME OVER!!!", 600, 300);
        }
        else if(!lander.exploded && lander.position.y >= floorY ){
            ctx.font = "30px Courier New";
            ctx.fillStyle = textColour;
            ctx.fillText("YOU WIN!!!", 600, 300);
        }
    } else window.requestAnimationFrame(draw);
}


let stars = generateStars(50);
window.requestAnimationFrame(draw)
