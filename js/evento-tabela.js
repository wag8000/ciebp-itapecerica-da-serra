    const slider = document.getElementById('scroll-wrapper');
    let isDown = false; let startX; let startY; let scrollLeft; let scrollTop;

    slider.addEventListener('mousedown', (e) => {
        isDown = true; slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft; startY = e.pageY - slider.offsetTop;
        scrollLeft = slider.scrollLeft; scrollTop = slider.scrollTop;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
    slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft; const y = e.pageY - slider.offsetTop;
        slider.scrollLeft = scrollLeft - (x - startX);
        slider.scrollTop = scrollTop - (y - startY);
    });
