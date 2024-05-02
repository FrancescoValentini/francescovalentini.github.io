function cambiaTab() {
    // Trova l'indice della tab attualmente attiva
    var tabAttiva = document.querySelector('.nav-tabs .nav-link.active');
    var indiceTabAttiva = Array.from(tabAttiva.parentElement.parentElement.children).indexOf(tabAttiva.parentElement);
    
    // Trova il numero totale di tab
    var numeroTab = document.querySelectorAll('.nav-tabs .nav-item').length;
    
    // Calcola l'indice della prossima tab da attivare
    var prossimoIndice = (indiceTabAttiva + 1) % numeroTab;
    
    // Trova la prossima tab
    var prossimaTab = document.querySelectorAll('.nav-tabs .nav-item')[prossimoIndice].querySelector('.nav-link');
    
    // Attiva la prossima tab
    prossimaTab.click();
}
