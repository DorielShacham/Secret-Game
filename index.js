const canvas = document.querySelector('canvas'); // Select the canvas element
const c = canvas.getContext('2d'); // context

canvas.width = 1024; //windows size
canvas.height = 576; //windows size

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7; //gravity makes objects fall smoothly

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
}) //The Map is a sprite that will be drawn on the canvas

const shop = new Sprite({
    position: {
        x: 600,
        y: 130
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6

})

const player = new Fighter({
   position: {
     x: 100,
     y: 0
    },
   velocity: {
     x: 0,
     y: 0
    },
    offset: {
        x: 0, 
        y: 0
    },
    imageSrc: './img/Character_2/Idle.png',
    framesMax: 4,
    scale: 4,
    offset: {
        x: 215,
        y: 110
    },
    sprites: { //sprites for the player = animtions(idle, run, attack, etc)
        idle: {imageSrc: './img/Character_2/Idle.png', framesMax: 4},
        run: {imageSrc: './img/Character_2/Run.png', framesMax: 8},
        jump: {imageSrc: './img/Character_2/Jump.png', framesMax: 2},
        fall: {imageSrc: './img/Character_2/Fall.png', framesMax: 2},
        attack1: {imageSrc: './img/Character_2/Attack1.png', framesMax: 4},
        takeHit: {imageSrc: './img/Character_2/Take Hit - white silhouette.png', framesMax: 4},
        death: {imageSrc: './img/Character_2/Death.png', framesMax: 4},
    },
    attackBox:{
        offset: {
            x: 115,
            y: 0
        },
        width: 100,
        height: 150
    }
}) // player sprite


const enemy = new Fighter({
    position: {
      x: 900,
      y: 100
     },
    velocity: {
      x: 0,
      y: 0
     },
     offset: {
        x: -50, 
        y: 0
    },
    imageSrc: './img/Character_6/Character_6/Idle.png',
    framesMax: 4,
    scale: 4,
    offset: {
        x: 215,
        y: 145
    },
    sprites: { //sprites for the enemy = animtions(idle, run, attack, etc)
        idle: {imageSrc: './img/Character_6/Character_6/Idle.png', framesMax: 4},
        run: {imageSrc: './img/Character_6/Character_6/Run.png', framesMax: 8},
        jump: {imageSrc: './img/Character_6/Character_6/Jump.png', framesMax: 2},
        fall: {imageSrc: './img/Character_6/Character_6/Fall.png', framesMax: 2},
        attack1: {imageSrc: './img/Character_6/Character_6/Attack1.png', framesMax: 4},
        takeHit: {imageSrc: './img/Character_6/Character_6/Take Hit.png', framesMax: 4},
        death: {imageSrc: './img/Character_6/Character_6/Death.png', framesMax: 4}
    },
    attackBox:{
        offset: {
            x: -200,
            y: 0
        },
        width: 100,
        height: 150
    }
}) // enemy sprite

//console.log(enemy); // --> shows the player sprite

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
} //keysboard object


decreaseTimer(); //calling function 

