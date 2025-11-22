// すべての <audio> 要素を取得
const audios = Array.from(document.querySelectorAll("audio"));
const orbs = Array.from(document.querySelectorAll(".sound-orb"));
const progressFills = Array.from(document.querySelectorAll(".sound-progress-fill"));

// 再生中の audio を管理
let currentAudio = null;

// オーブクリックで再生/停止
orbs.forEach(orb => {
    orb.addEventListener("click", () => {
        const id = orb.getAttribute("data-audio");
        const audio = document.getElementById(id);

        // すでにこの audio が再生中なら停止
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

        // 再生開始
        audio.play();
        currentAudio = audio;
        orb.classList.add("playing");
    });
});

// 時間更新でプログレスバーを進める
audios.forEach(audio => {
    audio.addEventListener("timeupdate", () => {
        const id = audio.id;
        const fill = document.querySelector(`.sound-progress-fill[data-progress="${id}"]`);
        if (!fill) return;

        const ratio = audio.duration ? (audio.currentTime / audio.duration) : 0;
        fill.style.width = `${ratio * 100}%`;

        // 再生完了時はアニメーションを止めておく
        if (audio.ended) {
            const orb = document.querySelector(`.sound-orb[data-audio="${id}"]`);
            if (orb) orb.classList.remove("playing");
        }
    });
});

// 画像クリックでモーダル表示
const modal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const backdrop = modal.querySelector(".image-modal-backdrop");

document.querySelectorAll(".photo-wrapper").forEach(wrapper => {
    wrapper.addEventListener("click", () => {
        const img = wrapper.querySelector("img");
        modalImage.src = img.src;
        modal.classList.add("open");
    });
});

// モーダル閉じる（背景クリックまたは画像クリック）
modal.addEventListener("click", () => {
    modal.classList.remove("open");
    modalImage.src = "";
});

// 背景と画像以外へのクリックを拾わないようにする
modalImage.addEventListener("click", (e) => {
    e.stopPropagation();
});
