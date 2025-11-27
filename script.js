// created for cornerlight vol 4

const initBGM = (hiddenId, guyId, onAutoplayBlocked) => {
    const hidden = document.getElementById(hiddenId);
    const guy = document.getElementById(guyId);
    const pendingResume = new Set();
    let showMutedEmoji = false;

    const initLoop = (audio) => {
        audio.loop = true;
        audio.preload = 'auto';
    };

    const resumeOnInteraction = (audio) => {
        if (pendingResume.has(audio)) {
            return;
        }
        pendingResume.add(audio);

        if (!showMutedEmoji && onAutoplayBlocked) {
            onAutoplayBlocked(true);
            showMutedEmoji = true;
        }

        const cleanup = () => {
            document.removeEventListener('pointerdown', attemptPlay);
            document.removeEventListener('keydown', attemptPlay);
            pendingResume.delete(audio);
            if (onAutoplayBlocked) {
                onAutoplayBlocked(false);
            }
        };
        const attemptPlay = () => audio.play().then(cleanup).catch(() => {});

        document.addEventListener('pointerdown', attemptPlay);
        document.addEventListener('keydown', attemptPlay);
    };

    const play = (audio) => {
        const playPromise = audio.play();
        if (playPromise instanceof Promise) {
            playPromise.catch(() => resumeOnInteraction(audio));
        }
    };

    const pause = (audio) => {
        audio.pause();
    };

    const hideMyaurrMusic = () => {
        pause(guy);
        hidden.currentTime = 0;
        play(hidden);
    };

    const revealMyaurrMusic = () => {
        pause(hidden);
        guy.currentTime = 0;
        play(guy);
    };

    const init = () => {
        initLoop(hidden);
        initLoop(guy);
        hideMyaurrMusic();
    };

    return { init, hideMyaurrMusic, revealMyaurrMusic };
};

// activating world of color!
const updateVis = (isIntersecting) => {
    if (isIntersecting) {
        myaurrReg.classList.remove('is-hidden');
        all.forEach((img) => img.classList.remove('color'));
        document.body.classList.remove('green-bg');
    } else {
        myaurrReg.classList.add('is-hidden');
        all.forEach((img) => img.classList.add('color'));
        document.body.classList.add('green-bg');
    }
};

// activating whimsy music!
const updateAudio = (isIntersecting) => {
    if (isIntersecting === bushIsIntersecting) {
        return;
    }

    if (isIntersecting) {
        audioController.hideMyaurrMusic();
    } else {
        audioController.revealMyaurrMusic();
    }
    bushIsIntersecting = isIntersecting;
};

const isBushIntersecting = () => {
    const bushRect = bush.getBoundingClientRect();
    const regRect = myaurrReg.getBoundingClientRect();
    const isIntersecting = !(
        bushRect.right < regRect.left ||
        bushRect.left > regRect.right ||
        bushRect.bottom < regRect.top ||
        bushRect.top > regRect.bottom
    );
    
    updateVis(isIntersecting);
    updateAudio(isIntersecting);
};

const dragStart = (e) => {
    e.preventDefault();
    
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    isDragging = true;
    bush.style.cursor = 'grabbing';
};

const dragEnd = (e) => {
    isDragging = false;
    bush.style.cursor = 'grab';
};

const drag = (e) => {
    if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, bush);
    }
};

const setTranslate = (xPos, yPos, el) => {
    el.style.transform = `translate(calc(-50% + ${xPos}px), calc(-50% + ${yPos}px))`;
    isBushIntersecting();
};

const bush = document.getElementById('bush');
const myaurrReg = document.getElementById('myaurr-reg');
const all = document.querySelectorAll('.overlay');
const mutedIndicator = document.getElementById('muted');

const audioController = initBGM('audio-hidden', 'audio-guy', (isBlocked) => {
    mutedIndicator.classList.toggle('visible', isBlocked);
});

audioController.init();

let isDragging = false;
let currentX, currentY, initialX, initialY;
let xOffset = 0, yOffset = 0;
let bushIsIntersecting = true;

bush.addEventListener('mousedown', dragStart);
bush.addEventListener('touchstart', dragStart);

document.addEventListener('mouseup', dragEnd);
document.addEventListener('mousemove', drag);
document.addEventListener('touchend', dragEnd);
document.addEventListener('touchmove', drag);

bush.style.cursor = 'grab';
isBushIntersecting();