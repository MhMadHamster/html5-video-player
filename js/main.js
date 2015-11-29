$(document).ready(function() {

    Number.prototype.lead0 = function(n) {
        var nz = "" + this;
        while (nz.length < n) {
            nz = "0" + nz;
        }
        return nz;
    };

    var controls = {
        video: $('.custom-video'),
        playPause: $('.play-pause'),
        fullscreen: $('.fullscreen'),
        total: $('.total'),
        buffered: $('.buffered'),
        progress: $('.progress .current'),
        duration: $('.duration'),
        currentTime: $('.time > .current'),
        hasHours: false,
        volumeBar: $('.volume-bar'),
        volumeCurrent: $('.volume-bar > .current'),
        volumeSpeaker: $('.volume > svg'),

        // toggle play/pause
        togglePause: function() {
            (video.paused) ? video.play() : video.pause();
        },

        // toggle Fullscreen mode
        toggleFullscreen: function() {
            if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
                if (this.video[0].requestFullscreen) {
                  this.video[0].requestFullscreen();
                } else if (this.video[0].msRequestFullscreen) {
                  this.video[0].msRequestFullscreen();
                } else if (this.video[0].mozRequestFullScreen) {
                  this.video[0].mozRequestFullScreen();
                } else if (this.video[0].webkitRequestFullscreen) {
                  this.video[0].webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                  document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                  document.webkitExitFullscreen();
                }
            }
        },

        // set video volume based on value
        setVolume: function(value) {
            if (value >= 0 && value <= 1) {
                video.volume = value;
            } else {
                video.volume = (value < 0) ? 0 : 1
            }
        },

        // mute/unmute video
        toggleMute: function() {
            if (video.muted) {
                video.muted = false;
            } else {
                video.muted = true;
            }
            $('.volume').toggleClass('muted');
        }
    }

    var video = controls.video[0];

    // play/pause handlers
        controls.playPause.click(function() {
            controls.togglePause();
        });

        video.addEventListener('ended', function() {
            video.pause();
        });

        video.addEventListener('play', function() {
            controls.playPause.toggleClass('paused');
        });

        video.addEventListener('pause', function() {
            controls.playPause.toggleClass('paused');
        });

        controls.video.click(function() {
            controls.togglePause();
        });

    // fullscreen handlers
        controls.fullscreen.click(function() {
            controls.toggleFullscreen();
        });

        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
                controls.toggleFullscreen();
            }
        }, false);

    // progress time handlers
        if (video.readyState >= video.HAVE_FUTURE_DATA) {
            controls.hasHours = (video.duration / 3600) >= 1.0;
            controls.duration.text(formatTime(video.duration, controls.hasHours));
            controls.currentTime.text(formatTime(0),controls.hasHours);
        } else {
            video.addEventListener('canplay', function () {
                controls.hasHours = (video.duration / 3600) >= 1.0;
                controls.duration.text(formatTime(video.duration, controls.hasHours));
                controls.currentTime.text(formatTime(0),controls.hasHours)
            }, false);
        }

        video.addEventListener('timeupdate', function() {
            controls.currentTime.text(formatTime(video.currentTime, controls.hasHours));

            var progress = Math.floor(video.currentTime) / Math.floor(video.duration);
            controls.progress.css('width', Math.floor(progress * controls.total.width()) + 'px');
        }, false);

        controls.total.click(function(e) {
            var x = (e.pageX - this.offsetLeft)/$(this).width();
            video.currentTime = x * video.duration;
        });

        video.addEventListener('progress', function() {
            if (video.readyState === 4) {
                var buffered = Math.floor(video.buffered.end(0)) / Math.floor(video.duration);
                controls.buffered.css('width', Math.floor(buffered * controls.total.width()) + 'px');
            };
        }, false);

    // volume handlers
        controls.volumeBar.click(function(e) {
            var x = (e.pageX - $(this).offset().left) / $(this).width();
            controls.setVolume(x);
            controls.volumeCurrent.css('width', e.pageX - $(this).offset().left + 'px');
        });

        controls.volumeSpeaker.click(function() {
            controls.toggleMute();
        });


    function formatTime(time, hours) {
        if (hours) {
            var h = Math.floor(time / 3600);
            time = time - h * 3600;
                        
            var m = Math.floor(time / 60);
            var s = Math.floor(time % 60);

            return h.lead0(2)  + ":" + m.lead0(2) + ":" + s.lead0(2);
        } else {
            var m = Math.floor(time / 60);
            var s = Math.floor(time % 60);

            return m.lead0(2) + ":" + s.lead0(2);
        }
    };

});