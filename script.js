// created for cornerlight vol 4

const bush = document.getElementById('bush');
const myaurrReg = document.getElementById('myaurr-reg');
const all = document.querySelectorAll('.overlay-image');

let isDragging = false;
let currentX, currentY, initialX, initialY;
let xOffset = 0, yOffset = 0;

const isBushIntersecting = () => {
    const bushRect = bush.getBoundingClientRect();
    const regRect = myaurrReg.getBoundingClientRect();
    
    const isIntersecting = !(
        bushRect.right < regRect.left ||
        bushRect.left > regRect.right ||
        bushRect.bottom < regRect.top ||
        bushRect.top > regRect.bottom
    );
    
    // status quo
    if (isIntersecting) {
        myaurrReg.style.display = 'block';
    // world of color! not undo-able
    } else {
        myaurrReg.style.display = 'none';
        all.forEach(img => img.classList.add('color'));
        document.body.classList.add('green-bg');
    }
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

bush.addEventListener('mousedown', dragStart);
bush.addEventListener('touchstart', dragStart);

document.addEventListener('mouseup', dragEnd);
document.addEventListener('mousemove', drag);
document.addEventListener('touchend', dragEnd);
document.addEventListener('touchmove', drag);

bush.style.cursor = 'grab';

