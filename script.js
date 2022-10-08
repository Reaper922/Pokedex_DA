'use strict';

import Pokemon from './pokemon.js';


const pokemonArr = [];
const loadingStepSize = 24;
const startId = 1;
const endId = 151;

let loadedEntries = 0;


/**
 * Function that runs after the page is fully loaded.
 */
async function init() {
    try {
        await fetchGroupOfPokemon(loadingStepSize, startId);
        hideLoader();
        renderPokemonArr();
        addCardEventListeners();
        addModalBackgroundEventListener();
        addCloseIconEventListener();
        fetchRemainingPokemon();
    } catch (error) {
        console.error(error);
        hideLoader();
        renderErrorMessage();
    }
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
 * @param {Number} startId Pokemon ID to start with
 */
async function fetchGroupOfPokemon(amount = loadingStepSize, startId = 1) {
    const initialStartId = startId;

    for (let index = startId; index <= amount + (startId - 1) && index <= endId; index++) {
        const pokemonData = await fetchPokemonData(index);
        const pokemonSpecies = await fetchPokemonSpecies(index);
        const pokemonObj = createPokemon(pokemonData, pokemonSpecies);
        addPokemonToArray(pokemonObj);
        loadedEntries = index;
    }

    return initialStartId;
}


/**
 * Fetches the remaining Pokemon until the endId is reached.
 */
 async function fetchRemainingPokemon() {
    while (loadedEntries < endId) {
        await fetchGroupOfPokemon(loadingStepSize, loadedEntries + 1);
        renderPokemonArr();
        addCardEventListeners();
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


/**
 * Adds the click event listener to each card to open the Pokemon details.
 */
function addCardEventListeners() {
    const cards = document.querySelectorAll('.pokemon-preview-card');

    cards.forEach((card, index) => {
        let pokemonId = index + 1;
        card.addEventListener('click', () => showDetails(pokemonId));
    })
}


/**
 * Adds the click event listener to the background of the details modal to close the Pokemon details.
 */
function addModalBackgroundEventListener() {
    const modalBackgroud = document.getElementById('modal-background');

    modalBackgroud.addEventListener('click', hideDetails);
}


/**
 * Adds the click event listener to the close icon of the details modal to close the Pokemon details.
 */
 function addCloseIconEventListener() {
    const button = document.getElementById('close-icon');

    button.addEventListener('click', hideDetails);
}


/**
 * Shows the Pokemon details modal.
 */
function showDetails(pokemonId) {
    const modal = document.getElementById('pokemon-detail-modal');
    const modalHeader = document.getElementById('modal-header');

    // modalHeader.innerHTML = `Pokemon with id: ${pokemonId}`
    modal.classList.remove('d-none');
}


/**
 * Hides the Pokemon details modal.
 */
function hideDetails() {
    const modal = document.getElementById('pokemon-detail-modal');

    modal.classList.add('d-none');  
}


/**
 * Shows the loader.
 */
function showLoader() {
    const loader = document.getElementById('loader');
    const pokemonPreviewContainer = document.getElementById('pokemon-preview-container');

    loader.classList.remove('d-none');
    pokemonPreviewContainer.classList.add('d-none');
}


/**
 * Hides the loader.
 */
function hideLoader() {
    const loader = document.getElementById('loader');
    const pokemonPreviewContainer = document.getElementById('pokemon-preview-container');

    loader.classList.add('d-none');
    pokemonPreviewContainer.classList.remove('d-none');
}


/**
 * Renders a error message to the pokemonPreviewContainer if an error occurs while fetching data from the API.
 */
 function renderErrorMessage() {
    const pokemonPreviewContainer = document.getElementById('pokemon-preview-container');
    pokemonPreviewContainer.innerHTML = '';

    pokemonPreviewContainer.innerHTML = errorTemp();
}


init();