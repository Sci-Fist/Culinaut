const seasonalProducts = {
    spring: [
        { name: 'Spargel', icon: 'asparagus.svg', months: 'April - Juni' },
        { name: 'Bärlauch', icon: 'wild-garlic.svg', months: 'März - Mai' },
        { name: 'Rhabarber', icon: 'rhubarb.svg', months: 'April - Juni' },
        { name: 'Radieschen', icon: 'radish.svg', months: 'April - Oktober' },
        { name: 'Frühlingszwiebeln', icon: 'spring-onion.svg', months: 'März - Mai' }
    ],
    summer: [
        { name: 'Tomaten', icon: 'tomato.svg', months: 'Juli - Oktober' },
        { name: 'Zucchini', icon: 'zucchini.svg', months: 'Juni - Oktober' },
        { name: 'Beeren', icon: 'berries.svg', months: 'Juni - September' },
        { name: 'Kirschen', icon: 'cherry.svg', months: 'Juni - August' },
        { name: 'Pfifferlinge', icon: 'chanterelle.svg', months: 'Juli - Oktober' }
    ],
    autumn: [
        { name: 'Kürbis', icon: 'pumpkin.svg', months: 'September - Dezember' },
        { name: 'Äpfel', icon: 'apple.svg', months: 'August - Oktober' },
        { name: 'Pilze', icon: 'mushroom.svg', months: 'September - November' },
        { name: 'Birnen', icon: 'pear.svg', months: 'August - Oktober' },
        { name: 'Trauben', icon: 'grapes.svg', months: 'September - Oktober' }
    ],
    winter: [
        { name: 'Grünkohl', icon: 'kale.svg', months: 'November - Februar' },
        { name: 'Rosenkohl', icon: 'brussels-sprouts.svg', months: 'November - Februar' },
        { name: 'Pastinaken', icon: 'parsnip.svg', months: 'Oktober - März' },
        { name: 'Chicorée', icon: 'chicory.svg', months: 'November - April' },
        { name: 'Feldsalat', icon: 'lamb-lettuce.svg', months: 'Oktober - März' }
    ]
};

function createSeasonalContent(season) {
    const products = seasonalProducts[season];
    let html = `<div class="seasonal-grid">`;
    
    products.forEach(product => {
        html += `
            <div class="seasonal-item" data-aos="fade-up">
                <div class="seasonal-icon">
                    <img src="assets/icons/seasonal/${product.icon}" alt="${product.name}">
                </div>
                <div class="seasonal-info">
                    <h4>${product.name}</h4>
                    <p class="seasonal-months">${product.months}</p>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

function initializeSeasonalCalendar() {
    const currentSeason = getCurrentSeason();
    const container = document.querySelector('.seasonal-calendar');
    
    if (!container) return;

    // Create season buttons
    const seasonsDE = {
        spring: 'Frühling',
        summer: 'Sommer',
        autumn: 'Herbst',
        winter: 'Winter'
    };

    let buttonsHtml = '<div class="season-buttons">';
    Object.entries(seasonsDE).forEach(([season, label]) => {
        buttonsHtml += `
            <button class="season-btn ${season === currentSeason ? 'active' : ''}" 
                    data-season="${season}">
                ${label}
            </button>
        `;
    });
    buttonsHtml += '</div>';

    // Create content containers
    let contentHtml = '<div class="season-contents">';
    Object.keys(seasonalProducts).forEach(season => {
        contentHtml += `
            <div class="season-content ${season === currentSeason ? 'active' : ''}" 
                 data-season="${season}">
                ${createSeasonalContent(season)}
            </div>
        `;
    });
    contentHtml += '</div>';

    container.innerHTML = buttonsHtml + contentHtml;
    initSeasonalInteractions();
}
