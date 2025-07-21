// Класс для отображения результатов
class ResultsDisplay {
    constructor() {
        this.element = document.createElement('div');
        this.applyStyles();
        document.body.appendChild(this.element);
        this.visible = false;
        this.hide();
    }

    applyStyles() {
        const style = this.element.style;
        style.position = 'fixed';
        style.top = '0';
        style.left = '0';
        style.right = '0';
        style.bottom = '0';
        style.backgroundColor = 'rgba(255,255,255,0.95)';
        style.padding = '20px';
        style.border = 'none';
        style.boxShadow = 'none';
        style.maxHeight = 'none';
        style.overflowY = 'auto';
        style.display = 'none';
        style.zIndex = '1000';
        
        // Центрирование содержимого
        style.display = 'flex';
        style.flexDirection = 'column';
        style.alignItems = 'center';
        style.justifyContent = 'flex-start';
    }

    show(results) {
        if (results.length > 0) {
            let html = '<div style="width: 100%; max-width: 800px;">';
            html += '<h2 style="text-align: center; margin-bottom: 20px;">Результаты</h2>';
            
            results.forEach((stage, index) => {
                html += `
                    <div style="margin-bottom: 20px; padding-bottom: 15px;">
                        <h3 style="text-align: center; margin-bottom: 10px;">Этап ${index + 1}</h3>
                        <p style="text-align: center;">Желтые: ${stage.rightCount}</p>
                        <p style="text-align: center;">Красные: ${stage.leftCount}</p>
                    </div>
                `;
            });
            
            html += '</div>';
            this.element.innerHTML = html;
        } else {
            this.element.innerHTML = '<p style="text-align: center;">Нет сохраненных результатов</p>';
        }
        
        this.element.style.display = 'flex';
        this.visible = true;
    }

    hide() {
        this.element.style.display = 'none';
        this.visible = false;
    }

    toggle(results) {
        if (this.visible) {
            this.hide();
        } else {
            this.show(results);
        }
    }
}

function mobile() {
    const circle = document.getElementById('circle');
    let leftArrowPressed = false;
    let rightArrowPressed = false;
    let leftArrowCount = 0;
    let rightArrowCount = 0;
    let resultsVisible = false;
    let resultsArray = []; // Массив для хранения всех этапов
    let inactivityTimer; // Таймер для отслеживания бездействия

    // Создаем экземпляр класса для отображения результатов
    const resultsDisplay = new ResultsDisplay();

    // Функция для сброса таймера бездействия
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(saveResults, 8000); // 8 секунд бездействия
    }

    // Функция для сохранения текущих результатов в массив
    function saveResults() {
        // Не сохраняем, если отображаются результаты или если оба счетчика нулевые
        if (resultsVisible || (leftArrowCount === 0 && rightArrowCount === 0)) {
            return;
        }
        
        const results = {
            leftCount: leftArrowCount,
            rightCount: rightArrowCount
        };
        
        resultsArray.push(results); // Добавляем текущий этап в массив
        
        // Сбрасываем счетчики для следующего этапа
        leftArrowCount = 0;
        rightArrowCount = 0;
        
        console.log('Results saved to array:', results);
        console.log('All results:', resultsArray);
        
        // Перезапускаем таймер
        resetInactivityTimer();
    }

    // Функция для отображения/скрытия результатов
    function toggleResults() {
        if (resultsVisible) {
            // Скрываем результаты и показываем кружок
            resultsDisplay.hide();
            circle.style.display = 'block';
            resultsVisible = false;
            
            resultsArray = []; // Обнуляем массив
            // Сбрасываем счетчики для следующего этапа
            leftArrowCount = 0;
            rightArrowCount = 0;
            
            // Перезапускаем таймер
            resetInactivityTimer();
        } else {
            // Показываем результаты и скрываем кружок
            resultsDisplay.show(resultsArray);
            circle.style.display = 'none';
            resultsVisible = true;
            
            // Останавливаем таймер, так как просматриваем результаты
            clearTimeout(inactivityTimer);
        }
    }

    // Обработчики событий клавиатуры
    addEventListener('keydown', function(event) {
        if (event.code === 'Digit7' || event.key === '7') {
            toggleResults();
            return;
        }

        if (resultsVisible) return; // Игнорируем нажатия при отображении результатов
        
        if (event.code === 'ArrowLeft' && !leftArrowPressed) {
            circle.style.background = '#ff0000';
            leftArrowPressed = true;
            leftArrowCount++;
            resetInactivityTimer(); // Сброс таймера при активности
        } else if (event.code === 'ArrowRight' && !rightArrowPressed) {
            circle.style.background = 'yellow';
            rightArrowPressed = true;
            rightArrowCount++;
            resetInactivityTimer(); // Сброс таймера при активности
        }
    });

    addEventListener('keyup', function(event) {
        if (resultsVisible) return; // Игнорируем отпускания при отображении результатов
        
        if (event.code === 'ArrowLeft') {
            circle.style.background = '#6f6f6f';
            leftArrowPressed = false;
            resetInactivityTimer(); // Сброс таймера при активности
        } else if (event.code === 'ArrowRight') {
            circle.style.background = '#6f6f6f';
            rightArrowPressed = false;
            resetInactivityTimer(); // Сброс таймера при активности
        }
    });

    // Запускаем таймер при инициализации
    resetInactivityTimer();
}

