'use strict';


/**
 * Creates the Pokemon card template.
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
            <span class="id txt-body">#${pokemon.id}</span>
            <img src="./img/pokeball_simple.svg" alt="Pokeball Background" class="pokeball-background" draggable="false">
            <img src="${pokemon.sprite}" alt="Pokemon Picture" class="pokemon-picture" draggable="false">
        </div>`;
}


/**
 * Creates the Pokemon type template.
 * @param {Array} pokemonTypes Array of the types from the Pokemon object.
 * @return HTML Pokemon types template.
 */
function pokemonTypeTemp(pokemonTypes) {
    let typesTemp = '';

    pokemonTypes.forEach(type => {
        typesTemp += `<span class="type txt-body">${type.type.name}</span>`;
    });
    return typesTemp;
}


/**
 * Creates a error message for a possible loading error.
 * @returns HTML error message
 */
function errorTemp() {
    return `
        <div class="error-message d-flex-center">
            <h1>Unfortunately an error occurred while loading the page. Please try again later.</h1>
            <img src="./img/psyduck.png" alt="Loading Error Image">
        </div>`;
}