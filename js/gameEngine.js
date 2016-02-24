(function(ctx){

	var speed = 0;
	var gameEngine = {
		lvl:  1,
		initGameEngine : function(){
			if (localStorage.length>0){
				this.chrono.timerTbl += localStorage.getItem("Time");
			}
			consol(app, "gameEngine :: ok");
			document.addEventListener('keydown',self.keyboard.keydown, false);
			document.addEventListener('keyup',self.keyboard.keyup, false);

			
			this.init();
			
		},
		init : function(){

			this.chrono.init();
			if(this.lvl === 1 ){
				app.map.patern1.init();
			}
			
		},
		
		finish : function(){
			cancelAnimationFrame(app.req);
			
			console.log(this.chrono.timer)
			localStorage.setItem("Time", this.chrono.timer );
			this.chrono.timerTbl += localStorage.getItem('Time') +"|";
			localStorage.setItem("Time", this.chrono.timerTbl );
			
			document.location ='finish.html';
			
		},
		chrono : {
			timerTbl:[],
			centi : 0,
			secon : 0,
			minu : 0,
			init:function(){
				this.centi++; 
				
				if (this.centi>9){
					this.centi=0;
					this.secon++
				} 
				if (this.secon>59){
					this.secon=0;this.minu++
				} 
				this.timer = this.minu + ":"+this.secon +":"+this.centi;
				document.getElementById("timer").innerHTML = this.timer;
				this.compte = setTimeout('app.gameEngine.chrono.init()',100);
			},
			stop : function(){
			
				clearTimeout(self.chrono.compte) //arrête la fonction chrono()
				
			},
			reset : function(){
			//fonction qui remet les compteurs à 0
				clearTimeout(self.chrono.compte) //arrête la fonction chrono()
				this.centi=0;
				this.secon=0;
				this.minu=0;
				this.timer = this.minu + ":"+this.secon +":"+this.centi;
				document.getElementById("timer").innerHTML = this.timer;
			}
		},
	
		keyboard: {
			speed:{},
			jump: false,
			left:false,
			right : false,
			forward : false,
			back : false,

			keydown : function(event){	
				switch(event.keyCode){
					case 83 : self.keyboard.back = true;
					break;
					case 90 : self.keyboard.forward = true;
					break;
					case 32 : self.keyboard.jump = true;
					break;
					case 81 : self.keyboard.left = true;
					break;
					case 68 : self.keyboard.right = true;
					break;
				}
			},
			keyup : function(event){
				switch(event.keyCode){
					case 83 : self.keyboard.back = false;
					break;
					case 90 : self.keyboard.forward = false;
					break;
					case 81 : self.keyboard.left = false;
					break;
					case 68 : self.keyboard.right = false;
					break;
					case 32 : self.keyboard.jump = false ;
					break;
				}
			},
			control : function(){

				if (this.forward === true){
					speed++;
					app.player.mesh.position.z += Math.sin(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed;
					app.player.mesh.position.x -= Math.cos(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed;				
				}
				else if(this.forward === false &&  this.back === false){
					if(speed > 0 ){
						speed--;
						app.player.mesh.position.z += Math.sin(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed;
						app.player.mesh.position.x -= Math.cos(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed;	
					}
					if(speed < 0 ){
						speed++;
						app.player.mesh.position.z += Math.sin(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed;
						app.player.mesh.position.x -= Math.cos(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed;
					}
					
				}
				if ( this.back === true && speed>0){
					speed -= app.player.break;
					app.player.mesh.position.z += Math.sin(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed
					app.player.mesh.position.x -= Math.cos(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed

					

				}
				if ( this.back === true && speed <=0){
					speed--;
					app.player.mesh.position.z += Math.sin(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed;
					app.player.mesh.position.x -= Math.cos(app.player.mesh.rotation.y + Math.PI/2)*speed/app.player.speed;
					
				}
			
				if ( this.left === true){
					app.player.mesh.rotation.y +=speed/app.player.angle;
				}
				if ( this.right === true){
					app.player.mesh.rotation.y -=speed/app.player.angle;
				}

				if ( speed >=app.player.speedMax ){

					speed = app.player.speedMax;
				}
				else if (speed <=-app.player.speedMax ){
					speed = -app.player.speedMax;
				}
				
				if(this.jump === true && app.player.jumpReady === true ){
				
					
					app.player.jumping = true;
					app.player.jumpReady = false;

					
					
				}
				if(  app.player.jumpReady === false && app.player.jumping === true){

						app.player.body.position.y +=0.6;
						app.webgl.camera.position.y +=0.6;
						setTimeout(function(){
							app.player.jumping = false;
						}, 500)
						
				}
			}
			
		},
		win : {
			lvl1:function(){
				if(app.player.mesh.position.x<-71 && app.player.mesh.position.x>-87 && app.player.mesh.position.z<-1670){
					self.lvl=2;
				}
			}
		},
		switchPatern : function(){
		
			if(this.lvl === 2 ){
				
				app.map.patern1.destroy();
				self.chrono.stop();
				self.finish();
				this.lvl=-1;
				
			}
			
			
		},
		//gameloop

		animate : function(){
			// console.log(app.player.mesh.position)
			self.switchPatern();
			initPos(app.player.mesh, app.player.body);
			syncCamera(app.webgl.camera, app.player.mesh, 0,1.2,-3)
			self.keyboard.control();
			app.player.respawn();

			if(self.lvl ===1){
				app.player.fly(-660);
				app.map.patern1.move(app.map.patern1.road9)
				self.win.lvl1();
			}
			
			

			
		


			
		},
		
		
	}
	var self = gameEngine;
	ctx.gameEngine = gameEngine;
})(app);