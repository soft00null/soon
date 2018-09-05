(function(window,document,undefined){ //IIFE's are pretty neat http://benalman.com/news/2010/11/immediately-invoked-function-expression/
	"use strict";

	var canvas, ctx, //main (visible) canvas/context
			osCanvas, osCtx, //offscreen canvas/context
			rect, height, width, 
			objects, numParticles, numRays, //objects array + totals
			pInput, rInput, rCount, pCount, title;  //DOM elements
	
	var Ray = function(){
		
		this.ctx = osCtx; //locally cache offscreen 2d context for more effecient animation

		this.angle = 105 * Math.PI / 180; //105 deg in radians

		this.init = function(){
			this.velocity = 0.25 - Math.random() * 0.5; //velocity of x-axis
			this.len = (canvas.height/2) + Math.random() * (canvas.height/2); //length of ray between half and full window height
			this.start = { //start/top of ray
				x: Math.random() * (canvas.width + 100) - 50,
				y: 0
			};
			this.end = { //end/bottom of ray 
				x: this.start.x + this.len * Math.cos(this.angle), //use sine and cosine to calculate end point based on start point, length and angle
				y: this.start.y + this.len * Math.sin(this.angle)  //start at point, add length then 'rotate' to final point by multiplying sine/cosine of angle
			};
			this.ttl = 100 + Math.random() * 200; //total lifespan of ray 'time to live'
			this.life = 0; //current lifespan of ray
			this.width = 0.5 + Math.random() * 4; //random width between 0.5 an 4.5
			this.hue = Math.round(45 + Math.random() * 15).toString(); //random yellow hue between 45 and 60 (degrees)
			this.saturation = Math.round(20 + Math.random() * 40).toString(); //random saturation between 40% and 60%
		};

		this.color = function(){ //generate gradient
			var alpha = wave(this.life, this.ttl) * 0.005, //fade in/fade out alpha
					color1 = 'hsla(' + this.hue + ',' + this.saturation + '%,' + '60%,' + alpha.toString() + ')', //start color of ray gradient
					color2 = 'hsla(50,20%,20%,0)', //bottom color of ray gradient (transparent)
					gradient = ctx.createLinearGradient(this.start.x, this.start.y, this.end.x, this.end.y); 

			gradient.addColorStop(0,color1);
			gradient.addColorStop(1,color2);

			return gradient;
		}

		this.draw = function(){ //draw the ray
			this.ctx.beginPath();
			this.ctx.strokeStyle = this.color();
			this.ctx.lineWidth = this.width;
			this.ctx.moveTo(this.start.x, this.start.y);
			this.ctx.lineTo(this.end.x, this.end.y);
			this.ctx.stroke();
			this.ctx.closePath();
		};

		this.update = function(){
			if (this.life > this.ttl){ //re-initialize when lifespan expires
				this.init();
			}
				this.life++; //add to current life
				this.start.x += this.velocity; //move both ends of line
				this.end.x += this.velocity;
		};

		this.init(); //initialize when new ray is created

		return this; //return local scope
	};
	
	var Particle = function(){
		
		this.ctx = osCtx; //locally cache offscren 2d context for more effecient animation
		
		this.init = function(){
			this.position = { //random x,y position
				x: Math.random() * width,
				y: height/2 + Math.random() * height/2
			};
			this.velocity = { //random velocity on x-axis and y-axis
				x: 0.5 - Math.random() * 1,
				y: 0.5 - Math.random() * 1
			};
			this.ttl = 100 + Math.random() * 200; //total lifespan of particle
			this.life = 0; //current life of particle
			this.size = 1 + Math.random() * 10; //random size
		};
		
		this.color = function(){ //generate hsla color
			var alpha = wave(this.life, this.ttl) * 0.005, //fade in/fade out alpha
					color = 'hsla(50,50%,25%,' + alpha.toString() + ')';
			return color;
		};
		
		this.draw = function(){ //draw the particle
			this.ctx.beginPath();
			this.ctx.fillStyle = this.color();
			this.ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI*2);
			this.ctx.fill();
			this.ctx.closePath();
		};
		
		this.update = function(){
			if (this.life > this.ttl){
				this.init();
			}
			else{
				this.life++;
				this.position.x += this.velocity.x;
				this.position.y += this.velocity.y;
			}
		};
		
		this.init(); //initialize when new particle is created
		
		return this; //return local scope
	};
	
	function onResize(){ //allows for resizing without effecting previously drawn objects
		rect = canvas.getBoundingClientRect();
		height = rect.height;
		width = rect.width;
		
		canvas.height = osCanvas.height = height;
		canvas.width = osCanvas.width = width;
	}
	
	function requestAnimationFrame(){ //vendor prefixing + fallback
		return  window.requestAnimationFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						window.oRequestAnimationFrame      ||
						window.msRequestAnimationFrame     ||
						function (callback) {
							window.setTimeout(callback, 1000 / 60);
						};
	}
	
	function wave(t, a){
		//function credit to http://stackoverflow.com/questions/26590800/how-can-we-increment-and-then-decrement-a-counter-without-conditionals
		return Math.abs(((t + a/2) % a) - a/2);
	}
	

	
	function createObjects(){
		numRays = 30; 
		numParticles = 25;
		
		
		objects = [];
		
		for(var i = 0; i < numRays; i++){ //instantiate rays/particles
			var ray = new Ray();
			objects.push(ray);
		}
		
		for(var i = 0; i < numParticles; i++){
			var particle = new Particle();
			objects.push(particle);
		}
	}
	
	function render(c1, c2){
		c1.clearRect(0,0,width,height); //clear previously drawn frames
		c2.clearRect(0,0,width,height);
		c2.shadowBlur = 20; //add a 'glow' to rays/particles
		c2.shadowColor = 'white';
		c2.globalCompositeOperation = 'lighter'; //lighter composite operation for more of a 'glow'
		for(var i = 0, len = objects.length; i < len; i++){ //draw offscreen/update objects (rays and particles in same array)
			var obj = objects[i];
			obj.update();
			obj.draw();
		}
		c1.drawImage(osCanvas, 0, 0); //copy offscreen canvas to main canvas
	}
	
	function loop(){ //animation loop
		render(ctx, osCtx);
		window.requestAnimationFrame(loop);
	}
	
	function init(){ //initialize canvas/globals
		canvas = document.getElementById('background-effect'); //main (on-screen) canvas / context
		ctx = canvas.getContext('2d');
		
		osCanvas = document.createElement('canvas'); //secondary (off-screen) canvas / context
		osCtx = osCanvas.getContext('2d');
		
		onResize(); //set canvas size
		createObjects(); //create rays/particles
		loop(); //do a barrel roll
	}
	
	window.onload = init;
	window.onresize = onResize;
	window.requestAnimationFrame = (requestAnimationFrame)(); //IIFE's are kewl
	
})(this,document);