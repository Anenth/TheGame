var GAME=GAME||{};window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}(),navigator.vibrate=navigator.vibrate||navigator.webkitVibrate||navigator.mozVibrate||navigator.msVibrate,GAME.app=function(){var a,b,c,d=window.innerHeight,e=window.innerWidth,f=10,g=[],h=$(".welcome-page"),i=$(".start-page"),j=["images/candy_1.png","images/candy_2.png","images/candy_3.png","images/candy_4.png","images/candy_5.png","images/candy_6.png","images/candy_7.png","images/candy_8.png","images/candy_9.png","images/candy_10.png"],k="images/bg.jpg",l=0,m=function(f){var g=document.getElementById("game-canvas");g.width=e,g.height=d,g.style.display="block",a=g.getContext("2d"),b=new p(f),c=new o,q()},n=function(){this.item=new Image;var a=t(j.length-1);this.item.src=j[a],this.item.onload=this.load,this.x=t(e),this.y=t(5),this.speed=3+t(5),this.caught=!1};n.prototype.load=function(){l++};var o=function(){this.score=0,this.timer=30},p=function(a){this.item=new Image,this.item.src=a[0],this.width=100,this.height=100,this.item2=new Image,this.item2.src=a[1],this.x=e/2,this.y=d-this.height-10,this.gamma=0,this.caught=!1},q=function(){window.DeviceOrientationEvent&&window.addEventListener("deviceorientation",function(a){b.gamma=a.gamma},!1),window.DeviceOrientationEvent&&window.addEventListener("orientationchange",function(){90==window.orientation&&alert(" Landscape orientation not supported right now, Sorry !")},!1)},r=function(){c.timer--,c.timer<0&&(alert("   Game Over !  \n   You have Scored:"+c.score+"\n   Thank you for playing."),clearInterval(g.timer),clearInterval(g.gameItems),location.reload())},s=function(){this.objects=[],this.imgBg=new Image,this.imgBg.src=k,this.caught_counter=0;var h;this.drawBackground=function(){a.drawImage(imgBg,0,0,e,d)},this.drawGameInfo=function(){a.font="20px Georgia",a.fillStyle="white",a.fillText("Score",10,20),a.fillText(c.score,25,40),a.fillText("Timer",e-60,20),a.fillText(c.timer,e-45,40)},this.drawCatcher=function(){b.x>=0&&b.x<=e-120&&(b.x+=b.gamma,b.gamma=0,b.x<0?b.x=0:b.x>e-120&&(b.x=e-120)),b.caught?(a.drawImage(b.item2,b.x,b.y,b.width,b.height),1>caught_counter&&(b.caught=!1),caught_counter--):a.drawImage(b.item,b.x,b.y,b.width,b.height)},this.draw=function(){this.drawBackground(),this.drawGameInfo(),this.drawCatcher();for(var g=0;f>g;g++)a.drawImage(objects[g].item,objects[g].x,objects[g].y),objects[g].y+=objects[g].speed,(objects[g].y>d||objects[g].caught)&&(objects[g].caught?c.score+=10:c.score-=5,objects[g].y=-25,objects[g].x=t(e)-25,objects[g].caught=!1),objects[g].y>d-b.height&&objects[g].x>b.x&&objects[g].x<b.x+b.width&&(objects[g].caught=!0,b.caught=!0,caught_counter=10,navigator.vibrate&&navigator.vibrate(1e3))},this.load=function(){for(var a=0;f>a;a++)h=new n,this.objects.push(h);g.gameStart=setInterval(gameStart,500)},this.gameStart=function(){l==f&&(clearInterval(g.gameStart),g.gameItems=setInterval(draw,36),g.timer=setInterval(r,1e3))},this.load()},t=function(a){return min=0,Math.floor(Math.random()*(a-min+1))+min};return{welcome:function(){var a=new FileReader,b=[],c=0;h.css("width",e).css("height",d),$(".welcome-page .btn").on("click",function(){h.hide(),i.fadeIn()}),i.css("width",e).css("height",d),$(".form-upload-image input").change(function(d){b[c]=URL.createObjectURL(d.target.files[0]),a.readAsDataURL(d.target.files[0]),a.onload=function(a){c>0?($(".preview-img.mouth-closed").attr("src",a.target.result),$(".btn-start").fadeIn(),$(".btn-next").hide()):$(".preview-img.mouth-open").attr("src",a.target.result)},$(".btn-next").fadeIn().on("click",function(){$(this).hide(),$(".step-1").hide(),c++,$(".step-2").fadeIn()})}),$(".start-page .btn-upload").on("click",function(){$(".form-upload-image input").trigger("click")}),$(".start-page .btn-start").on("click",function(){i.fadeOut(),GAME.app.startGame(b)})},startGame:function(a){m(a),s()}}}(),GAME.app.welcome();