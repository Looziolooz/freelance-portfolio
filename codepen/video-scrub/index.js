'use strict';
/*------------------------------
Original video at Mixkit: https://mixkit.co/free-stock-video/slow-aerial-tour-through-a-mist-covered-forest-28342/

VIDEO ENCODING NOTES:

ffmpeg command for video scrubbing:

These are the key elements that would most directly affect the performance and effectiveness of attaching the video to a scrollbar for scrubbing operations.

-vf "scale=-1:1080": This scales the video height to 1080 pixels while maintaining the aspect ratio.
-preset slow: Though this setting makes the encoding process slower, it provides better compression, which could be beneficial for smooth scrubbing because smaller file sizes usually load faster.
-movflags +faststart: This is crucial for video scrubbing. It allows the video to start playing before it is completely downloaded, making it quicker to start viewing during a scrub operation.
-keyint_min 6 -g 6: These settings control the interval between keyframes, which are the frames used as reference points for the frames that follow. Fewer frames between keyframes can make seeking more accurate but may increase file size. These settings are vital for smooth and accurate scrubbing.
-an: Disabling the audio.
-crf 20: This controls the quality of the video. Depending on your needs, you might want to adjust this to find a balance between video quality and file size, which will affect the speed and smoothness of scrubbing.
-format yuv420p: Ensures broader compatibility with media players.

# ffmpeg command:
ffmpeg -i {input_video}.mp4 -vf "format=yuv420p,scale=-1:1080" -vcodec libx264 -profile:v main -level:v 5.1 -crf 20 -preset slow -tune animation -movflags +faststart -keyint_min 6 -g 6 -strict -2 -an {output_video}_scrub.mp4
------------------------------*/

/*------------------------------
utils at: https://assets.codepen.io/573855/lr-codepen-utils.js
------------------------------*/

/*------------------------------
Register Gsap plugins
------------------------------*/
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/*------------------------------
ScrollTrigger Config
------------------------------*/
ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
    //autoRefreshEvents: ''
});

/*------------------------------
Init Gsap ScrollSmoother
------------------------------*/
var scroller = (function() {
    // Ensure gsap and ScrollSmoother are defined, and device isn't touch-enabled
    if (typeof gsap === 'undefined' || typeof ScrollSmoother === 'undefined' || utils.isTouch()) {
        utils.addClass(document.body, 'normalize-scroll');
        return null;
    }

    // Public API
    return {
        initialize: function(contentSelector_, wrapperSelector_) {
            return ScrollSmoother.create({
                content: contentSelector_ || '.content-scroll',
                wrapper: wrapperSelector_ || '.viewport-wrapper',
                smooth: 2,
                effects: false,
                normalizeScroll: true,
                preventDefault: true
            });
        }
    };
})();

