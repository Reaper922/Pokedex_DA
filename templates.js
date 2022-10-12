'use strict';


/**
 * Creates the Pokemon HTML card template.
 * @param {Pokemon} pokemon Pokemon object 
 * @returns HTML Pokemon card template
 */
function pokemonCardTemp(pokemon) {
    return `
        <div class="pokemon-preview-card bg-${pokemon.color}">
            <h3 class="txt-h3">${pokemon.name}</h3>
            <div class="types">
                ${pokemonTypeTemp(pokemon.types)}
            </div>
            <span class="id txt-primary">#${pokemon.id}</span>
            <img src="./img/pokeball_simple.svg" alt="Pokeball Background" class="pokeball-background no-select" draggable="false">
            <img src="${pokemon.sprite}" alt="Pokemon Picture" class="pokemon-picture no-select" draggable="false">
        </div>`;
}


/**
 * Creates the Pokemon HTML type template.
 * @param {Array} pokemonTypes Array of the types from the Pokemon object
 * @return HTML Pokemon types template
 */
function pokemonTypeTemp(pokemonTypes) {
    let typesTemp = '';

    pokemonTypes.forEach(type => {
        typesTemp += `<span class="type txt-primary">${type.type.name}</span>`;
    });
    return typesTemp;
}


/**
 * Creates the Pokemon modal header HTML template.
 * @param {Pokemon} pokemon Pokemon object
 * @returns HTML modal header template
 */
function detailModalHeaderTemp(pokemon) {
    return `
        <div class="modal-heading">
            <h2 class="txt-h3">${pokemon.name}</h2>
            <span class="id-modal txt-primary">#${pokemon.id}</span>
        </div>
        <div class="modal-subheading">
            <div>
                ${pokemonTypeTemp(pokemon.types)}
            </div>
            <div class="txt-center">
                <span class="txt-primary">${pokemon.genera}</span>
            </div>
        </div>
        <div class="modal-image-container">
            <img src="${pokemon.sprite}" alt="Pokemon Picture" class="modal-pokemon-picture no-select" draggable="false">
            <img src="./img/pokeball_simple.svg" alt="Pokeball Background" class="modal-pokeball-background no-select" draggable="false">
        </div>`;
}


/**
 * Creates the Pokemon modal body HTML template for the about tab.
 * @param {Pokemon} pokemon Pokemon object
 * @returns HTML modal body template for the about tab
 */
function detailModalBodyAboutTemp(pokemon) {
    return `
        <div class="tab1-content">
            <div class="txt-content">
                <span class="txt-secondary">${pokemon.text}</span>
            </div>
            <div class="info-content">
                <div class="d-flex-center-col">
                    <div>Height</div>
                    <div>${pokemon.height} ft</div>
                </div>
                <div class="d-flex-center-col">
                    <div>Weight</div>
                    <div>${pokemon.weight} lb</div>
                </div>
            </div>
        </div>`;
}


/**
 * Creates the Pokemon HTML base stats template.
 * @param {Array} pokemonStats Array of the stats from the Pokemon object
 * @return HTML Pokemon base stats template
 */
function detailModalBodyBaseStatsTemp(pokemonStats) {
    let statsTemp = '';
    
    pokemonStats.forEach(stat => {
        statsTemp += `
            <tr>
                <td class="txt-secondary">${stat.stat.name}</td>
                <td class="txt-secondary">${stat.base_stat}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress" style="width:${stat.base_stat}%;"></div>
                    </div>
                </td>
            </tr>`;
    });
    return `
        <table>
            ${statsTemp}
        </table>`;
}



/**
 * Creates a HTML error message for a possible loading error.
 * @returns HTML error message
 */
function errorTemp() {
    return `
        <div class="error-message d-flex-center">
            <h3 class="txt-primary">Unfortunately an error occurred while loading the page. Please try again later.</h3>
            <img src="./img/psyduck.png" alt="Loading Error Image" draggable="false">
        </div>`;
}