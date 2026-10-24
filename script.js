// 自分で用意した画像ファイルのパス
const PUMPKIN_IMAGE_URL = 'pumpkin.png';
const GHOST_IMAGE_URL = 'ghost.png';

// 15の倍数で使うお菓子画像の配列
const CANDY_IMAGES = ['candy1.png', 'candy2.png', 'choco.png', 'lolli.png'];

const btnStart = document.getElementById('btn-start');
const displayWindow = document.getElementById('display-window');
const numberText = document.getElementById('number-text');
const imgContainer = document.getElementById('illustration-container');

const INTERVAL_TIME = 1200; // 次のカウントに移るまでの間隔（1.2秒）

let count = 0;

// ボタンのクリックイベント（完全にスタート専用）
btnStart.addEventListener('click', () => {
    startSequence();
});

// シークエンスの開始
function startSequence() {
    count = 0;

    // 🌟クリックされたら、ボタンを画面から完全に消し去ります
    const controlsArea = document.querySelector('.controls');
    if (controlsArea) {
        controlsArea.style.display = 'none';
    }

    // ステージウィンドウを表示する
    displayWindow.style.display = 'flex';
    numberText.textContent = '';
    imgContainer.innerHTML = '';

    // カウントループの開始
    tick();
}

// カウントアップのコアロジック
function tick() {
    count++;

    // 画面に残っている文字と画像を完全に消し去る
    numberText.textContent = '';
    imgContainer.innerHTML = '';

    const isFizz = count % 3 === 0;
    const isBuzz = count % 5 === 0;

    // 条件判定（倍数の時は最初から数字を絶対に出さない）
    if (isFizz && isBuzz) {
        // 【15の倍数：ラスト！】数字は見せず、4種のお菓子を一斉に吹き荒れさせる
        triggerCandyStorm();

        // 🌟「ほぼ同時」に文字を出現
        setTimeout(showFinalMessage, 600);
        return; // 15が最終回なので、ここで処理を完全に終了させて次のタイマー(setTimeout)を動かしません
    } else if (isFizz) {
        // 【3の倍数】数字は見せず、中央にカボチャをふわ〜んと出す
        spawnCreature(PUMPKIN_IMAGE_URL, 'pumpkin-fizz');
    } else if (isBuzz) {
        // 【5の倍数】数字は見せず、中央にゴーストをふわ〜んと出す
        spawnCreature(GHOST_IMAGE_URL, 'ghost-buzz');
    } else {
        // 【通常時】3, 5, 15の倍数以外の時だけ数字をセット
        numberText.textContent = count;
    }

    // 次のカウントをスケジュール（15の時は上の return で抜けるため、ここは14番目までしか実行されません）
    setTimeout(tick, INTERVAL_TIME);
}




// カボチャ(3)・ゴースト(5)を生成する共通関数
function spawnCreature(imageSrc, className) {
    const img = document.createElement('div');
    img.className = `halloween-img ${className}`;
    img.style.backgroundImage = `url(${imageSrc})`;
    imgContainer.appendChild(img);
}

// 4種類のお菓子(15)を大増量でランダムに吹き荒れさせる関数
function triggerCandyStorm() {
    const candyCount = 100; // 吹き荒れるお菓子の総数

    for (let i = 0; i < candyCount; i++) {
        const img = document.createElement('div');
        img.className = 'storm-candy';

        // 4種類のお菓子画像からランダムに1つを選ぶ
        const randomCandyImg = CANDY_IMAGES[Math.floor(Math.random() * CANDY_IMAGES.length)];
        img.style.backgroundImage = `url(${randomCandyImg})`;

        // お菓子のランダムサイズ（80px 〜 180px）
        const size = Math.floor(Math.random() * 100) + 80;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;

        // 飛び散る先のランダムな座標（ウィンドウサイズ基準で広がるように計算）
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.floor(Math.random() * 60) + 35;
        const targetX = `calc(50% + ${Math.cos(angle) * distance}vw)`;
        const targetY = `calc(50% + ${Math.sin(angle) * distance}vh)`;

        // ランダムな倍率と傾き
        const scale = (Math.random() * 1.5 + 0.8).toFixed(1);
        const rotate = Math.floor(Math.random() * 360) - 180;

        // アニメーション用のカスタムプロパティをCSSに引き渡す
        img.style.setProperty('--target-x', targetX);
        img.style.setProperty('--target-y', targetY);
        img.style.setProperty('--target-scale', scale);
        img.style.setProperty('--target-rotate', `${rotate}deg`);


        imgContainer.appendChild(img);
    }
}

// 終了メッセージ
function showFinalMessage() {
    numberText.textContent = '';

    const finishDiv = document.createElement('div');
    finishDiv.className = 'finish-message';
    finishDiv.textContent = 'Happy Halloween!';

    // innerHTML = ... をやめて appendChild にすることで、お菓子を消さずに文字だけを画面中央に重ねて出現させます
    imgContainer.appendChild(finishDiv);
}


// BGM設定

const bgm = document.getElementById('bgm');

const bgmVolume = 0.3;    // 音量40%
const playDuration = 22;  // 再生時間
const fadeDuration = 3;  // 最後の3秒でフェードアウト

bgm.volume = bgmVolume;

document.getElementById('btn-start').addEventListener('click', () => {
    bgm.currentTime = 0;
    bgm.volume = bgmVolume;
    bgm.play();

    const fadeStart = playDuration - fadeDuration;

    const fadeTimer = setInterval(() => {
        const elapsed = bgm.currentTime;

        if (elapsed >= fadeStart) {
            bgm.volume = bgmVolume *
                Math.max(0, (playDuration - elapsed) / fadeDuration);
        }

        if (elapsed >= playDuration || bgm.ended) {
            clearInterval(fadeTimer);
            bgm.pause();
            bgm.currentTime = 0;
            bgm.volume = bgmVolume;
        }
    }, 50);
});
