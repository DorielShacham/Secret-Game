class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale; //scale of the image
        this.framesMax = framesMax; //number of frames in the gif
        this.framesCurrent = 0; //current frame of the animation
        this.framesElapsed = 0; //time elapsed since the last frame change
        this.framesHold = 6; //number of frames the animation is held
        this.offset = offset; //offset of the image(player, enemy)
    }

    draw() {
        try {
            c.drawImage(
                this.image,
                this.framesCurrent * (this.image.width / this.framesMax), //x position of the image(shop)-crop -> loop of the frame to move image as gif
                0, //y position of the image(shop)-crop
                this.image.width / this.framesMax, //width of the image(shop)-crop
                this.image.height, //height of the image(shop)-crop
                this.position.x - this.offset.x, //x position of the image(player, enemy)-offset
                this.position.y - this.offset.y, //y position of the image(player, enemy)-offset
                (this.image.width / this.framesMax) * this.scale, //scales the image of shop
                this.image.height * this.scale
            ); //draws the image of the player+map
        }

        catch (ex) {
            console.log(this.image, ex)
        }
    }
    animateFrames() {
        this.framesElapsed++;//time elapsed since the last frame change

        if (this.framesElapsed % this.framesHold === 0) { //if the time elapsed is greater than the number of frames the animation is held
            if (this.framesCurrent < this.framesMax - 1) { //if the current frame is less than the number of frames in the gif
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0; //loops the animation
            }
        }
    }


    update() { //update behavior of the players during the game(movement, gravity, attacks)
        this.draw();
        this.animateFrames();
    }
}

// Creating fighters animations

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width, undefined, height: undefined }
    }) {
        super({ position, imageSrc, scale, framesMax, offset });
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset, //position of the attack box player & enemy
            width: attackBox.width, //width of the attack box
            height: attackBox.height //height of the attack box
        }
        this.color = color
        this.isAttacking
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 12; //animation speed = loops speed
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) { //walk to run animation - we loop over sprites
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
        console.log(this.sprites);   //- uncomment for debugging the animations 

    }


    update() { //update behavior of the players during the game(movement, gravity, attacks)
        this.draw();
        if(!this.dead)
        this.animateFrames();

        //attack Boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        //Draw ATTACK BOX => // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; //stops players from going off screen

        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) { //stops players from going off floor(-95 is the height of the ground))){
            this.velocity.y = 0; //if the player is on the ground, stop falling 
            this.position.y = 331; //stops player from going off screen
        } else {
            this.velocity.y += gravity; //else gravity makes objects fall smoothly - makes it not fall below window
        }

        //print location of player => console.log(this.position.y);

    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100); //time for attack to actually hit the hit box = animation end
    }

    takeHit() {
        //this.switchSprite('takeHit')
        this.health -= 5; //substracts 20 health 

        if(this.health <= 0 ){
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite) {
        //make the game stop after death animation
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax -1) 
                this.dead = true;
            return 
        }
        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
            return

        //overriding when  fighter gets hit
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return


        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax; //idle animation has the same number of frames as the jump animation
                    this.framesCurrent = 0; //reset the current frame to 0
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax; //return to idle after running
                    this.framesCurrent = 0; //reset the current frame to 0
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax; //return to idle after jumping
                    this.framesCurrent = 0; //reset the current frame to 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax; //return to idle after falling
                    this.framesCurrent = 0; //reset the current frame to 0
                    break;
                }
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax; //return to idle after attacking
                    this.framesCurrent = 0; //reset the current frame to 0
                    break;
                }
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax; //return to idle after taking hit
                    this.framesCurrent = 0; //reset the current frame to 0
                    break;
                }
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax; //return to idle after taking hit                        this.framesCurrent = 0; //reset the current frame to 0
                    break;
                }
        }

    }
}