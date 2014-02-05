var GAME = GAME || {};
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();
// enable vibration support
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;


GAME.app = function(){
  var ctx,
  cHeight = window.innerHeight,
  cWidth = window.innerWidth,
  numberOfItems = 10,
  intervals = [],
  welcomePage = $('.welcome-page'),
  startpage = $('.start-page'),
  gameItemsResource = [
  'images/candy_1.png',
  'images/candy_2.png',
  'images/candy_3.png',
  'images/candy_4.png',
  'images/candy_5.png',
  'images/candy_6.png',
  'images/candy_7.png',
  'images/candy_8.png',
  'images/candy_9.png',
  'images/candy_10.png'
  ],
  backgroundImage = 'images/bg.jpg',
  itemsLoaded = 0,
  catcher,
  gameInfo;


  /**
   * [gameInit This function sets the width and height of the canvas and get CTX ]
   * @return {[type]} [description]
   */
   var gameInit = function(user_selectedFile){
    var canvas = document.getElementById('game-canvas');
    canvas.width = cWidth;
    canvas.height = cHeight;
    canvas.style.display = 'block';
    ctx = canvas.getContext('2d');
    catcher = new GameCatcherItem(user_selectedFile);
    gameInfo = new GameInfo();
    gameCatcherHandler();
  };

  /**
   * [GameItem This object initializes the candy which drops from the top.
   * - Creates a new image and sets a random image
   * - Sets the Path in which the candy should drop
   * - Sets the Speed of candy
   * - Sets the Caught flag ]
   */
   var GameItem = function(){
    this.item = new Image();
    var randomNumber = getRandomInt(gameItemsResource.length - 1);
    this.item.src = gameItemsResource[ randomNumber ];
    this.item.onload = this.load;
    this.x = getRandomInt(cWidth);
    this.y = getRandomInt(5);
    this.speed = 3 + getRandomInt(5);
    this.caught = false;
  };
  GameItem.prototype.load = function() {
    itemsLoaded++;
  };

  /**
   * [GameInfo this object used to keep track on time and score ]
   */
   var GameInfo = function(){
    this.score = 0;
    this.timer = 30;
  };
  /**
   * [GameCatcherItem this object is used to initialize the Catcher used to
   * catch the canndy]
   */
   var GameCatcherItem = function(selectedFile){
    this.item = new Image();
    this.item.src = selectedFile[0];
    this.width = 100;
    this.height = 100;
    this.item2 = new Image();
    this.item2.src = selectedFile[1];
    this.x = cWidth / 2;
    this.y = cHeight - this.height - 10;
    this.gamma = 0;
    this.caught = false;
  };
  /**
   * [gameCatcherHandler this fuction sets the Orientaion event handlers ]
   */
   var gameCatcherHandler = function(){
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function(event){
        catcher.gamma = event.gamma;
      }, false);
    }
    if (window.DeviceOrientationEvent) {
      window.addEventListener('orientationchange', function(){
        if(window.orientation == 90){
          alert(' Landscape orientation not supported right now, Sorry !')
        }
      }, false);
    }
  };
  /**
   * [timmer this functions is responsible for the timmer and end messages]
   */
   var timmer = function(){
    gameInfo.timer--;
    if(gameInfo.timer < 0){
      alert('   Game Over !  \n   You have Scored:'+ gameInfo.score +'\n   Thank you for playing.');
      clearInterval(intervals['timer']);
      clearInterval(intervals['gameItems']);
      location.reload();
    }
  };


  /**
   * [gameItems object which manages all the ressources and resposible for re-drawing ]
   */
   var gameItems = function(){
    this.objects = [];
    this.imgBg = new Image();
    this.imgBg.src = backgroundImage;
    this.caught_counter = 0;
    var obj;
    /**
     * [drawBackground draw the background image]
     */
     this.drawBackground = function(){
      ctx.drawImage(imgBg, 0, 0, cWidth, cHeight);
    };
    /**
     * [drawGameInfo functiont to update the game information ]
     */
     this.drawGameInfo = function(){
      ctx.font='20px Georgia';
      ctx.fillStyle = 'white';
      ctx.fillText('Score',10,20);
      ctx.fillText(gameInfo.score ,25,40);

      ctx.fillText('Timer', cWidth - 60, 20);
      ctx.fillText(gameInfo.timer , cWidth - 45, 40);
    };
    /**
     * [drawCatcher function to update the game catcher]
     */
     this.drawCatcher = function(){
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
      if(catcher.caught){
        ctx.drawImage(catcher.item2, catcher.x, catcher.y, catcher.width, catcher.height);
        if(caught_counter < 1)
          catcher.caught = false;
        caught_counter--;
      }else{
        ctx.drawImage(catcher.item, catcher.x, catcher.y, catcher.width, catcher.height);
      }

    };
    /**
     * [draw function to manage all the draw function. This fuction will draw
     *  all the items required for the game]
     */
     this.draw = function(){

      this.drawBackground();
      this.drawGameInfo();
      this.drawCatcher();
      /**
       * For each items draw the falling object and calculate the score if caugth
       */
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
        if( objects[i].y > cHeight - catcher.height &&
          objects[i].x > catcher.x &&
          objects[i].x < catcher.x + catcher.width ){
          objects[i].caught = true;
          catcher.caught = true;
          caught_counter = 10;
          if (navigator.vibrate) {
            navigator.vibrate(1000);
          }
      }

    }
  };
  this.load = function(){
    for(var i = 0; i < numberOfItems; i++){
      obj = new GameItem();
      this.objects.push(obj);
    }
    /* Check if all the resouses are loaded */
    intervals['gameStart'] = setInterval(gameStart, 500)
  };

  /*Function to check if all the resouses are loaded */
  this.gameStart = function(){
    if(itemsLoaded == numberOfItems){
      clearInterval(intervals['gameStart']);
      intervals['gameItems'] = setInterval(draw, 36);
      intervals['timer'] = setInterval(timmer, 1000);
    }
  };

  this.load();
};
/**
 * [getRandomInt function to generate a random number]
 */
 var getRandomInt = function(max) {
  min = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


return{
  welcome: function(){
    var reader = new FileReader(),
    selectedFile = [],
    selection = 0;

    welcomePage
    .css('width', cWidth)
    .css('height', cHeight);
    $('.welcome-page .btn').on('click', function(){
      welcomePage.hide();
      startpage.fadeIn();
    });
    startpage
    .css('width', cWidth)
    .css('height', cHeight);
    /**
     * 1.Listen to change in the input form,
     * 2.Store the URL of the image to seletedFile array
     * 3.Use File Reader to preview the image on to img tags
     */
     $('.form-upload-image input').change(function(event){
      selectedFile[selection] = URL.createObjectURL(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function(event) {
        if(selection > 0 ){
          $('.preview-img.mouth-closed').attr('src', event.target.result);
          $('.btn-start').fadeIn();
          $('.btn-next').hide();
        }else{
          $('.preview-img.mouth-open').attr('src', event.target.result);
        }
      };
      $('.btn-next').fadeIn().on('click',function(){
        $(this).hide();
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

      GAME.app.startGame(selectedFile);
    });
   },
   startGame: function(user_selectedFile){
    gameInit(user_selectedFile);
    gameItems();
  }
};
}();

// $('.welcome-page').hide();
GAME.app.welcome();
// GAME.app.startGame();

