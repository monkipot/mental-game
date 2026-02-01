type Operation = {
    question: string;
    answer: number;
}

let score = 0,
    currentOperation: Operation | null = null,
    timer = 10,
    timerInterval: number | null = null;

const timerElement = document.getElementById('timer') as HTMLElement,
    questionElement = document.getElementById('question') as HTMLElement,
    scoreElement = document.getElementById('score') as HTMLElement,
    inputDisplayElement = document.getElementById('input-display') as HTMLElement;

const generateOperation = (): Operation => {
    let operators: string[],
        leftOperand: number,
        rightOperand: number,
        answer: number;

    if (score < 3) {
        operators = ['+'];
    } else if (score < 10) {
        operators = ['+', '-'];
    } else if (score < 25) {
        operators = ['+', '-', '×'];
    } else {
        operators = ['+', '-', '×', '÷'];
    }

    const operator = operators[Math.floor(Math.random() * operators.length)];

    switch (operator) {
        case '+':
            if (score > 50) {
                leftOperand = Math.floor(Math.random() * 900) + 100;
                rightOperand = Math.floor(Math.random() * 900) + 100;
            } else {
                leftOperand = Math.floor(Math.random() * 50) + 1;
                rightOperand = Math.floor(Math.random() * 50) + 1;
            }
            answer = leftOperand + rightOperand;
            break;
        case '-':
            if (score > 50) {
                leftOperand = Math.floor(Math.random() * 900) + 100;
                rightOperand = Math.floor(Math.random() * leftOperand);
            } else {
                leftOperand = Math.floor(Math.random() * 50) + 10;
                rightOperand = Math.floor(Math.random() * leftOperand);
            }
            answer = leftOperand - rightOperand;
            break;
        case '×':
            if (score > 75) {
                leftOperand = Math.floor(Math.random() * 100) + 1;
                rightOperand = Math.floor(Math.random() * 100) + 1;
            } else {
                leftOperand = Math.floor(Math.random() * 12) + 1;
                rightOperand = Math.floor(Math.random() * 12) + 1;
            }
            answer = leftOperand * rightOperand;
            break;
        case '÷':
            if (score > 75) {
                rightOperand = Math.floor(Math.random() * 100) + 1;
                answer = Math.floor(Math.random() * 100) + 1;
            } else {
                rightOperand = Math.floor(Math.random() * 12) + 1;
                answer = Math.floor(Math.random() * 12) + 1;
            }
            leftOperand = rightOperand * answer;
            break;
        default:
            leftOperand = 0;
            rightOperand = 0;
            answer = 0;
    }

    return {
        question: `${leftOperand} ${operator} ${rightOperand}`,
        answer
    };
}

const updateTimerDisplay = (): void => {
    timerElement.textContent = timer.toString();

    if (timer <= 3) {
        timerElement.classList.add('danger');
    } else {
        timerElement.classList.remove('danger');
    }
}

const addTime = (seconds: number): void => {
    timer += seconds;
    updateTimerDisplay();
}

const startTimer = (): void => {
    updateTimerDisplay();

    if (timerInterval !== null) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();

        if (timer <= 0) {
            if (timerInterval !== null) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            alert(`Temps écoulé! Score final: ${score}`);
            resetGame();
        }
    }, 1000);
}

const resetGame = (): void => {
    score = 0;
    timer = 10;
    currentOperation = null;
    updateScoreDisplay();
    newQuestion();
    startTimer();
}

const updateScoreDisplay = (): void => {
    scoreElement.textContent = 'Score: ' + score.toString();
}

const newQuestion = (): void => {
    currentOperation = generateOperation();
    questionElement.textContent = currentOperation.question;
}

const verifyAnswer = (answer: number): void => {
    if (!currentOperation) return;

    if (answer === currentOperation.answer) {
        score++;
        addTime(score < 25 ? 2 : 3);
        updateScoreDisplay();
        newQuestion();
    }

    currentInput = '';
    inputDisplayElement.textContent = '';
}

let currentInput = '';

document.querySelectorAll('.numpad button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value === 'C') {
            currentInput = '';
        } else if (value === 'OK') {
            if (currentInput) {
                verifyAnswer(parseInt(currentInput));
                currentInput = '';
            }
        } else {
            if (currentInput.length < 5) {
                currentInput += value;
            }
        }

        inputDisplayElement.textContent = currentInput;
    });
});

newQuestion();
startTimer();
