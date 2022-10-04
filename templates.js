'use strict';


/**
 * Creates the Pokemon card template.
 * @param {Pokemon} pokemon Pokemon object 
 * @returns HTML Pokemon card template
 */
function pokemonCardTemp(pokemon) {
    return `
        <div class="pokemon-preview-card bg-green">
            <h3 class="txt-h3">${pokemon.name}</h3>
            <div class="types">
                ${pokemonTypeTemp(pokemon.types)}
            </div>
            <span class="id txt-body">#${pokemon.id}</span>
            <img src="./img/pokeball.svg" alt="Pokeball Background" class="pokeball-background">
            <img src="${pokemon.sprite}" alt="Pokemon Picture" class="pokemon-picture">
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