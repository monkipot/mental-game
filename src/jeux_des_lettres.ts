type GameState = {
    word: string;
    revealedPositions: Set<number>;
    currentRow: number;
    currentCol: number;
}

let gameState: GameState | null = null;

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
        }
    } else if (event.key === 'Enter') {
        submitGuess();
    } else if (/^[a-zA-Z]$/.test(event.key)) {
        moveToNextWritableCell();
        const cell = getCell(gameState.currentRow, gameState.currentCol);
        if (cell && gameState.currentCol < gameState.word.length) {
            cell.textContent = event.key.toUpperCase();
            gameState.currentCol++;
            moveToNextWritableCell();
        }
    }
}

const submitGuess = (): void => {
    if (!gameState) return;

    const { currentRow, word } = gameState;

    for (let i = 0; i < word.length; i++) {
        const cell = getCell(currentRow, i);
        if (!cell) continue;

        const letter = cell.textContent || '';
        console.log(`index ${i}: "${letter}" vs "${word[i]}"`);

        if (letter.toLowerCase() === word[i].toLowerCase()) {
            cell.style.backgroundColor = 'green';
        }
    }
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
        currentCol: 0
    };
    console.log(word)
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
