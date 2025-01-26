let showLines = false; // Флаг для отображения соединительных линий

// Функция для отображения соединительных линий и точки эпицентра
function drawLinesAndFocus(semiMajorAxis, eccentricity, angle) {
    if (!showLines) return;

    const scale = 1.5;
    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;
    const focusX = cx + semiMajorAxis * eccentricity * scale;

    // Положение планеты на орбите
    const planetX = cx + orbitRadiusX * Math.cos(angle);
    const planetY = cy + orbitRadiusY * Math.sin(angle);

    // Линия от Солнца к планете
    ctx.beginPath();
    ctx.moveTo(focusX, cy); // Солнце
    ctx.lineTo(planetX, planetY); // Планета
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Положение зеркальной точки (крестика)
    const oppositeFocusX = cx - semiMajorAxis * eccentricity * scale; // Зеркальная точка по отношению к Солнцу
    const ellipsePointX = oppositeFocusX;
    const ellipsePointY = cy;

    // Линия от планеты к зеркальной точке
    ctx.beginPath();
    ctx.moveTo(planetX, planetY);
    ctx.lineTo(ellipsePointX, ellipsePointY);
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Рисуем точку эпицентра (крестик)
    const crossSize = 8;
    ctx.beginPath();
    ctx.moveTo(ellipsePointX - crossSize, ellipsePointY - crossSize);
    ctx.lineTo(ellipsePointX + crossSize, ellipsePointY + crossSize);
    ctx.moveTo(ellipsePointX - crossSize, ellipsePointY + crossSize);
    ctx.lineTo(ellipsePointX + crossSize, ellipsePointY - crossSize);
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Слушатель для чекбокса отображения линий
document.getElementById('showLines').addEventListener('change', (e) => {
    showLines = e.target.checked;
    updateOrbit(); // Перерисовываем орбиту с учётом состояния чекбокса
});
