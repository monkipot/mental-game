type GameState = {
    word: string;
    revealedPositions: Set<number>;
    currentRow: number;
    currentCol: number;
    maxRows: number;
}

let gameState: GameState | null = null;
let startTime: number | null = null;

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

const getRevealedLetters = (level: LEVEL): number => {
    switch (level) {
        case LEVEL.EASY:
        case LEVEL.MIDDLE:
            return 0;
        case LEVEL.HARD:
            return 1;
        case LEVEL.EXPERT:
            return 2;
    }
}

const findWord = async (level: LEVEL): Promise<string> => {
    const response = await fetch(getDifficultyFile(level)),
        text = await response.text(),
        words = text.split('\n'),
        randomIndex = Math.floor(Math.random() * words.length);

    return words[randomIndex];
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60),
        secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const timer = (): void => {
    startTime = Date.now();
    const timerElement = document.getElementById('timer')!;

    setInterval(() => {
        if (startTime === null) return;
        const time = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = formatTime(time);
    }, 1000);
}

const getCell = (row: number, col: number): HTMLElement | null => {
    const grid = document.getElementById('grid')!,
        rows = grid.children,
        cells = rows[row].children;

    return cells[col] as HTMLElement;
}

const isWritableCell = (col: number): boolean => {
    if (!gameState) return true;

    return !gameState.revealedPositions.has(col);
}

const moveToNextWritableCell = (): void => {
    if (!gameState) return;
    while (gameState.currentCol < gameState.word.length && !isWritableCell(gameState.currentCol)) {
        gameState.currentCol++;
    }
}

const isRowFull = (): boolean => {
    if (!gameState) return false;

    for (let i = 0; i < gameState.word.length; i++) {
        if (!gameState.revealedPositions.has(i)) {
            const cell = getCell(gameState.currentRow, i);
            if (!cell?.textContent) return false;
        }
    }
    return true;
}

const updateSubmitButton = (): void => {
    const button = document.getElementById('submit-btn') as HTMLButtonElement;
    if (button) {
        button.disabled = !isRowFull();
    }
}

const handleKeyPress = (event: KeyboardEvent): void => {
    if (!gameState) return;

    if (event.key === 'Backspace') {
        if (gameState.currentCol > 0) {
            gameState.currentCol--;
            while (gameState.currentCol > 0 && !isWritableCell(gameState.currentCol)) {
                gameState.currentCol--;
            }
            const cell = getCell(gameState.currentRow, gameState.currentCol);
            if (cell) cell.textContent = '';
            updateSubmitButton();
        }
    } else if (event.key === 'Enter') {
        if (isRowFull()) {
            submitGuess();
        }
    } else if (/^[a-zA-Z]$/.test(event.key)) {
        moveToNextWritableCell();
        const cell = getCell(gameState.currentRow, gameState.currentCol);
        if (cell && gameState.currentCol < gameState.word.length) {
            cell.textContent = event.key.toUpperCase();
            gameState.currentCol++;
            moveToNextWritableCell();
            updateSubmitButton();
        }
    }
}

const submitGuess = (): void => {
    if (!gameState) return;

    const { currentRow, word } = gameState;
    const wordLower = word.toLowerCase();

    const getLetter = (index: number): string | null => {
        const cell = getCell(currentRow, index);
        return cell ? (cell.textContent || '').toLowerCase() : null;
    };

    const colorCell = (index: number, color: string): void => {
        const cell = getCell(currentRow, index);
        if (cell) cell.style.backgroundColor = color;
    };

    const letterCounts = wordLower.split('').reduce<Record<string, number>>((acc, char) => {
        acc[char] = (acc[char] || 0) + 1;
        return acc;
    }, {});

    const guess = Array.from({ length: word.length }, (_, i) => getLetter(i));

    for (let i = 0; i < word.length; i++) {
        const letter = guess[i];
        if (!letter) continue;

        if (letter === wordLower[i]) {
            colorCell(i, 'green');
            letterCounts[letter]--;
        } else if (letterCounts[letter] > 0) {
            colorCell(i, 'orange');
            letterCounts[letter]--;
        }
    }

    const isWin = guess.every((letter, i) => letter === wordLower[i]);

    if (isWin) {
        alert(`Bravo ! Vous avez gagné en ${document.getElementById('timer')!.textContent} !`);
        reset();
        return;
    }

    gameState.currentRow++;

    if (gameState.currentRow >= gameState.maxRows) {
        alert(`Le mot était "${word}".`);
        reset();
        return;
    }

    gameState.currentCol = 0;
    updateSubmitButton();

    const hiddenInput = document.getElementById('hidden-input') as HTMLInputElement;
    hiddenInput.focus();
}

const reset = (): void => {
    document.getElementById('game')!.style.display = 'none';
    document.getElementById('levels')!.style.display = 'block';
    document.getElementById('grid')!.innerHTML = '';
    document.getElementById('timer')!.textContent = '00:00';
    gameState = null;
    startTime = null;
}

const createGrid = (word: string, attempts: number, revealedCount: number): void => {
    const grid = document.getElementById('grid')!;
    grid.innerHTML = '';

    const revealedPositions = new Set<number>();
    while (revealedPositions.size < revealedCount && revealedPositions.size < word.length) {
        revealedPositions.add(Math.floor(Math.random() * word.length));
    }

    gameState = {
        word,
        revealedPositions,
        currentRow: 0,
        currentCol: 0,
        maxRows: attempts
    };

    for (let i = 0; i < attempts; i++) {
        const row = document.createElement('div');
        row.className = 'row';

        for (let j = 0; j < word.length; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (i === 0 && revealedPositions.has(j)) {
                cell.textContent = word[j];
                cell.classList.add('revealed');
            }

            row.appendChild(cell);
        }

        grid.appendChild(row);
    }

    moveToNextWritableCell();
    updateSubmitButton();

    const hiddenInput = document.getElementById('hidden-input') as HTMLInputElement;
    hiddenInput.value = '';
    hiddenInput.focus();
    hiddenInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        const lastChar = value.slice(-1).toUpperCase();

        if (value === '') {
            handleKeyPress(new KeyboardEvent('keydown', { key: 'Backspace' }));
        } else if (/^[A-Z]$/.test(lastChar)) {
            handleKeyPress(new KeyboardEvent('keydown', { key: lastChar }));
        }
        target.value = '';
    });

    grid.addEventListener('click', () => hiddenInput.focus());

    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('submit-btn')!.addEventListener('click', submitGuess);
}

const startGame = async (level: LEVEL) => {
    const word = await findWord(level),
        levelsContainer = document.getElementById('levels')!,
        gameContainer = document.getElementById('game')!,
        attempts = getAttempts(level),
        revealedCount = getRevealedLetters(level);

    levelsContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    createGrid(word, attempts, revealedCount);
    timer();
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
