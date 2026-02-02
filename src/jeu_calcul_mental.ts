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

    const operator = operators[Math.floor(Math.random() * operators.length)],
        difficulty = Math.min(score, 100);

    switch (operator) {
        case '+':
            leftOperand = Math.floor(Math.random() * (difficulty * 5 + 10)) + 1;
            rightOperand = Math.floor(Math.random() * (difficulty * 5 + 10)) + 1;
            answer = leftOperand + rightOperand;
            break;
        case '-':
            leftOperand = Math.floor(Math.random() * (difficulty * 5 + 20)) + 10;
            rightOperand = Math.floor(Math.random() * leftOperand);
            answer = leftOperand - rightOperand;
            break;
        case '×':
            leftOperand = Math.min(Math.floor(Math.random() * (Math.floor(difficulty / 2) + 10)) + 1, 999);
            rightOperand = Math.min(Math.floor(Math.random() * (Math.floor(difficulty / 3) + 10)) + 1, 99);
            answer = leftOperand * rightOperand;
            break;
        case '÷':
            rightOperand = Math.min(Math.floor(Math.random() * (Math.floor(difficulty / 2) + 10)) + 1, 99);
            answer = Math.min(Math.floor(Math.random() * (Math.floor(difficulty / 2) + 10)) + 1, 999);
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
    currentInput = '';
    inputDisplayElement.textContent = '';
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
        addTime(2);
        updateScoreDisplay();
        newQuestion();
        currentInput = '';
        inputDisplayElement.textContent = '';
    }
}

let currentInput = '';

document.querySelectorAll('.numpad button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value === 'C') {
            currentInput = '';
        } else if (currentInput.length < 5) {
            currentInput += value;
            verifyAnswer(parseInt(currentInput));
        }

        inputDisplayElement.textContent = currentInput;
    });
});

newQuestion();
startTimer();
