let timer = 10,
    timerInterval: number | null = null;

const timerElement = document.getElementById('timer') as HTMLElement;

const updateTimerDisplay = (): void => {
    timerElement.textContent = timer.toString();

    if (timer <= 3) {
        timerElement.classList.add('danger');
    }
}

const startTimer = (): void => {
    timerElement.classList.remove('danger');
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
            alert('Temps écoulé!');
        }
    }, 1000);
}

startTimer();
