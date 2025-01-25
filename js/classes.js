class Sprite {
    constructor({position, imageSrc, scale = 1, frameMax = 1, framesCurrent = 0, framesElapsed = 0, framesHold = 5, offset = {x:0, y:0}}) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.frameMax = frameMax;
        this.framesCurrent = framesCurrent;
        this.framesElapsed = framesElapsed;
        this.framesHold = framesHold;
        this.offset = offset
    };


    draw(){
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.frameMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            this.image.width / this.frameMax * this.scale, 
            this.image.height * this.scale 
        )
    };

    update(){
        this.draw();
        this.animateFrames();
    };

    animateFrames(){
        this.framesElapsed++;
        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.frameMax - 1){
                this.framesCurrent++
            } else {
                this.framesCurrent = 0;
            }
        }
    }

};

class Fighter extends Sprite{
    constructor({
        position, 
        velocity, 
        color = 'red', 
        offset, 
        imageSrc, 
        scale = 1, 
        frameMax = 1,
        framesCurrent,
        framesElapsed,
        framesHold,
        sprites,
        attackBox = {offset : {}, width:undefined, height:undefined},
        dead
    })
         {
        super({
            position, 
            scale, 
            frameMax,
            framesCurrent,
            framesElapsed,
            framesHold,
            imageSrc,
            offset,
        })
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.color = color;
        this.isAttacking = false;
        this.health = 100,
        this.sprites = sprites,
        this.dead = false;

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

        console.log(this.sprites)
    };

    

    update(){
        this.draw();
        if(!this.dead){
            this.animateFrames();
        }
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        //draw the attack box
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 95){
            this.velocity.y = 0;
            this.position.y = 332
        } else {
            this.velocity.y += gravity;
        };

    };

    //attack functionality 
    attack(){
        this.switchSprite('attack1')
        this.isAttacking = true
    };

    //taking a hit

    takeHit(damage){

        this.health -= damage

        if(this.health <= 0){
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
        }
    }

    //switch sprite

    switchSprite(sprite){
        //overrides animations when an attack it being performed
        if( 
            this.image === this.sprites.attack1.image && 
            this.framesCurrent < this.sprites.attack1.frameMax - 1 ){
                return;
            } 

        //overrides animations when someone takes a hit
        if(
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.frameMax - 1){
            return
        }

        //overrides animation when a player dies
        if(this.image === this.sprites.death.image){
            if(this.framesCurrent === this.sprites.death.frameMax - 1){
                this.dead = true;
            }
            return
        }
        


        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.frameMax = this.sprites.idle.frameMax
                    this.framesCurrent = 0;
                }
            break
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.frameMax = this.sprites.run.frameMax
                    this.framesCurrent = 0;
                }
            break
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.frameMax = this.sprites.jump.frameMax;
                    this.framesCurrent = 0;
                }
            break
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.frameMax = this.sprites.fall.frameMax;
                    this.framesCurrent = 0;
                }
            break
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.frameMax = this.sprites.attack1.frameMax;
                    this.framesCurrent = 0;
                }
            break
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image;
                    this.frameMax = this.sprites.takeHit.frameMax;
                    this.framesCurrent = 0;
                }
            break
            case 'death':
                console.log('dead')
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.frameMax = this.sprites.death.frameMax;
                    this.framesCurrent = 0;
                }
            break
        }
    }
};