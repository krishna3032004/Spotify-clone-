console.log("let's write some javascript")
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbum() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    console.log(array)
    let cardContainer = document.querySelector(".cardContainer")
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            console.log(folder)
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        fill="#000000" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                </svg>

            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <p>${response.discription}</p>
        </div>`
        }

    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            document.querySelector(".left").style.left = "0%"
            Playmusic(songs[0])
            play.src = "img/pause.svg"
        })
    })
}

async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response1 = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response1
    let as = div.getElementsByTagName("a")
    // console.log(as)
    let b = await fetch(`/${folder}/info.json`)
    let response = await b.json();
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].replaceAll("%20", " "))
        }
    }
    document.querySelector(".playbar").style.display = "block"
    document.querySelector(".playbar").style.opacity = "1"
    document.querySelector(".playbar").style.bottom = "0px"
    console.log(songs)

    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
        <img width="34" src="/${folder}/cover.jpg" alt="">
        <div class="info">
            <div style="font-size:13px">${song}</div>
            <div style="font-size:14px;color: #7a7a7a;">${response.title}</div>
        </div>
    </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            Playmusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML)
            console.log(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML)
            // console.log(songs[2])
            play.src = "img/pause.svg"
        })
    });
}

const Playmusic = (song) => {
    currentsong.src = `/${currFolder}/` + song
    currentsong.play()
    let index = songs.indexOf(song)
    for (let index1 = 0; index1 < songs.length; index1++) {
        if (index1 != index) {
            document.querySelector(".songList").getElementsByTagName("li")[index1].style.backgroundColor = "#" + "121212"
        }

    }
    document.querySelector(".songList").getElementsByTagName("li")[index].style.backgroundColor = "#1e0404"
    document.querySelector(".songinfo").innerHTML = song
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function main() {
    // await getsongs("songs/arijit")
    // Playmusic(songs[0])
    console.log(songs)


    await displayAlbum()

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            if (currentsong.src == "") {
                console.log("heeloo mr what going on")
                Playmusic(songs[0])
                play.src = "img/pause.svg"
            }
            else {
                currentsong.play()
                play.src = "img/pause.svg"
            }
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })


    previous.addEventListener("click", () => {
        play.src = "img/pause.svg"
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0].replaceAll("%20", " "))
        console.log(index)
        if ((index - 1) >= 0) {
            Playmusic(songs[index - 1])
        }
        else {
            Playmusic(songs[songs.length - 1])
        }
    })
    next.addEventListener("click", () => {
        play.src = "img/pause.svg"
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0].replaceAll("%20", " "))
        console.log(index)
        if ((index + 1) <= songs.length-1) {
            Playmusic(songs[index + 1])
        }
        else {
            Playmusic(songs[0])
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        document.querySelector(".playingbar").style.width = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        if (document.querySelector(".circle").style.left == "100%") {
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0].replaceAll("%20", " "))
            document.querySelector(".circle").style.left = "0%"
            console.log(index)
            if ((index + 1) <= 9) {
                Playmusic(songs[index + 1])
            }
        }
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let x = e.clientX;
        let y = document.querySelector(".seekbar")
        let left = Math.round(y.getBoundingClientRect().left)
        let right = Math.round(y.getBoundingClientRect().right)
        let percent = ((x-left) / (right-left)) * 100
        document.querySelector(".circle").style.left = percent + "%"
        document.querySelector(".playingbar").style.width = percent + "%"
        currentsong.currentTime = (currentsong.duration) * percent / 100
    })

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(parseInt(e.target.value) / 100)
        currentsong.volume = parseInt(e.target.value) / 100
    })

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0%"
    })
    document.querySelector(".cancel").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-130%"
    })



}

main()