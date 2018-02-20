"use strict"

class AudioPlayer {

	constructor () {
		// this.audioEl = document.querySelector(".audioEl");
		this.playBtnEl = document.querySelector(".hero__play-button");

		this.fadeControls = this.fadeControls.bind(this);



		this.addEventListeners();
	}

	addEventListeners () {
		// this.playBtnEl.addEventListener("click", this.fadeControls);

	const posterElement = this._videoContainer.querySelector('.here__poster');
    posterElement.style.backgroundImage = `url(${poster})`;
    posterElement.classList.add('fade-and-scale-in');

	}

	fadeControls () {

	}

}

new AudioPlayer();