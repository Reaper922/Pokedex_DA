'use strict';

import Pokemon from './pokemon.js';


/**
 * Function that runs after the page is fully loaded.
 */
function init() {
    let pokemon = fetchPokemon();
    pokemon.then((pokemon) => {
        let pokemonObj = new Pokemon(pokemon.name, pokemon.types);
        pokemonObj.test = 'test';
        console.log(pokemonObj);
    })
}


/**
 * Fetches the Data of a Pokemon with the given ID from the API.
 * @param {Number} id ID-Number of the Pokemon 
 * @return {Object} Object of the fetched Pokemon
 */
async function fetchPokemon(id = 1) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const response = await fetch(url);
    const pokemon = await response.json();
    return pokemon;
}


init();