function animate() {
    window.requestAnimationFrame(animate); // requestAnimationFrame is a function that will be called everytime the browser is ready to draw the next frame
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas and removes paint effect
    background.update(); //render the background
    shop.update(); //render the shop
    c.fillStyle = 'rgb(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas and removes paint effect
    player.update() //draws player from update function
    enemy.update() //draws enemy from update function

    player.velocity.x = 0; //sets player velocity to 0 - stops character after lifting the key 
    enemy.velocity.x = 0; //sets enemy velocity to 0 - stops character after lifting the key

    //player movement
   
    player.framesMax = player.sprites.idle.framesMax;//makes the framesMax of player idle always

    //runing
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5; //if the player presses the A key, the player will move left (SPEED)
        player.switchSprite('run'); //changes the image to the run animation from idle A to idle and idle to A
        player.framesMax = player.sprites.run.framesMax;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5; //if the player is pressing the keys, move the player right (SPEED)
        player.switchSprite('run') //changes the image to the run animation from idle D to idle and idle to D
        player.framesMax = player.sprites.run.framesMax; //changes the framesMax to the run animation from idle D to idle and idle to D
    } else {
        player.switchSprite('idle'); //changes the image to the idle animation from run A to run and run to A
    }

    //jumping
    if(player.velocity.y < 0) { //if the player is jumping, change the image to the jump animation
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) { //if the player is falling, change the image to the fall animation
        player.switchSprite('fall');
    }



        

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5; //if the enemy presses the a key, the player will move left (SPEED)
        enemy.switchSprite('run'); //changes the image to the run animation from idle A to idle and idle to A
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5; //if the enemy is pressing the keys, move the player right(SPEED)
        enemy.switchSprite('run'); //changes the image to the run animation from idle A to idle and idle to A
    } else {
    enemy.switchSprite('idle'); //changes the image to the idle animation from run A to run and run to A
}

    //jumping
    if(enemy.velocity.y < 0) { //if the player is jumping, change the image to the jump animation
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) { //if the player is falling, change the image to the fall animation
        enemy.switchSprite('fall');
    }
    
    // detect if the player/enemy is colliding with the player/enemy(sideways and top bottom)
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking 
    ) {

//
        enemy.takeHit()
//
        player.isAttacking = false;
        //enemy.health -= 20; //substracts 20 health from the enemyd
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%' //DMG
        gsap.to('#enemyHealth', { 
            width: enemy.health + '%'
        }) //DMG slide animation
    }
//player gets Hit
    else if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {

//
        player.takeHit();
//

        enemy.isAttacking = false;
        //player.health -= 20; //substracts 20 health from the enemy
       // document.querySelector('#playerHealth').style.width = player.health + '%' //DMG
        gsap.to('#playerHealth', { 
            width: player.health + '%'
        }) //DMG slide animation
    }
//end game if one player has 0 health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId});
    }
}

animate(); // start the animation

//1. create a player START move right/left function
window.addEventListener('keydown', (event) => {
    if (!player.dead){
    // add this to see console 
    //SHOWS KEY PRESSED console.log(event.key) 
    switch (event.key) {
        case 'd':
          keys.d.pressed = true //if the player presses the d key, the player will move right 1px
          player.lastKey = 'd'; //true a + d
          break
        case 'a':
          keys.a.pressed = true //if the player presses the d key, the player will move left 1px
          player.lastKey = 'a'; //true a + d
          break
        case 'w':
            player.velocity.y = -20;//if the player presses the w key, the player will jump(HEIGHT)
            lastKey = 'w'; //true a + d 
          break
        case ' ':
            player.attack(); //if the player presses the space key, the player will attack
        break
    }
}

    if(!enemy.dead) {
    switch(event.key){       
        case 'ArrowRight':
            keys.ArrowRight.pressed = true //change the value of d to arrow right
            enemy.lastKey = 'ArrowRight'; 
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true //if the player presses the d key, the player will move left 1px
            enemy.lastKey = 'ArrowLeft'; 
        break
        case 'ArrowUp':
            enemy.velocity.y = -20; //if the player presses the w key, the player will jump(HEIGHT)
        break
        case 'ArrowDown':
            enemy.attack() //if the player presses the down arrow, the enemy will attack
        break}
    }
    //add this to see console, console.log(event.key);
}) // when the player presses a key, the player will move)

//2. create a player STOP move right/left function
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
          keys.d.pressed = false //if the player presses the d key, the player will move right 1px
          break
        case 'a':
          keys.a.pressed = false //if the player presses the a key, the player will move left 1px
          break
}

//enemy keys below
    switch (event.key) {
        case 'ArrowRight':
          keys.ArrowRight.pressed = false
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = false 
          break
    }
    //enemy console log, console.log(event.key);
}) // when the player presses a key, the player will move)