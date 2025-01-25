
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
    imageSrc: './assets/background.png',
    scale: 1
});

const shop = new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc: './assets/shop.png',
    scale:2.75,
    frameMax:6,

});


const player = new Fighter({
    position: {
    x: 0,
    y: 0
    },
    velocity :{
        x: 0,
        y: 0
    },
    imageSrc: './assets/samuraiMack/idle.png',
    frameMax:8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites:{
        idle: {
            imageSrc:'./assets/samuraiMack/idle.png',
            frameMax: 8
        },
        run:{
            imageSrc: './assets/samuraiMack/Run.png',
            frameMax:8
        },
        jump:{
            imageSrc: './assets/samuraiMack/Jump.png',
            frameMax: 2,
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            frameMax: 2,
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            frameMax: 6,
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Takehit.png',
            frameMax: 4,
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            frameMax: 6,
        },
    }, 
    attackBox: {
        offset: {
          x: 100,
          y: 50
        },
        width: 160,
        height: 50
      }
});
//enemy
const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
    },
    velocity :{
        x: 0,
        y: 0
    },
    offset: {
        x: 215,
        y: 170
    },
    imageSrc: './assets/kenji/idle.png',
    frameMax:4,
    scale:2.5,
    sprites:{
        idle: {
            imageSrc:'./assets/kenji/idle.png',
            frameMax:4
        },
        run:{
            imageSrc: './assets/kenji/Run.png',
            frameMax:8
        },
        jump:{
            imageSrc: './assets/kenji/Jump.png',
            frameMax: 2,
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            frameMax: 2,
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            frameMax: 4,
        },
        takeHit: {
            imageSrc: './assets/kenji/Takehit.png',
            frameMax: 3,
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            frameMax: 7,
        },

    },
    attackBox: {
        offset: {
            x:-170,
            y:50
        },
        width:170,
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
        player.takeHit(5);
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

timer();
animate();