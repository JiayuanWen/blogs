// Copyright (c) 2022 by Leon (https://codepen.io/LeonGr/pen/eYoZJB)

//console.log("test");

import { isMobile } from "./mobileCheck.js";

let stars_count = 100;
if (isMobile()) {
    stars_count = 30;
} else {
    stars_count = 100;
}

var canvas = document.getElementById("stars-bg"),
    ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var stars = [], // Array that contains the stars
    FPS = 75, // Frames per second
    x = stars_count; // Number of stars

class star{
    constructor() {
        this.x = Math.random() * canvas.width,
            this.y = Math.random() * canvas.height,
            this.radius = Math.random() + 1,
            this.vx = Math.floor(Math.random() * 40) - 20,
            this.vy =  Math.floor(Math.random() * 40) - 20
    }
}

// Push stars to array
for (var i = 0; i < x; i++) {
    stars.push(new star);
}
// Draw the scene
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0, x = stars.length; i < x; i++) {
        var s = stars[i];
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.stroke();
    }
    ctx.beginPath();
    for (var i = 0, x = stars.length; i < x; i++) {
        var starI = stars[i];
        ctx.moveTo(starI.x,starI.y);
        for (var j = 0, x = stars.length; j < x; j++) {
            var starII = stars[j];
            if(distance(starI, starII) < 150) {
                ctx.lineTo(starII.x,starII.y);
            }
        }
    }
    ctx.lineWidth = 0.12;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
}
function distance( point1, point2 ){
    return Math.sqrt( Math.pow(point2.x - point1.x,2) + Math.pow(point2.y - point1.y,2) );
}
// Update star locations
function update() {
    for (var i = 0, x = stars.length; i < x; i++) {
        var s = stars[i];
        s.x += s.vx / FPS;
        s.y += s.vy / FPS;
        if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
        if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
    }
}
// Update and draw
function tick() {
    draw();
    update();
    requestAnimationFrame(tick);
}
tick();
