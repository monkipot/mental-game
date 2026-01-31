console.log('jeux des lettres');

enum LEVEL {
    EASY = 'Simple',
    MIDDLE = 'Moyen',
    HARD = 'Difficile',
    EXPERT = 'EXPERT'
}

const getLevels = () => Object.values(LEVEL);

const renderLevels = () => {
    const levelsContainer = document.getElementById('levels');
    if (!levelsContainer) return;

    getLevels().forEach(level => {
        const button = document.createElement('button');
        button.textContent = level;
        levelsContainer.appendChild(button);
    });
}

renderLevels();
