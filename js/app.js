import { initMenu } from './menu.js';

function initApp() {
    initMenu();
    
    // Instancie aqui outras funções globais do seu app...
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}