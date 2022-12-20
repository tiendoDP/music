const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
var playList = $('.playList')
var playSong = $('.playSong')
var audio = $('#audio')
var nameSong = $('.nameSong')
var cdSong = $('.cdSong img')
var btnPlay = $('.btnPlay')
var btnPause = $('.btnPause')
var rangeSong = $('#rangeSong')
var nextSong = $('.nextSong')
var backSong = $('.backSong')
var randomSong = $('.randomSong')
var rePlay = $('.rePlay')


const app = {
    currentIndex: 0,
    isRePlay: 0,
    isPlaying: false,
    fakeSongs: [],
    isRandom: false,
    activetoSong: [],
    songs: [
        {
            name: 'Nếu em còn tồn tại',
            singer: 'Trịnh Đình Quang',
            path: './asset/music/song1.mp3',
            image: './asset/img/song1.jpg'
        },
        {
            name: 'Waiting for you',
            singer: 'Mono',
            path: './asset/music/song2.mp3',
            image: './asset/img/song2.jpg'
        },
        {
            name: 'Đừng ai nhắc về cô ấy',
            singer: 'Quân AP',
            path: './asset/music/song3.mp3',
            image: './asset/img/song3.jpg'
        },
        {
            name: 'Không gì có thể thay thế em',
            singer: 'Đạt G',
            path: './asset/music/song4.mp3',
            image: './asset/img/song4.jpg'
        },
        {
            name: 'Cao ốc 20',
            singer: 'BRay, Đạt G',
            path: './asset/music/song5.mp3',
            image: './asset/img/song5.jpg'
        },
        {
            name: 'Em phải quên anh',
            singer: 'Châu Khải Phong',
            path: './asset/music/song6.mp3',
            image: './asset/img/song6.jpg'
        },
        {
            name: 'Đừng mong anh sẽ chúc em hạnh phúc',
            singer: 'Khải Đăng',
            path: './asset/music/song7.mp3',
            image: './asset/img/song7.jpg'
        },
        {
            name: 'Ngày mai em đi mất',
            singer: 'Khải Đăng, Đạt G',
            path: './asset/music/song8.mp3',
            image: './asset/img/song8.jpg'
        },
        {
            name: 'Xin',
            singer: 'Đạt G, B Ray, Masew',
            path: './asset/music/song9.mp3',
            image: './asset/img/song9.jpg'
        },
        {
            name: 'Âm thầm bên em',
            singer: 'Sơn Tùng MTP',
            path: './asset/music/song10.mp3',
            image: './asset/img/song10.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
                <div class="song">
                <div class="avatar">
                    <img src="${song.image}" alt="">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class = "fa-solid fa-ellipsis"> </i>
                </div>
                </div>
                `
        })
        playList.innerHTML = htmls.join(" ");
        var song = $$('.song')
        this.activetoSong = song
        this.activetoSong[0].classList.add('active')
    },
    getCurrentSong: function () {
        return this.songs[this.currentIndex]
    },
    loadCurrentSong: function() {
        var currentSong = this.getCurrentSong()
        nameSong.textContent = currentSong.name;
        cdSong.src = currentSong.image;
        audio.src = currentSong.path;
    },
    handleEvents: function () {
        playSong.onclick = function () {
            if(app.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        const cdRotate = cdSong.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdRotate.pause()

        audio.onplay = function () {
            app.isPlaying = true;
            btnPause.classList.remove('none');
            btnPlay.classList.add('none');
            cdRotate.play()
        } 
        audio.onpause = function () {
            app.isPlaying = false;
            btnPause.classList.add('none');
            btnPlay.classList.remove('none');
            cdRotate.pause()
        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                var currentPersent = Math.floor(audio.currentTime / audio.duration * 100)
                rangeSong.value = currentPersent
            }
        }
        audio.onended = function() {
            if(app.isRePlay) {
                //currentPersent = 0;
                audio.play()
            } else {
                if(app.isRandom){
                    app.randomToSong()
                }
                else app.nextToSong()
                audio.play()
            }
        }
        rePlay.onclick = function () {
            app.isRePlay = !app.isRePlay
            rePlay.classList.toggle('colorRed', app.isRePlay)
        }
        rangeSong.onchange = function () {
            audio.currentTime = rangeSong.value / 100 * audio.duration
        }

        nextSong.onclick = function() {
            if(app.isRandom) {
                app.randomToSong()
            } else {
                app.nextToSong();
            }
            audio.play();
        }
        backSong.onclick = function() {
            if(app.isRandom) {
                app.randomToSong()
            } else {
                app.backToSong()
            }
            audio.play();
        }
        randomSong.onclick = function() {
            app.isRandom = !app.isRandom
            randomSong.classList.toggle('colorRed',app.isRandom)
        }
    },
    nextToSong: function() {
        this.currentIndex++;
        if(app.currentIndex >= app.songs.length) app.currentIndex = 0
        this.loadCurrentSong();
        this.activeSong();
        this.scrollToActiveSong()
    },
    backToSong: function() {
        this.currentIndex--;
        if(app.currentIndex < 0) app.currentIndex = app.songs.length - 1;
        this.loadCurrentSong();
        this.activeSong();
        this.scrollToActiveSong()
    },
    randomToSong: function() {
        var firstIndex = 0;
        var getIdSong = this.fakeSongs;
        do {
            var randomNumber = Math.floor(Math.random() * this.songs.length)
            var d = 0;
            
            if(getIdSong.length === 0) {
                getIdSong = this.songs.map(function() {
                    return firstIndex++;
                })
                this.fakeSongs = getIdSong;
            }
            for(var i = 0; i< getIdSong.length; i++) {
                if(randomNumber !== getIdSong[i]) d++;
                else {
                    var a = getIdSong[i];
                    this.fakeSongs = getIdSong.filter(function(idSong) {
                        return idSong !== a;
                    })
                    break;
                }
            } 
        }while(d == getIdSong.length || this.currentIndex == randomNumber);
        this.currentIndex = randomNumber;
        this.activeSong();
        this.scrollToActiveSong()
        this.loadCurrentSong();
    },
    activeSong: function() {
        this.activetoSong.forEach(function(value, index) {
            if(index == app.currentIndex) {
                value.classList.add('active')
            }
            else value.classList.remove('active')
        })
    },
    clickSong: function() {
        this.activetoSong.forEach((value, index) => {
            value.onclick = function () {
                app.currentIndex = index
                app.loadCurrentSong()
                app.activeSong()
                app.scrollToActiveSong()
                audio.play()
            }
        })
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            })
        }, 100)
    },
    intro: function() {
        const text = 'Xin chào mọi người '
        var admin__title = document.querySelector('.admin__title')
        for(let i = 0; i< text.length; i++){
            var span = document.createElement('span')
            span.textContent = text[i]
            span.style.fontSize = '0px'
            admin__title.appendChild(span)
        }

        var listSpan = document.querySelectorAll('.admin__title span')
        var index = 0
        setInterval(() => {
            listSpan[index].style.fontSize = '16px'
            console.log(index, text.length)
            index++;
            if(index === text.length) {
                index = 0
                for(let i =0; i < listSpan.length; i++) {
                    listSpan[i].style.fontSize = '0px'
                }
            }
        }, 300)
    },
    start: function () {
        this.render();
        this.handleEvents();
        this.loadCurrentSong();
        this.clickSong();
        this.intro();
    }
}

app.start();