// mobile()
// PS()

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    mobile()
} else {
    PS()
}

function PS() {
    // определяем, поддерживается ли pointerLock
    const havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;
    if(!havePointerLock){
        alert('Ваш браузер не поддерживает блокировку мышки');
    }
    
    // Элемент, для которого будем включать pointerLock
    let requestedElement = document.getElementById('parent');
    
    let resultFlag = 1
    
    let circle = new Circle()
    let result = new ResearchResult()
    
    const [redID, yellowID, mouseWheelID] = [0, 2, 1]
    
    function nowResultStage() {
        return resultFlag === 2;
    }
    
    addEventListener('mousedown', function (event) {
        // игнорируем клик мыши если на данный момент на экране результат
        if (nowResultStage())
            return
        // включаем pointerLock
        requestedElement.requestPointerLock();
        // зажигаем круг красным, записываем необходимые данные
        if (event.button === redID) {
            circle.turnRed()
        } else if (event.button === yellowID) { // зажигаем круг желтым, записываем необходимые данные
            circle.turnYellow()
        } else if (event.button === mouseWheelID) { // сохраняем собранные данные, один из этапов исследования завершен
            result.saveStep(circle.getResult())
            result.alert()
            circle = new Circle()
        } else {
            console.log(event.button)
        }
    })
    
    addEventListener('mouseup', function (event) {
        // игнорируем клик мыши если на данный момент на экране результат
        if (nowResultStage())
            return
        if (event.button === redID || event.button === yellowID)
            circle.turnOf()
    })
    
    addEventListener('keydown', function(event) {
        if (event.code === 'Enter' || event.key === 'Enter') { //enterID
            stageSwitch()
        } else if (nowResultStage())
            return
            
        if (event.code === 'Space' || event.key === ' ') {
            result.saveStep(circle.getResult())
            result.alert()
            circle = new Circle()
        } else if (event.code === 'ArrowLeft') {
            circle.turnRed()
        } else if (event.code === 'ArrowRight') {
            circle.turnYellow()
        } else {
            console.log(event.code)
        }
    })
    
    addEventListener('keyup', function(event) {
        if (event.code === 'ArrowLeft' || 'ArrowRight') {
            circle.turnOf()
        } else {
            console.log(event.code)
        }
    })
    
    function stageSwitch() {
        // отключаем pointerLock
        document.exitPointerLock();
    
        // завершаем исследование, выводим результат
        if (resultFlag === 1) {
            resultFlag = 2
    
            result.saveStep(circle.getResult())
            circle = new Circle()
    
            document.getElementById('parent').style.visibility = 'hidden'
    
            document.body.appendChild(result.result)
            document.body.style.backgroundColor = '#fff'
        } else if (resultFlag === 2) { // удаляем контейнер с результатом, начинаем новое исследование
            resultFlag = 1
    
            result.clear()
    
            document.getElementById('parent').style.visibility = 'visible'
            document.body.style.backgroundColor = '#6f6f6f'
        }
    }
}

