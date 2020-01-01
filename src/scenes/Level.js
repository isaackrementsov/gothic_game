import Phaser from 'phaser';

import floorBlock from '../assets/floor-block.png';
import floorBlockFragile from '../assets/floor-block-fragile.png';

import door from '../assets/door.png';
import arrow from '../assets/arrow.png';

import characterSheet from '../assets/character-spritesheet.png';

import trap from '../assets/trap.png';
import trapClose from '../assets/trap-close.png';

import ambience from '../assets/ambience.mp3';
import walkSound from '../assets/walk.mp3';
import nextLevel from '../assets/nextLevel.mp3';
import blockFall from '../assets/block-fall.mp3';
import trapSound from '../assets/trap.mp3';

export default class Level extends Phaser.Scene {

    constructor(name, speedMode, hideDoor, startFromTop){
        super(name);

        this.name = name;
        this.vx = 200;
        this.vy = 300;
        this.speedMode = speedMode || false;
        this.hideDoor = hideDoor || false;
        this.startFromTop = startFromTop || false;
    }

    preload(message, background){
        this.load.image('floor-block', floorBlock);
        this.load.image('floor-block-fragile', floorBlockFragile);

        this.load.spritesheet('character-anim', characterSheet, {
            frameHeight: 242,
            frameWidth: 99
        });

        this.load.image('door', door);
        this.load.image('arrow', arrow);

        this.load.image('trap', trap);
        this.load.image('trap-close', trapClose);

        this.load.image(this.name + '-message', message);
        this.load.image(this.name + '-background', background);

        this.load.audio('walk', walkSound);
        this.load.audio('ambience', ambience);
        this.load.audio('next-level', nextLevel);
        this.load.audio('block-fall', blockFall);
        this.load.audio('trap-sound', trapSound);
    }

    create(){
        this.cameras.main.setBounds(0, 0, 700, 700);
        this.physics.world.setBounds(0, 0, 700, 800);

        const bg = this.add.image(0, 0, this.name + '-background').setOrigin(0, 0).setScrollFactor(1);
        const door = this.add.image(0, 0, 'door').setOrigin(this.startFromTop ? -2.3 : 0, this.startFromTop ? -2.155 : -0.08);

        bg.setScale(0.234, 0.234);
        door.setScale(0.35, 0.35);

        if(this.hideDoor){
            door.visible = 0;

            this.replaceDoor();
        }

        this.character = this.physics.add.sprite(0, 0, 'character-anim', 0);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('character-anim', {start: 0, end: 1}),
            repeat: -1,
            frameRate: 6
        });

        if(!this.startFromTop) this.character.y = 610;

        this.character.setScale(0.28, 0.28);
        this.character.setGravityY(200);
        this.character.setCollideWorldBounds();

        this.walk = this.sound.add('walk');
        this.dropBlockSound = this.sound.add('block-fall');
        this.ambience = this.sound.add('ambience', {loop: true});

        this.ambience.volume = 0.7;
        this.dropBlockSound.volume = 0.5;

        this.ambience.play();
    }

    finishCreate(adjust){
        this.followCharacter();
        this.showMessage(adjust);
    }

    followCharacter(){
        this.cameras.main.startFollow(this.character, true, 0.09, 0.09);
        this.cameras.main.setZoom(4);
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    showMessage(adjust){
        const messageText = this.add.image(0, 0, this.name + '-message').setOrigin(0, adjust ? -26.8 : (this.startFromTop ? -3.98 : -35.4));
        messageText.setScale(0.228, 0.228);
    }

    die(wait){
        this.stopAudio();

        if(wait){
            setTimeout(() => {
                this.die();
            }, wait);
        }else{
            this.scene.start(this.name);
        }
    }

    update(){
        let cursors = this.input.keyboard.createCursorKeys();

        this.character.setVelocityX(0);

        if(cursors.right.isDown){
            this.character.setVelocityX(this.vx);
            this.character.flipX = false;
        }

        if(cursors.left.isDown){
            this.character.setVelocityX(-this.vx);
            this.character.flipX = true;
        }

        if((cursors.right.isDown || cursors.left.isDown) && this.character.body.velocity.y == 0){
            if(!this.character.anims.isPlaying) this.character.play('walk');
            if(!this.walk.isPlaying){
                if(this.walk.isPaused){
                    this.walk.resume();
                }else{
                    this.walk.play();
                }
            }
        }else{
            this.character.anims.stop();
            this.walk.pause();
        }

        if(cursors.up.isDown && this.character.y < 650 && this.character.body.velocity.y == 0){
            this.character.setVelocityY(-this.vy);
        }

        if(this.character.y > 700){
            this.die();
        }

        if((!this.startFromTop && this.character.x < 100 && this.character.y < 200) || (this.startFromTop && this.character.x > 500 && this.character.y > 600)){
            let enter = this.input.keyboard.addKey('enter');

            if(enter.isDown){
                if(this.name != 'Level5') this.sound.play('next-level');
                this.next();
            }
        }
    }

    next(){
        this.stopAudio()
        this.scene.start('Level' + (parseInt(this.name.split('Level')[1]) + 1));
    }

    stopAudio(){
        this.walk.stop();
        this.ambience.stop();
    }

    dropBlock(_character, block){
        if(!block.body.immovable){
            if(!this.dropBlockSound.isPlaying) this.dropBlockSound.play();
            block.setGravityY(200);
        }
    }

    closeTrap(_character, trap){
        const wait = 500;

        this.cameras.main.flash(wait, 240, 124, 124, false);

        this.sound.play('trap-sound');

        trap.destroy();

        this.die(wait);
    }

    createPlatform(startX, startY, length, fragileP, showTrapP, end){
        let blockGroup = this.physics.add.group();

        this.physics.add.collider(this.character, blockGroup, this.dropBlock, null, this);

        if(this.cop){
            this.physics.add.collider(this.cop, blockGroup, this.dropBlock, null, this);
        }

        for(let i = 0; i < length; i++){
            let fragile = Math.random() <= fragileP && (i != 0 || this.startFromTop);
            let showTrap = Math.random()*Math.random() >= (1 - showTrapP) && (i > 1);

            let block = this.physics.add.sprite(0, 0, fragile ? 'floor-block-fragile' : 'floor-block').setOrigin(-i + startX, startY);
            blockGroup.add(block);

            if(!fragile) block.setImmovable();

            if(showTrap && !fragile){
                let trap = this.physics.add.sprite(0, 0, 'trap').setOrigin(1.3*(-i + startX), 3*startY + 1);

                trap.setImmovable();
                trap.setScale(0.12, 0.12);

                this.physics.add.collider(this.character, trap, this.closeTrap, null, this);

            }
        }

        if(!end && !this.startFromTop){
            let arrow = this.add.image(0, 0, 'arrow').setOrigin(startX < 0 ? -14 : 0, startY*0.5);
            arrow.setScale(0.5, 0.5);
        }
    }

}