/*------------------------------
    gsapVideoScrub
------------------------------*/
var gsapVideoScrub = {

    _isValidVideoDuration: function(video_) {
        var duration = video_.duration;
        if (isFinite(duration) && !isNaN(duration)) {
            console.log('Video Duration is valid:', duration);
            return true;
        } else {
            console.log('Video Duration is not valid:', duration);
            return false;
        }
    },

    //Pause or play/load the video based on its visibility within the viewport
    _handleVideoIntersect: function(entries_, observer_) {
        entries_.forEach(function(entry) {
            if (entry.isIntersecting) {
                this._playVideo();
            } else {
                // If the video is not in viewport, pause the video
                this._pauseVideo();
            }
        }.bind(this));

    },

    _playVideo: function() {
        if (!this._options.isScrubActive) {
            // If scrubbing is not active, just play the video
            // The play() method implicitly loads the video if it hasn't been loaded yet.
            this.DOM.video.play().catch(function(error) {
                // Handle the case where autoplay was prevented.
                // Show a "Play" button or something similar.
                console.log('Autoplay was prevented:', error);
            });
        } else {
            // If scrubbing is active, make sure the metadata or data are loaded before setting up the scrubbing.
            this.DOM.video.addEventListener('loadedmetadata', function() {
                console.log('Video metadata has been loaded');
                console.log('this.DOM.video.duration', this.DOM.video.duration);
                if (this._isValidVideoDuration(this.DOM.video)) {
                    this._setVideoScrub();
                }
            }.bind(this));

            this.DOM.video.addEventListener('loadeddata', function() {
                console.log('Video data has been loaded');
                console.log('this.DOM.video.duration', this.DOM.video.duration);
                if (this._isValidVideoDuration(this.DOM.video)) {
                    this._setVideoScrub();
                }
            }.bind(this));

            // The play() method implicitly loads the video if it hasn't been loaded yet.
            var playPromise = this.DOM.video.play();
            // This is necessary because a video can't be paused until it has started playing.
            // If pause() is called immediately after play(), it can sometimes fail because
            // the video hasn't fully entered the "playing" state.
            if (playPromise !== undefined) {
                playPromise.then(function(_) {
                        // Automatic playback started!
                        // We can now safely pause video...
                        this.DOM.video.pause();
                    }.bind(this))
                    .catch(function(error) {
                        // Auto-play was prevented
                        //... handle error here
                    });
            }
        }
    },

    _pauseVideo: function() {
        if (!this._options.isScrubActive) {
            if (!this.DOM.video.paused) {
                this.DOM.el.pause();
            }
        }
    },

    // Update from _mainGsapAnimation.
    updateVideoTime: function(progress_) {
        progress_ = isNaN(progress_) ? 0 : Math.min(Math.max(progress_, 0), 1);
        this.DOM.video.currentTime = utils.interpolateRange(progress_, 0, 1, 0, this.DOM.video.duration || 1);
    },

    _setVideoScrub: function() {
        if (!this._mainGsapAnimation || !this.DOM.video || this._videoScrubInitialized) return;
        this._videoScrubInitialized = true;
        if (!this.DOM.video.paused) {
            this.DOM.video.pause();
        }
    },

    //Initializes the IntersectionObserver for the video and starts observing only its visibility
    _initializeVideo: function() {
        this._observer = new IntersectionObserver(this._handleVideoIntersect.bind(this), { threshold: 0 });
        this._observer.observe(this.DOM.video);
    },

    /**
     * Determines the width of the mask's border.
     * This function considers the width of the window to provide a proportional border size.
     * The mask border width is either determined by a custom CSS variable (--spacing) or calculated relative to the window width.
     * The --spacing is fetched as a custom CSS variable from the document root, and the --mask-min-wrapper-size is retrieved as a custom CSS variable from the mask element.
     */
    _getMaskBorderWidth: function() {
        // If the window width is less than or equal to the minimum allowable size of the mask wrapper 
        // (as defined by the custom CSS variable --mask-min-wrapper-size),
        // use the custom CSS variable --spacing for the mask border width.
        if (window.innerWidth <= this._maskMinWrapperSize) {
            return this._spacing;
        }
        // If the window width is larger than the minimum allowable size of the mask wrapper,
        // calculate the mask border width. It's calculated as half of the surplus space (space beyond the minimum size defined by --mask-min-wrapper-size),
        // with the custom CSS variable --spacing added.
        // The result is rounded to avoid subpixel rendering issues.
        else {
            return Math.round(((document.documentElement.clientWidth - this._maskMinWrapperSize) * 0.5) + (this._spacing));
        }
    },

    /**
     * Updates the border width of the mask in sync with a GSAP animation.
     * This progress value is used to interpolate the mask border width, creating a dynamic border that updates during the animation.
     * 
     * The actual change of the border width is done by modifying a CSS variable (--mask-border-width) of the mask element.
     */
    updateMaskBorder: function(progress_) {
        progress_ = isNaN(progress_) ? 0 : Math.min(Math.max(progress_, 0), 1);
        this.DOM.mask.style.setProperty('--mask-border-width', utils.interpolateRange(progress_, 0, 1, 0, this._getMaskBorderWidth()) + 'px');
    },

    _initializeGsapAnimations: function() {
        var self = this;
        var uid = utils.getUID();

        if (!this._mainGsapAnimation) {
            this._mainGsapAnimation = ScrollTrigger.create({
                id: 'main-pin-' + uid,
                trigger: this.DOM.trigger,
                pin: this.DOM.pin,
                pinSpacing: false,
                scrub: true,
                invalidateOnRefresh: true, // Re-evaluate pinning and animation positions when the window resizes.
                anticipatePin: 1, // Prepare for pinning one tick before it actually happens.

                // Function to run on scroll update.
                onUpdate: function(scTriggerObject_) {
                    // Update the video time if video scrubbing has been initialized.
                    if (self._videoScrubInitialized) {
                        self.updateVideoTime(scTriggerObject_.progress);
                    }
                },

                // Start pinning when the top of the trigger element reaches the top of the viewport.
                start: 'top top',

                // Define the scroll end point dynamically.
                end: function() {
                    // Calculate the viewport height.
                    var vh = Math.max(utils.getVh(), self._minHeight);
                    // Determine the scroll duration based on the minimum duration.
                    var duration = self._minDuration * vh;

                    // Optionally adjust the termination point based on the 'exactScrollerEnd' option.
                    var offset = self._options.exactScrollerEnd ? (vh * -0.5) : 0;

                    return '+=' + (duration + offset) + 'px';
                },
                //markers: true,
            });
        }

        var overlays = Array.from(this._overlays);
        var overlayEl, overlayIndex, topPercent;
        var i = 0;
        var l = overlays.length;
        for (; i < l; i++) {
            overlayEl = overlays[i];
            if (overlayEl) {
                overlayIndex = parseFloat(overlayEl.getAttribute('data-time'));
                topPercent = (overlayIndex / (this._minDuration - 1)) * 100;
                overlayEl.style.setProperty('--top-percent', (topPercent + '%'));
                this._addOverlayAnimation(overlayEl, i, uid);
            }
        }

        if (!this._maskGsapAnimation && this.DOM.mask) {
            // GSAP animation that changes the mask's border width based on the scroll progress.
            this._maskGsapAnimation = gsap.to(this, {
                updateMaskBorder: 1,
                duration: 1,
                ease: 'none',
                scrollTrigger: {
                    id: 'bottom-mask-' + uid,
                    trigger: this.DOM.mask,
                    scrub: true,
                    invalidateOnRefresh: true,
                    onEnter: function() {
                        // When the mask fully enters the viewport, set the border width offset to the mask's corner radius.
                        // This creates the effect of the mask expanding from its corners.
                        self.DOM.mask.style.setProperty('--mask-border-width-offset', self._maskCornerRadius + 'px');
                    },
                    onLeaveBack: function() {
                        // When scrolling backwards past the start of the mask, reset the border width offset to 0.
                        // This creates the effect of the mask shrinking back to its original size, 0px.
                        self.DOM.mask.style.setProperty('--mask-border-width-offset', '0px');
                    },
                    start: function() {
                        return 'center ' + (utils.getVh() * 0.5) + 'px';
                    },
                    end: function() {
                        return 'bottom ' + (utils.getVh() * 0.5) + 'px';
                    },
                    //markers: true,
                }
            });
        }

        ScrollTrigger.refresh();
    },

    _addOverlayAnimation: function(overlayEl_, inc_, uid_) {
        if (!overlayEl_) return;
        var triggerEl = overlayEl_.querySelector('.card-container');
        var animationEl = overlayEl_.querySelector('.card-content');
        if (!triggerEl || !animationEl) return;
        var self = this;
        gsap.to(animationEl, { yPercent: 20, opacity: 0, scale: 0.9 });
        var overlayScrollTrigger = gsap.to(animationEl, {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            scrollTrigger: {
                id: 'overlay-' + inc_ + '-' + uid_,
                trigger: triggerEl,
                invalidateOnRefresh: true,
                start: function() {
                    var vh = Math.max(utils.getVh(), self._minHeight);
                    return 'bottom ' + (vh + 'px');
                },
                toggleActions: 'restart none none reverse',
            }
        });

    },

    _reset: function() {
        this.DOM = {};
        // The --spacing is fetched as a custom CSS variable from the document root as numeric pixel value.
        this._spacing = utils.getCustomCssVar('--spacing', true, true);
        this._mainGsapAnimation = null;
        this._maskGsapAnimation = null;
        this._videoScrubInitialized = false;

        this._maskCornerRadius = 0;
        this._minDuration = 5;
        this._minHeight = utils.getVh();
        this._overlayContainer = null;
        this._overlays = null;
        this._options = {
            selector: null,
            trigger: null,
            isScrubActive: false,
            roundedMask: false,
            exactScrollerEnd: true,
        };
    },

    initialize: function(options_) {
        // Reset the object's properties to their default values
        this._reset();

        // Merge defaults with options_,
        this._options = Object.assign(this._options, options_);

        // Get the main element based on the provided selector
        this.DOM.el = document.querySelector(this._options.selector);

        // Verify if the element based on the selector exists
        if (!this.DOM.el) {
            console.warn('The selector option is not optional. Please provide a valid selector.');
            return;
        }

        this._minHeight = utils.getElCustomCssVar(this.DOM.el, '--min-height', true, true);

        this.DOM.pin = this.DOM.el.querySelector('.pinned-container');
        this.DOM.trigger = this.DOM.el.querySelector(this._options.trigger) || this.DOM.pin.firstElementChild;

        this.DOM.mediaContainer = this.DOM.el.querySelector('.media-container');
        this.DOM.video = this.DOM.el.querySelector('video');

        // Check if the video element has 'loop' attribute and if scrubbing is active
        if (this.DOM.video.hasAttribute('loop') && this._options.isScrubActive) {
            // If conditions are met, remove the 'loop' attribute from the video element
            this.DOM.video.removeAttribute('loop');
        }

        this.DOM.overlayContainer = this.DOM.el.querySelector('.overlay-container');
        this.DOM.overlayContainer.style.setProperty('--height-multiplier', this._minDuration - 1);

        this.DOM.overlayItems = this.DOM.el.querySelector('.overlay-items');

        this._overlays = this.DOM.overlayItems.querySelectorAll('.overlay-item');

        this.DOM.mask = this.DOM.el.querySelector('.bottom-mask');
        if (this.DOM.mask) {
            if (this._options.roundedMask) {
                this.DOM.mask.dataset.rounded = 'true';
            }
            // The --mask-corner-radius and --mask-min-wrapper-size are fetched as a custom CSS variable from the mask element as numeric pixel values.
            this._maskCornerRadius = utils.getElCustomCssVar(this.DOM.mask, '--mask-corner-radius', true, true);
            this._maskMinWrapperSize = utils.getElCustomCssVar(this.DOM.mask, '--mask-min-wrapper-size', true, true);
        }

        this._initializeGsapAnimations();
        this._initializeVideo();

    },

};


var initialize = function() {
    console.clear();
    scroller && scroller.initialize();
    var gsapVideoScrub01 = Object.assign({}, gsapVideoScrub).initialize({
        selector: '#video_scrub_01',
        isScrubActive: true,
        roundedMask: true,
    });

    if (utils.isTouch()) {
        window.addEventListener('orientationchange', function() {
            utils.nextTick(function() {
                console.log('orientation change');
                ScrollTrigger.refresh();
            }, this, 500);

        });
    }
};

initialize();