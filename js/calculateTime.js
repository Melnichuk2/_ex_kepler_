function calculateTimes() {
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || 200;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || 0.5;
    
    const planetName = selectedPlanet;
    const baseScale = getBaseScale(planetName); // Получаем базовый масштаб для выбранной планеты
    const scale = 10 * baseScale;

    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;

    const focusX = cx + semiMajorAxis * eccentricity * scale;

    const times = []; // Массив для хранения времени каждого сектора
    const gravitationalConstant = 1; // Гравитационная постоянная (условное значение)
    const massSun = 1; // Масса Солнца (условное значение)

    // Общая площадь эллипса
    const totalArea = Math.PI * orbitRadiusX * orbitRadiusY;

    for (let i = 0; i < sectorCount; i++) {
        const startAngle = (i * 2 * Math.PI) / sectorCount;
        const endAngle = ((i + 1) * 2 * Math.PI) / sectorCount;

        // Рассчитываем площадь сектора с помощью численного интегрирования
        const sectorArea = calculateSectorArea(orbitRadiusX, orbitRadiusY, startAngle, endAngle);

        // Время пропорционально площади сектора
        const orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / (gravitationalConstant * massSun)); // Период обращения
        const sectorTime = (sectorArea / totalArea) * orbitalPeriod;

        times.push(sectorTime.toFixed(2)); // Округляем время до двух знаков
    }

    // Отображаем результаты в HTML
    const resultsContainer = document.getElementById('sectorTimes');
    resultsContainer.innerHTML = ''; // Очищаем предыдущие результаты
    times.forEach((time, index) => {
        const result = document.createElement('li');
        result.textContent = `Сектор ${index + 1}: ${time} сек.`;
        resultsContainer.appendChild(result);
    });
}

// Функция для вычисления площади сектора эллипса через численное интегрирование
function calculateSectorArea(orbitRadiusX, orbitRadiusY, startAngle, endAngle) {
    const step = 0.001; // Шаг интегрирования
    let area = 0;

    for (let theta = startAngle; theta < endAngle; theta += step) {
        const x = orbitRadiusX * Math.cos(theta);
        const y = orbitRadiusY * Math.sin(theta);
        const nextTheta = theta + step;

        const nextX = orbitRadiusX * Math.cos(nextTheta);
        const nextY = orbitRadiusY * Math.sin(nextTheta);

        // Площадь трапеции между двумя радиусами
        area += 0.5 * Math.abs(x * nextY - nextX * y);
    }

    return area;
}
