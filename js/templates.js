'use strict';

import { addLeadingZeros, capitalizeFirstLetter } from "./utilities.js";


/**
 * Creates the Pokemon card template.
 * @param {Pokemon} pokemon Pokemon object.
 * @returns HTML Pokemon card template.
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
            <img src=${pokemon.sprite} class="pokemon-img" alt="Pokemon Image" draggable="false" loading="lazy">
        </pokemon-card>`;
}


/**
 * Creates the Pokemon dialog head template.
 * @param {Pokemon} pokemon Pokemon object.
 * @returns HTML Pokemon dialog head template.
 */
export function pokemonDialogHeadTemp(pokemon) {
    return /*html*/ `
        <div class="modal-heading">
            <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
            <h2>#${addLeadingZeros(pokemon.id, 3)}</h2>
        </div>
        <div style="display: flex; justify-content: space-between">
            <div class="types">
                ${pokemonTypeTemp(pokemon.types)}
            </div>
            <div class="genera">
                <span>${pokemon.genera}</span>
                <img src="./assets/icons/favorite_border_white.svg" alt="Fav" id="favorite" data-id=${pokemon.id} draggable="false">
            </div>
        </div>`;
}


/**
 * Creates the Pokemon HTML type template.
 * @param {Array} pokemonTypes Array of the types from the Pokemon object.
 * @return HTML Pokemon types template.
 */
export function pokemonTypeTemp(pokemonTypes) {
    let cachedHTML = '';

    pokemonTypes.forEach(type => {
        cachedHTML += /*html*/ `<span>${type}</span>`;
    });

    return cachedHTML;
}