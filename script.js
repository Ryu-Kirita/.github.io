// audio / orb / progress 要素
const audios = Array.from(document.querySelectorAll("audio"));
const orbs = Array.from(document.querySelectorAll(".sound-orb"));
let currentAudio = null;

// オーブクリックで再生 / 一時停止
orbs.forEach(orb => {
    orb.addEventListener("click", () => {
        const id = orb.getAttribute("data-audio");
        const audio = document.getElementById(id);
        if (!audio) return;

        // 同じものが再生中なら一時停止
        if (currentAudio === audio && !audio.paused) {
            audio.pause();
            orb.classList.remove("playing");
            return;
        }

        // 他の音を止める
        audios.forEach(a => {
            if (a !== audio) {
                a.pause();
                a.currentTime = 0;
            }
        });
        orbs.forEach(o => o.classList.remove("playing"));

        // 再生
        audio.play();
        currentAudio = audio;
        orb.classList.add("playing");
    });
});

// timeupdate で進捗バー更新 & 再生終了処理
audios.forEach(audio => {
    audio.addEventListener("timeupdate", () => {
        const id = audio.id;
        const fill = document.querySelector(`.sound-progress-fill[data-progress="${id}"]`);
        if (!fill) return;

        const ratio = audio.duration ? (audio.currentTime / audio.duration) : 0;
        fill.style.width = `${ratio * 100}%`;
    });

    audio.addEventListener("ended", () => {
        const id = audio.id;
        const orb = document.querySelector(`.sound-orb[data-audio="${id}"]`);
        const fill = document.querySelector(`.sound-progress-fill[data-progress="${id}"]`);
        if (orb) orb.classList.remove("playing");
        if (fill) fill.style.width = "0%";
        if (currentAudio === audio) currentAudio = null;
    });
});

// 進捗バークリックでシーク
const progressBars = Array.from(document.querySelectorAll(".sound-progress"));

progressBars.forEach(bar => {
    bar.addEventListener("click", (event) => {
        const audioId = bar.getAttribute("data-audio");
        const audio = document.getElementById(audioId);
        if (!audio || !audio.duration) return;

        const rect = bar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);

        audio.currentTime = audio.duration * ratio;

        const fill = document.querySelector(`.sound-progress-fill[data-progress="${audioId}"]`);
        if (fill) {
            fill.style.width = `${ratio * 100}%`;
        }

        // 停止中なら、その位置から再生開始
        if (audio.paused) {
            audios.forEach(a => {
                if (a !== audio) {
                    a.pause();
                    a.currentTime = 0;
                }
            });
            orbs.forEach(o => o.classList.remove("playing"));

            audio.play();
            const orb = document.querySelector(`.sound-orb[data-audio="${audioId}"]`);
            if (orb) orb.classList.add("playing");
            currentAudio = audio;
        }
    });
});

// 画像モーダル
const modal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");

document.querySelectorAll(".photo-wrapper").forEach(wrapper => {
    wrapper.addEventListener("click", () => {
        const img = wrapper.querySelector("img");
        if (!img) return;
        modalImage.src = img.src;
        modal.classList.add("open");
    });
});

// モーダルをクリックで閉じる
modal.addEventListener("click", () => {
    modal.classList.remove("open");
    modalImage.src = "";
});
