import Level from './Level';

import background from '../assets/level5.png';
import message from '../assets/level5-message.png';

import soundBarFrame from '../assets/sound-bar-frame.png';
import soundBarFill from '../assets/sound-bar-fill.png';

import copSpriteSheet from '../assets/cop-spritesheet.png';

import copStop from '../assets/stop.mp3';

export default class Level5 extends Level {

    constructor(){
        super('Level5', false, false, true);
    }

    preload(){
        super.preload(message, background);

        this.load.image('sound-bar-frame', soundBarFrame);
        this.load.image('sound-bar-fill', soundBarFill);

        this.load.spritesheet('cop-anim', copSpriteSheet, {
            frameHeight: 402,
            frameWidth: 200
        });

        this.load.audio('stop', copStop);
    }

    create(){
        this.soundVal = 0;

        super.create();

        this.cop = this.physics.add.sprite(0, 0, 'cop-anim', 0).setOrigin(0, -10);

        this.cop.setScale(0.15, 0.15);

        this.anims.create({
            key: 'cop-walk',
            frames: this.anims.generateFrameNames('cop-anim', {start: 0, end: 1}),
            repeat: -1,
            frameRate: 6
        });

        this.cop.visible = 0;

        this.physics.add.collider(this.character, this.cop, this.copKill, null, this);

        const fragileP = 0.5;
        const showTrapP = 0.7;

        let y = -6;
        let x = 0;

        while(y > -23){
            super.createPlatform(x, y, 2, 0, showTrapP);

            y--;
            x--;
        }

        super.createPlatform(x, y, 10, fragileP, 0);

        const frame = this.add.image(431, 412, 'sound-bar-frame').setScrollFactor(0);
        this.fill = this.add.image(431, 438, 'sound-bar-fill').setScrollFactor(0);

        frame.setScale(0.14, 0.24);
        this.fill.setScale(0.145, 0);

        super.finishCreate();
    }

    copKill(_character, _cop){
        super.stopAudio();
        this.scene.start('Scene2', {win: false});
    }

    updateSound(val){
        if((val > 0 && (this.soundVal + val) < 191) || (val < 0 && (this.soundVal + val) > 0)){
            this.soundVal += val;
            this.fill.setScale(0.145, 0.255*this.soundVal/100);
        }

        if((this.soundVal + val) > 200 && this.cop.visible == 0){
            this.sound.play('stop');
            
            this.soundVal = 200;
            this.fill.setScale(0.145, 0.255*this.soundVal/100);

            this.cop.visible = 1;
            this.cop.y = -700;
            this.cop.setGravityY(100);
            this.cop.play('cop-walk');
        }
    }

    update(){
        super.update();
        this.updateSound(-0.1);

        if(this.character.body.velocity.y != 0){
            this.updateSound(1);
        }

        if(this.character.body.velocity.x != 0){
            this.updateSound(1);
        }

        if(this.cop.visible == 1){
            let dx = this.character.x - this.cop.x;
            let dy = this.character.y - this.cop.y;

            this.cop.setVelocityX(this.vx*dx/100);
            this.cop.setVelocityY(this.vy*dy/100);
        }
    }

    dropBlock(character, block){
        if(character.texture.key == 'character-anim'){
            super.dropBlock(character, block);

            if(!character.body.wasTouching.down){
                if(block.body.immovable){
                    this.updateSound(20);
                }else{
                    this.updateSound(30);
                }
            }
        }else{
            block.setImmovable();
        }
    }

    next(){
        super.stopAudio();
        this.scene.start('Scene2', {win: true});
    }

}
