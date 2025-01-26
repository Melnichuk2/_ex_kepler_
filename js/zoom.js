let scale = 1.5; // Начальный масштаб

function zoomIn() {
    scale += 0.2; // Увеличение масштаба
    updateOrbit();
}

function zoomOut() {
    scale = Math.max(0.5, scale - 0.2); // Минимальный масштаб — 0.5
    updateOrbit();
}

// Привязать события к кнопкам
document.getElementById('zoomIn').addEventListener('click', zoomIn);
document.getElementById('zoomOut').addEventListener('click', zoomOut);
