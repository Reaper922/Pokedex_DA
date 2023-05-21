'use strict';

import { addLeadingZeros, capitalizeFirstLetter } from "./utilities.js";


/**
 * Creates the Pokemon HTML card template.
 * @param {Pokemon} pokemon Pokemon object 
 * @returns HTML Pokemon card template
 */
export function pokemonCardTemp(pokemon) {
    return /*html*/ `
        <pokemon-card class="pokemon-card bg-${pokemon.color}" data-id=${pokemon.id} tabindex="0">
            <h2>#${addLeadingZeros(pokemon.id, 3)}</h2>
            <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
            <div class="types">
                ${pokemonTypeTemp(pokemon.types)}
            </div>
            <img src="./assets/img/pokeball_simple.svg" class="card-background" alt="Pokeball Background" draggable="false">
            <img src=${pokemon.sprite} class="pokemon-img" alt="Pokemon Image" draggable="false">
        </pokemon-card>`;
}


/**
 * Creates the Pokemon HTML type template.
 * @param {Array} pokemonTypes Array of the types from the Pokemon object
 * @return HTML Pokemon types template
 */
export function pokemonTypeTemp(pokemonTypes) {
    let cachedHTML = '';

    pokemonTypes.forEach(type => {
        cachedHTML += `<span>${type}</span>`;
    });

    return cachedHTML;
}