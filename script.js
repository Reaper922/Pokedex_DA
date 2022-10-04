'use strict';

import Pokemon from './pokemon.js';


const pokemonArr = [];


/**
 * Function that runs after the page is fully loaded.
 */
function init() {
    fetchGroupOfPokemon(10);
    console.log(pokemonArr);
}


/**
 * Fetches the Data of a Pokemon with the given ID from the API.
 * @param {Number} id ID-Number of the Pokemon 
 * @return {Object} Object with the fetched Pokemon Data
 */
async function fetchPokemon(id = 1) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const pokemonData = await fetch(url).then(response => response.json());
    return pokemonData;
}


/**
 * Creates a new Pokemon Object
 * @param {Object} pokemonData Object with the fetched Pokemon Data
 * @return {Pokemon} Pokemon Object
 */
function createPokemon(pokemonData) {
    return new Pokemon(pokemonData);
}


/**
 * Adds the given Pokemon Object to the pokemonArr Array.
 * @param {Pokemon} pokemonObj Pokemon Object
 */
function addPokemonToArray(pokemonObj) {
    pokemonArr.push(pokemonObj);
}


/**
 * Fetches the given Amount of Pokemon and adds them to the pokemonArr Array.
 * @param {Number} amount Amount of Pokemon to fetch
 */
async function fetchGroupOfPokemon(amount) {
    for(let index = 1; index <= amount; index++) {
        const pokemonData = await fetchPokemon(index);
        const pokemonObj = createPokemon(pokemonData);
        addPokemonToArray(pokemonObj);
    }
}


init();