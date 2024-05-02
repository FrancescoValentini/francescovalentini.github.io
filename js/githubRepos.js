/**
 * Ottiene la lista delle repository per un profilo github
 * utilizzando le api liberamente accessibili, il risultato
 * viene inserito nel localstorage come cache, e aggiornato
 * se più vecchio di 3 giorni
 * @returns JSON con le repository dell'utente
 */
async function fetchRepositories() {
    const cachedData = localStorage.getItem('githubRepositories');
    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const timestamp = new Date(parsedData.timestamp).getTime(); // converte la data presa dal localstorage in millisecondi
        const currentDate = new Date().getTime(); // Converte la data corrente in millisecondi
        const cacheExpiration = 3 * 24 * 60 * 60 * 1000; // 3 giorni in millisecondi
        if (currentDate - timestamp <= cacheExpiration) { // Verifica che non siano passati 3 giorni
            return parsedData.repositories;
        }
    }

    const response = await fetch('https://api.github.com/users/FrancescoValentini/repos');
    const data = await response.json();
    localStorage.setItem('githubRepositories', JSON.stringify({ repositories: data, timestamp: new Date() }));
    return data;
}

/**
 * Converte la data nel formato utilizzato da github nel json
 * nel formato dd-mm-yyyy, hh:mm
 * @param {string} dateString 
 * @returns data nel formato dd-mm-yyyy, hh:mm
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return date.toLocaleDateString('en-GB', options);
}

/**
 * Effettua il parsing del JSON con le repository
 * e genera le opportune card per il sito web
 * @param {JSON} repo Oggetto json contenente le repository
 * @returns Una card HTML
 */
function createRepositoryCard(repo) {
    const card = document.createElement('div');
    card.classList.add('col-md-6', 'repository-card');
    const lastCommitDate = repo.updated_at ? formatDate(repo.updated_at) : 'N/A';
    card.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${repo.name}</h5>
                <p class="card-text">${repo.description}</p>
                <p class="card-languages">${repo.language ? '<b>Linguaggio:</b> ' + repo.language : '<b>Language:</b> none'}</p>
                <p class="card-last-commit"><b>Ultimo commit:</b> ${lastCommitDate}</p>
                
            </div>
        </div>
    `;

    // Aggiungi l'event listener per reindirizzare alla repository quando viene cliccata la card
    card.addEventListener('click', function() {
        window.open(repo.html_url, '_blank');
    });

    return card;
}

/**
 * Fa in modo che tutte le card abbiano la stessa
 * altezza
 */
function equalizeCardHeight() {
    const cards = document.querySelectorAll('.card');
    let maxHeight = 0;

    cards.forEach(card => {
        const cardHeight = card.offsetHeight;
        if (cardHeight > maxHeight) {
            maxHeight = cardHeight;
        }
    });

    cards.forEach(card => {
        card.style.height = maxHeight + 'px';
    });
}

