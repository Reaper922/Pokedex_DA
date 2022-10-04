'use strict';

import Pokemon from './pokemon.js';


const pokemonArr = [];


/**
 * Function that runs after the page is fully loaded.
 */
async function init() {
    await fetchGroupOfPokemon(12);
    renderPokemonArr();
    console.log(pokemonArr);
}


/**
 * Fetches the data of a Pokemon with the given ID from the API.
 * @param {Number} id ID-Number of the Pokemon 
 * @return {Object} Object with the fetched Pokemon data
 */
async function fetchPokemonData(id = 1) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const pokemonData = await fetch(url).then(response => response.json());
    return pokemonData;
}


/**
 * Fetches the species data of a Pokemon with the given ID from the API.
 * @param {Number} id ID-Number of the Pokemon 
 * @return {Object} Object with the fetched Pokemon species data
 */
async function fetchPokemonSpecies(id = 1) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    const pokemonSpecies = await fetch(url).then(response => response.json());
    return pokemonSpecies;
}


/**
 * Creates a new Pokemon object.
 * @param {Object} pokemonData Object with the fetched Pokemon data
 * @param {Object} pokemonSpecies Object with the fetched Pokemon species data
 * @return {Pokemon} Pokemon object
 */
function createPokemon(pokemonData, pokemonSpecies) {
    return new Pokemon(pokemonData, pokemonSpecies);
}


/**
 * Adds the given Pokemon object to the pokemonArr array.
 * @param {Pokemon} pokemonObj Pokemon object
 */
function addPokemonToArray(pokemonObj) {
    pokemonArr.push(pokemonObj);
}


/**
 * Fetches the given amount of Pokemon (data and species) and adds them to the pokemonArr array.
 * @param {Number} amount Amount of Pokemon to fetch
 */
async function fetchGroupOfPokemon(amount) {
    for (let index = 1; index <= amount; index++) {
        const pokemonData = await fetchPokemonData(index);
        const pokemonSpecies = await fetchPokemonSpecies(index);
        const pokemonObj = createPokemon(pokemonData, pokemonSpecies);
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