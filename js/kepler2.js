let sectorCount = 2; // Количество секторов
const sectorColors = ['#ff0000', '#00ff00', '#0000ff', '#ff7700', '#7700ff', '#00ffff', '#ffff00', '#ff00ff']; // Цвета секторов

function calculateSectorAngles(semiMajorAxis, eccentricity, sectorCount) {
    const angles = [0]; // Начинаем с угла 0
    const totalArea = Math.PI * semiMajorAxis * semiMajorAxis * Math.sqrt(1 - eccentricity ** 2); // Полная площадь эллипса
    const sectorArea = totalArea / sectorCount; // Площадь одного сектора
    const focusX = semiMajorAxis * eccentricity; // Смещение фокуса
    const step = 0.001; // Маленький шаг для интеграции

    let accumulatedArea = 0;
    let currentAngle = 0;

    while (angles.length < sectorCount) {
        const nextAngle = currentAngle + step;
        const x1 = semiMajorAxis * Math.cos(currentAngle) - focusX;
        const y1 = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * Math.sin(currentAngle);
        const x2 = semiMajorAxis * Math.cos(nextAngle) - focusX;
        const y2 = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * Math.sin(nextAngle);

        // Интеграция площади трапеции
        accumulatedArea += Math.abs((x1 * y2 - x2 * y1) / 2);

        if (accumulatedArea >= sectorArea) {
            angles.push(nextAngle); // Добавляем новый угол
            accumulatedArea = 0; // Обнуляем накопленную площадь
        }

        currentAngle = nextAngle;
    }

    angles.push(2 * Math.PI); // Добавляем конечный угол
    return angles;
}
function drawSectors(semiMajorAxis, eccentricity) {
    const angles = calculateSectorAngles(semiMajorAxis, eccentricity, sectorCount); // Вычисляем углы с учетом равных площадей
    const scale = 1.5;
    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;
    const focusX = cx + semiMajorAxis * eccentricity * scale;

    for (let i = 0; i < sectorCount; i++) {
        const startAngle = angles[i];
        const endAngle = angles[i + 1];

        ctx.beginPath();
        ctx.moveTo(focusX, cy); // Начало сектора — фокус орбиты (Солнце)

        for (let theta = startAngle; theta <= endAngle; theta += 0.001) {
            const x = cx + orbitRadiusX * Math.cos(theta);
            const y = cy + orbitRadiusY * Math.sin(theta);
            ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = sectorColors[i % sectorColors.length]; // Цвет сектора
        ctx.globalAlpha = 0.4;
        ctx.fill();
    }
    ctx.globalAlpha = 1; // Восстановление прозрачности
}



function drawOrbit(semiMajorAxis, eccentricity) {
    const scale = 1.5;
    const cx = width / 2;
    const cy = height / 2;
    const focusX = cx + semiMajorAxis * eccentricity * scale;

    // Рисуем эллипс орбиты
    ctx.beginPath();
    ctx.ellipse(cx, cy, semiMajorAxis * scale, semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = '#0077ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем Солнце
    ctx.beginPath();
    ctx.arc(focusX, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.fillText('Sun', focusX + 10, cy);
}

function drawPlanet(semiMajorAxis, eccentricity) {
    const scale = 1.5;
    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;
    const planetX = cx + orbitRadiusX * Math.cos(angle);
    const planetY = cy + orbitRadiusY * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(planetX, planetY, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
}

function updateOrbit() {
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || planets[selectedPlanet].semiMajorAxis;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;

    ctx.clearRect(0, 0, width, height);

    // Рисуем орбиту
    drawOrbit(semiMajorAxis, eccentricity);

    // Рисуем сектора
    drawSectors(semiMajorAxis, eccentricity, angle);

    // Рисуем планету
    drawPlanet(semiMajorAxis, eccentricity);
}

function animate() {
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || planets[selectedPlanet].semiMajorAxis;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;

    const scale = 1.5;
    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;

    const planetX = cx + orbitRadiusX * Math.cos(angle);
    const planetY = cy + orbitRadiusY * Math.sin(angle);

    const focusX = cx + semiMajorAxis * eccentricity * scale;
    const dx = planetX - focusX;
    const dy = planetY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speedFactor = parseFloat(document.getElementById('speedFactor').value) || 1;
    const angularSpeed = speedFactor * 5000 / Math.pow(distance, 1.5);

    angle += angularSpeed * 0.01;

    ctx.clearRect(0, 0, width, height);
    drawOrbit(semiMajorAxis, eccentricity);
    drawSectors(semiMajorAxis, eccentricity, angle); // Добавлено обновление секторов
    drawPlanet(semiMajorAxis, eccentricity);

    animationId = requestAnimationFrame(animate);
}

// Обработчик для изменения количества секторов
document.getElementById('sectorCount').addEventListener('input', (e) => {
    sectorCount = parseInt(e.target.value) || 2;
    updateOrbit();
});

// Запуск анимации при загрузке
document.addEventListener('DOMContentLoaded', () => {
    init();
    updateOrbit();
});
