'use strict';

import Pokemon from './pokemon.js';


const pokemonArr = [];


/**
 * Function that runs after the page is fully loaded.
 */
async function init() {
    await fetchGroupOfPokemon(10);
    renderPokemonArr();
}


/**
 * Fetches the data of a Pokemon with the given ID from the API.
 * @param {Number} id ID-Number of the Pokemon 
 * @return {Object} Object with the fetched Pokemon data
 */
async function fetchPokemon(id = 1) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const pokemonData = await fetch(url).then(response => response.json());
    return pokemonData;
}


/**
 * Creates a new Pokemon object.
 * @param {Object} pokemonData Object with the fetched Pokemon data
 * @return {Pokemon} Pokemon object
 */
function createPokemon(pokemonData) {
    return new Pokemon(pokemonData);
}


/**
 * Adds the given Pokemon object to the pokemonArr array.
 * @param {Pokemon} pokemonObj Pokemon object
 */
function addPokemonToArray(pokemonObj) {
    pokemonArr.push(pokemonObj);
}


/**
 * Fetches the given amount of Pokemon and adds them to the pokemonArr array.
 * @param {Number} amount Amount of Pokemon to fetch
 */
async function fetchGroupOfPokemon(amount) {
    for(let index = 1; index <= amount; index++) {
        const pokemonData = await fetchPokemon(index);
        const pokemonObj = createPokemon(pokemonData);
        addPokemonToArray(pokemonObj);
    }
}


/**
 * Renders all Pokemon in the pokemonArr array into the preview container.
 */
function renderPokemonArr() {
    const pokemonPreviewContainer = document.getElementById('pokemon-preview-container');
    pokemonPreviewContainer.innerHTML = '';

    pokemonArr.forEach(pokemon => {
        pokemonPreviewContainer.innerHTML += pokemonCardTemp(pokemon);
    })
}


init();