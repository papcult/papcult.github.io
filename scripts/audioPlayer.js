"use strict"

class VideoPlayer {

	constructor (video) {

		if (!video) {
	      throw new Error('No video element provided.');
	    }

	    const poster = video.dataset.posterUrl;
	    const youtubeVidId = video.dataset.youtubeId
	    const bufferingEvent = new CustomEvent(
			"buffering", 
			{
				detail: {
					message: "Buffer happened!",
				},
				bubbles: true,
				cancelable: true
			}
		);


		this._video = video;
		this._youtubeVidId = youtubeVidId;
		this._poster = poster;
   	 	this._videoContainer = this._video.parentNode;
   	 	this._videoIframe = this._video.querySelector("#hero__ytplayer");   	 
   	 	this._ytPlayer = null;	
		this._createPoster = this._createPoster.bind(this);
		this._onPlayerReady = this._onPlayerReady.bind(this);
		
		this._enabled = false;
    	this._pendingHide = undefined;
    	this._videoControls = document.querySelector('.hero__show-info');

		this._addEventListeners = this._addEventListeners.bind(this);
    	this.toggleControls = this.toggleControls.bind(this);
	    this.showControls = this.showControls.bind(this);
	    this.hideControls = this.hideControls.bind(this);		
   	 	this._onBufferChanged = this._onBufferChanged.bind(this)
		this._onClick = this._onClick.bind(this);

		this._bufferingEvent = bufferingEvent;

		this.init();
	}

	init () {
		this._createPoster(this._poster);
		this._addEventListeners();
	}


	_addEventListeners () {
	    this._videoContainer.addEventListener('mousemove', _ => this.showControls());
	    this._videoContainer.addEventListener('mouseout', _ => this.hideControls());

    	this._videoContainer.addEventListener('click', this._onClick);
    	this._videoContainer.addEventListener('buffering', this._onBufferChanged);
	}


	_createPoster (poster) {
    const posterElement = this._videoContainer.querySelector('.hero__poster');
    posterElement.style.backgroundImage = `url(${poster})`;
    posterElement.classList.add('fade-and-scale-in');
  	}

  _onClick (evt) {
    const target = evt.target;

    if (target.classList.contains('hero__play-button')) {
      const videoEl = this._videoContainer.querySelector('.hero__element');
      videoEl.classList.add('hero__element--active');
      this._enabled = true;
      this._videoControls.classList.add('hero__show-info--active');
      return this._loadAndPlayVideo();
    }
  }

  _loadAndPlayVideo() {
  	this._videoContainer.dispatchEvent(this._bufferingEvent);

  	this._ytPlayer = new YT.Player(this._videoIframe, {
        videoId: this._youtubeVidId,
        playerVars: {
            color: 'white',
            autoplay: 1,
            listType:'playlist',
            list: 'PLSHYGaWnG7P8acm0E3koULXveHwgidNO4',
            showinfo: 0
        },
        events: {
          'onReady': this._onPlayerReady
        }
    }); 




  }

  _onBufferChanged (evt) {
    const bufferingClass = 'hero--buffering';
    this._videoContainer.classList.toggle(bufferingClass, evt.buffering);
  }

  _onPlayerReady (event) {
  	this._videoContainer.dispatchEvent(this._bufferingEvent);

  	if (this._ytPlayer.isMuted()) {
  	event.target.setVolume(100);
    }

  }

   _setMediaSessionData () {
    if (!VideoPlayer.SUPPORTS_MEDIA_SESSION) {
      return;
    }

    const artworkPath256 = this._assetPath + '/artwork@256.jpg';
    const artworkPath512 = this._assetPath + '/artwork@512.jpg';

    navigator.mediaSession.metadata = new MediaMetadata({
      title: this._title,
      album: this._showTitle,
      artwork: [
        {src: artworkPath256, sizes: '256x256', type: 'image/jpg'},
        {src: artworkPath512, sizes: '512x512', type: 'image/jpg'},
      ]
    });

    navigator.mediaSession.setActionHandler('play', this._onPlay);
    navigator.mediaSession.setActionHandler('pause', this._onPause);
    navigator.mediaSession.setActionHandler('seekbackward', this._onBack30);
    navigator.mediaSession.setActionHandler('seekforward', this._onFwd30);
  } 

  static get HIDE_TIMEOUT () {
    return 500;
  }

   get enabled () {
    return this._enabled;
  }

  set enabled (_enabled) {
    this._enabled = _enabled;

    if (!this._enabled) {
      this.hideControls(0);
      this._videoControls.classList.remove('hero__show-info--active');
      return;
    }

    this._videoControls.classList.add('hero__show-info--active');
  }

    _cancelPendingHide () {
    if (!this._pendingHide) {
      return;
    }

    clearTimeout(this._pendingHide);
    this._pendingHide = undefined;
  }

  showControls (cancelHide=false) {
  	console.log("you moused over the element")
    this._cancelPendingHide();

    if (!this._enabled) {
    	console.log("fell at enabled part")
      return;
    }

    this._videoControls.classList.add('hero__show-info--visible');

    if (cancelHide) {
      return;
    }

    this.hideControls(VideoPlayer.HIDE_TIMEOUT * 5);
  }

  hideControls (timeout=VideoPlayer.HIDE_TIMEOUT) {
    if (!Number.isFinite(timeout)) {
      timeout = VideoPlayer.HIDE_TIMEOUT;
    }

    this._cancelPendingHide();
    this._pendingHide = setTimeout(_ => {
      this._videoControls.classList.remove('hero__show-info--visible');
    }, timeout);
  }

  toggleControls () {
    if (this._videoControls.classList.contains('hero__show-info--visible')) {
      this.hideControls();
      return;
    }

    this.showControls();
  }


}