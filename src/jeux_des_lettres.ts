enum LEVEL {
    EASY = 'Simple',
    MIDDLE = 'Moyen',
    HARD = 'Difficile',
    EXPERT = 'EXPERT'
}

const getDifficultyFile = (level: LEVEL): string => {
    switch (level) {
        case LEVEL.EASY: return '/words_easy.txt';
        case LEVEL.MIDDLE: return '/words_middle.txt';
        case LEVEL.HARD: return '/words_hard.txt';
        case LEVEL.EXPERT: return '/words_expert.txt';
    }
}

const findWord = async (level: LEVEL): Promise<string> => {
    const response = await fetch(getDifficultyFile(level));
    const text = await response.text();
    const words = text.split('\n');

    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

const maskWord = (word: string): string => {
    const revealedCount = 2;
    const indexes = Array.from({ length: word.length }, (_, i) => i);
    const revealedIndexes = new Set<number>();

    while (revealedIndexes.size < revealedCount && revealedIndexes.size < word.length) {
        const randomIndex = Math.floor(Math.random() * indexes.length);
        revealedIndexes.add(indexes[randomIndex]);
    }

    return word.split('').map((char, index) =>
        revealedIndexes.has(index) ? char : '_'
    ).join(' ');
}

const startGame = async (level: LEVEL) => {
    const word = await findWord(level);
    const levelsContainer = document.getElementById('levels')!;
    const gameContainer = document.getElementById('game')!;
    const wordDisplay = document.getElementById('word-display')!;

    levelsContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    wordDisplay.textContent = maskWord(word);
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
