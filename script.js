document.addEventListener('DOMContentLoaded', function() {
    const settingsIcon = document.querySelector('.app .content .input img');
    const settingsPanel = document.querySelector('.app .content .settings');

    settingsIcon.addEventListener('click', function() {
        if (settingsPanel.classList.contains('visible')) {
            settingsPanel.style.maxHeight = null;
            settingsPanel.classList.remove('visible');
        } else {
            const scrollHeight = settingsPanel.scrollHeight + "px";
            settingsPanel.style.maxHeight = scrollHeight;
            settingsPanel.classList.add('visible');
        }
    });
});