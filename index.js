
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;


const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: '/img/background.png',
    scale: 1
});

const shop = new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc: '/img/shop.png',
    scale:2.75,
    frameMax:6,

});

const player = new Fighter({
    position: { x: 0, y: 200 },
    velocity: { x: 0, y: 0 },
    imageSrc: '/img/samuraiMack/Idle.png', // Updated path
    frameMax: 8,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
        idle: {
            imageSrc: '/img/samuraiMack/Idle.png', // Updated path
            frameMax: 8
        },
        run: {
            imageSrc: '/img/samuraiMack/Run.png', // Updated path
            frameMax: 8
        },
        jump: {
            imageSrc: '/img/samuraiMack/Jump.png', // Updated path
            frameMax: 2
        },
        fall: {
            imageSrc: '/img/samuraiMack/Fall.png', // Updated path
            frameMax: 2
        },
        attack1: {
            imageSrc: '/img/samuraiMack/Attack1.png', // Updated path
            frameMax: 6
        },
        takeHit: {
            imageSrc: '/img/samuraiMack/Takehit.png', // Updated path
            frameMax: 4
        },
        death: {
            imageSrc: '/img/samuraiMack/Death.png', // Updated path
            frameMax: 6
        }
    },
    attackBox: {
        offset: { x: 100, y: 50 },
        width: 160,
        height: 50
    }
});
//enemy
const enemy = new Fighter({
    position: { x: 400, y: 200 },
    velocity: { x: 0, y: 0 },
    offset: { x: 215, y: 170 },
    imageSrc: '/img/kenji/Idle.png', // Updated path
    frameMax: 4,
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: '/img/kenji/Idle.png', // Updated path
            frameMax: 4
        },
        run: {
            imageSrc: '/img/kenji/Run.png', // Updated path
            frameMax: 8
        },
        jump: {
            imageSrc: '/img/kenji/Jump.png', // Updated path
            frameMax: 2
        },
        fall: {
            imageSrc: '/img/kenji/Fall.png', // Updated path
            frameMax: 2
        },
        attack1: {
            imageSrc: '/img/kenji/Attack1.png', // Updated path
            frameMax: 4
        },
        takeHit: {
            imageSrc: '/img/kenji/Takehit.png', // Updated path
            frameMax: 3
        },
        death: {
            imageSrc: '/img/kenji/Death.png', // Updated path
            frameMax: 7
        }
    },
    attackBox: {
        offset: { x: -170, y: 50 },
        width: 170,
        height: 50
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },

}


function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.width);
    background.update();
    shop.update();
    player.update();
    enemy.update();
    botLogic();

    player.velocity.x = 0;

    //player movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if(keys.d.pressed && player.lastKey === 'd'){
        player.switchSprite('run');
        player.velocity.x = 5;
    } else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump');
    } else if(player.velocity.y > 0){
        player.switchSprite('fall')
    } 




    //enemy movement
    enemy.velocity.x = 0;
    if( keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.switchSprite('run');
        enemy.velocity.x = -5;
    } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    } else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect collision for enemy getting hit
   if(
        player.isAttacking 
        &&checkForCollision({rectangle1: player, rectangle2: enemy})
        && player.framesCurrent === 4
    ){
        enemy.takeHit(10);
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width: `${enemy.health}%`
        })
        if(enemy.health === 0){
            document.getElementById('rematchButton').style.removeProperty('display')
            determineWinner(player, enemy);
        }
   };

   //if player misses their attack
   if(player.isAttacking && player.framesCurrent === 4){
    player.isAttacking = false;
   }

   if(enemy.isAttacking 
    &&checkForCollision({rectangle1: enemy, rectangle2: player})
    && enemy.framesCurrent === 2
   ){
        player.takeHit(10);
        gsap.to('#playerHealth', {
            width: `${player.health}%`
        })
        enemy.isAttacking = false

        if(player.health === 0){
            document.getElementById('rematchButton').style.removeProperty('display')
            determineWinner(player, enemy);
        }
   };

   //check if enemy misses 
   if(enemy.isAttacking && enemy.framesCurrent === 2){
    enemy.isAttacking = false;
   }
};

//rematch functionality
document.getElementById('rematchButton').addEventListener(('click'), () =>{
    window.location.reload();
})


window.addEventListener('keydown', (event) => {
    if(player.dead || enemy.dead) return
    switch(event.key){
        case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd'
        break;
        case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break; 
        case 'w':
        player.velocity.y = -20
        break;
        case ' ':
        player.attack();
        break;
        
        
        //enemy
        case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight'
        break;
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break; 
        case 'ArrowUp':
        enemy.velocity.y = -20
        break;
        case 'Shift':
        enemy.attack();
        break;
        
    };
});

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
        keys.d.pressed = false;
        break;
        case 'a':
        keys.a.pressed = false;
        break;
    }

    //enemy keys
    switch(event.key){
        case 'ArrowRight':
        keys.ArrowRight.pressed = false;
        break;
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        break;
    }
});
let lastBotDecisionTime = 0; // Track the last time the bot made a decision
const botDecisionCooldown = 200; // Cooldown time in milliseconds (e.g., 500ms = 0.5 seconds)

function botLogic() {
    if(player.health === 0 || enemy.health === 0 ){
        keys.ArrowLeft.pressed = false;
        keys.ArrowRight.pressed = false;
        return
    }
    const currentTime = Date.now();

    // Only make a decision if the cooldown has passed
    if (currentTime - lastBotDecisionTime < botDecisionCooldown) {
        return; // Exit the function if the cooldown hasn't passed
    }

    lastBotDecisionTime = currentTime; // Update the last decision time

    const distance = Math.abs(player.position.x - enemy.position.x);
    // Move towards the player
    if(distance > 150){
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
    } else if(distance < 150){
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight'
    } else {
        keys.ArrowLeft.pressed = false;
        keys.ArrowRight.pressed = false;
    }

    if(player.velocity.y < 0){
        console.log(enemy.velocity.y)
        enemy.velocity.y = -20
    }

    // Attack if within range
    if (distance < 150 && !enemy.isAttacking) {
      enemy.attack();
    }
  }

timer();
animate();