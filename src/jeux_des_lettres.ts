enum LEVEL {
    EASY = 'Simple',
    MIDDLE = 'Moyen',
    HARD = 'Difficile',
    EXPERT = 'EXPERT'
}

const getDifficultyFile = (level: LEVEL): string => {
    switch (level) {
        case LEVEL.EASY:
            return '/words_easy.txt';
        case LEVEL.MIDDLE:
            return '/words_middle.txt';
        case LEVEL.HARD:
            return '/words_hard.txt';
        case LEVEL.EXPERT:
            return '/words_expert.txt';
    }
}

const getAttempts = (level: LEVEL): number => {
    switch (level) {
        case LEVEL.EASY:
            return 4;
        case LEVEL.MIDDLE:
        case LEVEL.HARD:
            return 5;
        case LEVEL.EXPERT:
            return 6;
    }
}

const findWord = async (level: LEVEL): Promise<string> => {
    const response = await fetch(getDifficultyFile(level)),
        text = await response.text(),
        words = text.split('\n'),
        randomIndex = Math.floor(Math.random() * words.length);

    return words[randomIndex];
}

const createGrid = (wordLength: number, attempts: number): void => {
    const grid = document.getElementById('grid')!;
    grid.innerHTML = '';

    for (let i = 0; i < attempts; i++) {
        const row = document.createElement('div');
        row.className = 'row';

        for (let j = 0; j < wordLength; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
        }

        grid.appendChild(row);
    }
}

const startGame = async (level: LEVEL) => {
    const word = await findWord(level),
        levelsContainer = document.getElementById('levels')!,
        gameContainer = document.getElementById('game')!,
        attempts = getAttempts(level);

    levelsContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    createGrid(word.length, attempts);
}

const renderLevels = () => {
    const levelsContainer = document.getElementById('levels');
    if (!levelsContainer) return;

    Object.entries(LEVEL).forEach(([, value]) => {
        const button = document.createElement('button');
        button.textContent = value;
        button.addEventListener('click', () => startGame(value as LEVEL));
        levelsContainer.appendChild(button);
    });
}

renderLevels();
