var GAME = GAME || {};
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();






GAME.app = function(){
  var ctx,
  cHeight = window.innerHeight,
  cWidth = window.innerWidth,
  numberOfItems = 10,
  intervals = [],
  welcomePage = $('.welcome-page'),
  startpage = $('.start-page');
  var gameInit = function(){
    var canvas = document.getElementById("game-canvas");
    canvas.width = cWidth;
    canvas.height = cHeight;
    ctx = canvas.getContext('2d');
  };

  var gameItemsResource = [
  'https://cdn1.iconfinder.com/data/icons/winter_png/32/christmas_5.png',
  'https://cdn3.iconfinder.com/data/icons/wpzoom-developer-icon-set/500/114-32.png',
  'https://cdn1.iconfinder.com/data/icons/ie_Smashing_Christmas/32/christmas_35.png',
  'https://cdn1.iconfinder.com/data/icons/Easter_lin/png/32x32/Ovo.png',
  'https://cdn1.iconfinder.com/data/icons/desktop-halloween/32/Candy.png',
  'https://cdn1.iconfinder.com/data/icons/iconshock_vista_CharlieandtheChocolateFactory/png/32/CharlieandtheChocolateFactory1.png',
  'https://cdn1.iconfinder.com/data/icons/Birthday_iconfinder/32/lolly-strawberry.png',
  'https://cdn1.iconfinder.com/data/icons/icon-set-32-px/32/Candy_Apple.png',
  'https://cdn1.iconfinder.com/data/icons/CrystalClear/32x32/apps/icons.png',
  'https://cdn1.iconfinder.com/data/icons/fatcow/32/candy_cane.png'
  ];
  var GameItem = function(){
    this.item = new Image();
    this.item.src = gameItemsResource[ getRandomInt(gameItemsResource.length) ];
    this.x = getRandomInt(cWidth);
    this.y = getRandomInt(5);
    this.speed = 3 + getRandomInt(5);
    this.caught = false;
  };
  GameItem.prototype.dropItem = function() {

  };
  var GameInfo = function(){
    this.score = 0;
    this.timer = 30;
  };
  var gameInfo = new GameInfo();
  var timmer = function(){
    gameInfo.timer--;
    if(gameInfo.timer < 0){
      alert("   You have Scored:"+ gameInfo.score +"\n   Thank you for playing.");
      clearInterval(intervals['timer']);
      clearInterval(intervals['gameItems']);
      clearInterval(intervals['gameCatcher']);
    }
  };


  var gameItems = function(){
    this.objects = [];
    this.imgBg = new Image();
    this.imgBg.src = "http://wallpoper.com/images/00/42/22/95/shapes-gradient_00422295.jpg";
    var obj;
    this.drawBackground = function(){
      ctx.drawImage(imgBg, 0, 0);
    };
    this.drawGameInfo = function(){
      /* update the score */
      ctx.font="20px Georgia";
      ctx.fillText("Score",10,20);
      ctx.fillText(gameInfo.score ,25,40);

      ctx.fillText("Timer", cWidth - 60, 20);
      ctx.fillText(gameInfo.timer , cWidth - 45, 40);
    }
    this.draw = function(){
      this.drawBackground();
      this.drawGameInfo();
      for(var i = 0; i < numberOfItems; i++){
        ctx.drawImage(objects[i].item, objects[i].x, objects[i].y);
        objects[i].y += objects[i].speed;
        /* make it reflow from top when it goes out of view or its caught by the catcher */
        if (objects[i].y > cHeight || objects[i].caught) {
          /* Calculate the Score */
          if(objects[i].caught){
            gameInfo.score += 10;
          }else{
            gameInfo.score -= 5;
          }
          objects[i].y = -25; //wrt image size
          objects[i].x = getRandomInt(cWidth) - 25;
          objects[i].caught = false;
        }
        /* Check if the object it caught by the catcher */
        if( objects[i].y > cHeight - 120
          && objects[i].x > catcher.x
          && objects[i].x < catcher.x + 200 ){
          objects[i].caught = true;
      }


    }
  };
  this.load = function(){
    for(var i = 0; i < numberOfItems; i++){
      obj = new GameItem();
      this.objects.push(obj);
    };
    intervals['gameItems'] = setInterval(draw, 36);
    intervals['timer'] = setInterval(timmer, 1000);
  };

  this.load();
};
var GameCatcherItem = function(){
  this.item = new Image();
  this.item.src = "https://cdn1.iconfinder.com/data/icons/adidas/128/Shoebox_512x512.png";
  this.item.src2 = "https://cdn1.iconfinder.com/data/icons/windows-8-metro-style/128/tool_box.png";
  this.x = cWidth / 2;
  this.y = cHeight - 100;
  this.gamma = 0;
};
var catcher;
var gameCatcher = function(){
  catcher = new GameCatcherItem();
  console.log(catcher.item.naturalWidth);
  /* device orientation event handler */
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event){
      catcher.gamma = event.gamma;
    }, false);
  }
  if (window.DeviceOrientationEvent) {
    window.addEventListener('orientationchange', function(){
      if(window.orientation == 90){
        alert(" Landscape orientation not supported right now, Sorry !")
      }
    }, false);
  }

  this.checkCatched = function(){

  };
  this.draw = function(){
    this.checkCatched();
    /* Check if catcher reached the end */
    if( catcher.x >= 0 && catcher.x <= cWidth - 120 ){
      catcher.x+=catcher.gamma;
      catcher.gamma = 0;
      if(catcher.x < 0){
        catcher.x = 0;
      }else if(catcher.x > cWidth - 120){
        catcher.x = cWidth - 120;
      }
    }
    ctx.drawImage(catcher.item, catcher.x, catcher.y);
  };

  intervals['gameCatcher'] = setInterval(this.draw, 36);

};

var getRandomInt = function(max) {
  min = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
return{
  welcome: function(){
    var selectedFile = [],
    reader = new FileReader(),
    selection =0;
    welcomePage
    .css("width", cWidth)
    .css("height", cHeight);
    $('.welcome-page .btn').on('click', function(){
      welcomePage.hide();
      startpage.fadeIn();
    });
    startpage
    .css("width", cWidth)
    .css("height", cHeight);
    $(".form-upload-image input").change(function(event){
      selectedFile[selection] = event.target.files[selection];
      reader.readAsDataURL(selectedFile[0]);
      reader.onload = function(event) {
        if(selection > 0 ){
          $(".preview-img.mouth-closed").attr("src", event.target.result);
          $('.btn-start').fadeIn();
       }else{
        $(".preview-img.mouth-open").attr("src", event.target.result);
      }
    };
    $(".btn-next").fadeIn().on('click',function(){
      $('.step-1').hide();
      selection++;
      $('.step-2').fadeIn();
    });
  });
    $('.start-page .btn-upload').on('click', function(){
      $('.form-upload-image input').trigger('click');
    });

    $('.start-page .btn-start').on('click', function(){
      startpage.fadeOut();
      GAME.app.startGame();
    });
  },
  getImagesFromUser: function(){

  },
  startGame: function(){
    gameInit();
    gameItems();
    gameCatcher();
  }
}
}();
GAME.app.welcome();

