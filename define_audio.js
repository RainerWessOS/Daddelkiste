//** *********************************************************************
//      Daddelkiste Version 0.90 - 2016 / 2017
//      Javascript implementation of an "Advanced Slot Machine"
//
//      Copyright (C) 2017 Rainer Wess, Osnabrück, Germany
//      Open Source / Freeware - released under GPL 2
//* **********************************************************************
//     DEFINE SOUNDS v0.88

$.mbAudio.sounds = {

	audio_sprite: {
		id: "audio_sprite",
		mp3: "sound/audio_sprite.mp3",
		// Soundsegmente in der mp3-Datei
		sprite: {
			stille: {
				id: "stille",
				start: 0,
				end: 1.9,
				loop: false
			},
			walzenstop: {
				id: "walzenstop",
				start: 2.0,
				end: 4.9,
				loop: false
			},
			abbuchen: {
				id: "abbuchen",
				start: 5.0,
				end: 7.9,
				loop: false
			},
			risiko1: {
				id: "risiko1",
				start: 8.0,
				end: 9.9,
				loop: false
			},
			risiko2: {
				id: "risiko2",
				start: 10.0,
				end: 11.9,
				loop: false
			},
			angenommen: {
				id: "angenommen",
				start: 12.0,
				end: 14.9,
				loop: false
			},
			ausspielung: {
				id: "ausspielung",
				start: 15,
				end: 29.9,
				loop: false
			},
			hauptgewinn: {
				id: "hauptgewinn",
				start: 30.0,
				end: 49.6,
				loop: false
			},
		}
	}
};

function audioIsReady() {
	setTimeout(function() {

		if (isStandAlone || !isDevice)
			$.mbAudio.play(audio_sprite, 'stille');

	}, 3000);
}

$(document).on("initAudio", function() {
	$.mbAudio.pause(audio_sprite, audioIsReady);

});