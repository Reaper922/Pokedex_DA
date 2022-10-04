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
                <span class="type txt-body">Grass</span>
                <span class="type txt-body">Poison</span>
            </div>
            <span class="id txt-body">#${pokemon.id}</span>
            <img src="./img/pokeball.svg" alt="Pokeball Background" class="pokeball-background">
            <img src="./img/pokemon/${pokemon.id}.svg" alt="Pokemon Picture" class="pokemon-picture">
        </div>`;
}