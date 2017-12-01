//*********************************************************************
//      Daddelkiste Disco Points Version 0.90
//      Javascript implementation of a penny arcade casino game
//
//      Copyright (C) 2017 Rainer Wess, Osnabrück, Germany
//      Open Source / Freeware - released under GPL 2.0
//*********************************************************************

// create new audio object and load the audio file
var audioSprite = new Audio();
       audioSprite.src = "sound/audio_sprite.mp3";
       audioSprite.load();
       audioSprite.pause();

// define the sprites
var spriteData = {
    stille: {
        start: 0.0,
        length: 1.9
    },
    walzenstop: {
        start: 2.0,
        length: 4.9
    },
    abbuchen: {
        start: 5.0,
        length: 7.9
    },
    risiko1: {
        start: 8.0,
        length: 9.9
    },
    risiko2: {
        start: 10.0,
        length: 11.9
    },
     angenommen: {
        start: 12.0,
        length: 14.9
    },
     ausspielung: {
        start: 15.0,
        length: 29.9
    },
    hauptgewinn: {
        start: 30.0,
        length: 49.5
    }
};

// current sprite being played
var currentSprite = {};

// time update handler to ensure we stop when a sprite is complete
var onTimeUpdate = function() {
    if (this.currentTime >= currentSprite.start + currentSprite.length) {
        this.pause();
    }
};
audioSprite.addEventListener('timeupdate', onTimeUpdate, false);

// in mobile Safari, the first time this is called will load the audio. Ideally, we'd load the audio file completely before doing this.
var audio_play = function(id) {
    if (spriteData[id] && spriteData[id].length) {
    	audioSprite.pause();
        currentSprite = spriteData[id];
        audioSprite.currentTime = currentSprite.start;
        audioSprite.play();
    }
};

// sometimes, we want it just quiet and don't care which sprite is playing
var audio_stop = function() {
    	audioSprite.pause();
};
