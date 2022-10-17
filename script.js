import { Pokemon } from './pokemon.js';
import * as templates from './templates.js';


const pokemonArr = [];
const loadingStepSize = 24;
const startId = 1;
const endId = 151;

let loadedEntries = 0;
let isFiltered = false;
let isFinished = false;
let favoritePokemon = [];


/**
 * Function that runs after the page is fully loaded.
 */
async function init() {
    try {
        await fetchGroupOfPokemon(loadingStepSize, startId);
        hideLoader();
        showSmallLoader();
        renderPokemonArr(pokemonArr);
        addNeededEventListeners(pokemonArr);
        loadFavoritePokemon();
        fetchRemainingPokemon();
    } catch (error) {
        console.error(error);
        hideLoader();
        hideSmallLoader();
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
 * Returns the Pokemon object of the given ID.
 * @param {Number} pokemonId ID of the Pokemon
 * @returns Pokemon object
 */
function getPokemon(pokemonId) {
    return pokemonArr[pokemonId - 1];
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
        const [pokemonData, pokemonSpecies] = await Promise.all([fetchPokemonData(index), fetchPokemonSpecies(index)])
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
        if (!isFiltered) {
            renderPokemonArr(pokemonArr);
            addCardEventListeners(pokemonArr);
        }
    }
    hideSmallLoader();
    isFinished = true;
}


/**
 * Renders all Pokemon in the given pokemonArray into the preview container.
 * @param {Array} pokemonArray Array of Pokemon objects
 */
function renderPokemonArr(pokemonArray) {
    const pokemonPreviewContainer = document.getElementById('pokemon-preview-card-container');
    pokemonPreviewContainer.innerHTML = '';

    pokemonArray.forEach(pokemon => {
        pokemonPreviewContainer.innerHTML += templates.pokemonCardTemp(pokemon);
    });

    if (!isFinished) showSmallLoader();
}


/**
 * Renders the Pokemon details to the detail modal.
 * @param {Pokemon} pokemon Pokemon object
 */
function renderModalDetails(pokemon) {
    const modalHeader = document.getElementById('modal-header');
    const modalTab1 = document.getElementById('tab1-content');
    const modalTab2 = document.getElementById('tab2-content');

    modalHeader.className = '';
    modalHeader.classList.add('modal-header', `bg-${pokemon.color}`);
    modalHeader.innerHTML = templates.detailModalHeaderTemp(pokemon);
    modalTab1.innerHTML = templates.detailModalBodyAboutTemp(pokemon);
    modalTab2.innerHTML = templates.detailModalBodyBaseStatsTemp(pokemon);
}


/**
 * Filters the pokemonArr array with the given search term.
 * @param {String} searchTerm Search term which is used to filter the Pokemon
 */
function filterPokemonArray(searchTerm) {
    isFiltered = searchTerm ? true : false;

    const filteredPokemon = pokemonArr.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    renderPokemonArr(filteredPokemon);
    addCardEventListeners(filteredPokemon);
    hideSmallLoader();
    resetSearchBar();
}


/**
 * Resets the input in the searchbar.
 */
function resetSearchBar() {
    const searchBar = document.getElementById('search');

    searchBar.value = '';
}


/**
 * Adds the pokemon to the favorites list or removes it if it is already there.
 * @param {Object} event Event object
 * @param {Pokemon} pokemon Pokemon object
 */
function toggleFavoritePokemon(event, pokemon) {
    if (!pokemon.isLiked) {
        addPokemonToFavorite(event, pokemon);
    } else {
        removePokemonFromFavorite(event, pokemon);
    }
}


/**
 * Adds the pokemon to the favoritePokemon array.
 * @param {Object} event Event object 
 * @param {Pokemon} pokemon Pokemon object 
 */
function addPokemonToFavorite(event, pokemon) {
    pokemon.isLiked = true;
    event.target.src = `./icons/favorite_white.svg`;

    if (!favoritePokemon.includes(pokemon)) {
        favoritePokemon.push(pokemon);
    }

    saveFavoritePokemon();
}


/**
 * Removes the pokemon to the favoritePokemon array.
 * @param {Object} event Event object 
 * @param {Pokemon} pokemon Pokemon object 
 */
function removePokemonFromFavorite(event, pokemon) {
    pokemon.isLiked = false;
    event.target.src = `./icons/favorite_border_white.svg`;

    favoritePokemon.splice(favoritePokemon.indexOf(pokemon), 1);

    saveFavoritePokemon();
}


/**
 * Adds all the needed event listeners to the DOM.
 * @param {Array} pokemonArr Array with Pokemon objects
 */
function addNeededEventListeners(pokemonArr) {
    addCardEventListeners(pokemonArr);
    addModalBackgroundEventListener();
    addCloseIconEventListener();
    addShowEventListener();
    addSearchEventListener();
    addFavoriteEventListener();
}


/**
 * Adds the click event listener to each card to open the Pokemon details.
 * @param {Array} pokemonArray Array of Pokemon objects
 */
function addCardEventListeners(pokemonArray) {
    const cards = document.querySelectorAll('.pokemon-preview-card');

    cards.forEach((card, index) => {
        card.addEventListener('click', () => showDetailModal(pokemonArray[index].id));
    });
}


/**
 * Adds the click event listener to the background of the details modal to close the Pokemon details.
 */
function addModalBackgroundEventListener() {
    const modalBackgroud = document.getElementById('modal-background');

    modalBackgroud.addEventListener('click', hideDetailModal);
}


/**
 * Adds the click event listener to the close icon of the detail modal to close the Pokemon details.
 */
function addCloseIconEventListener() {
    const closeIcon = document.getElementById('close-icon');

    closeIcon.addEventListener('click', hideDetailModal);
}


/**
 * Adds the click event listener to the 'show all' button to render all Pokemon.
 */
function addShowEventListener() {
    const showBtn = document.getElementById('show-all');

    showBtn.addEventListener('click', () => {
        renderPokemonArr(pokemonArr);
        addCardEventListeners(pokemonArr);
    });
}


/**
 * Adds the change event listener to the searchbar to search Pokemon by pressing enter.
 */
function addSearchEventListener() {
    const searchBar = document.getElementById('search');

    searchBar.addEventListener('change', () => filterPokemonArray(searchBar.value));
}


/**
 * Adds the click event listener to the favorite icon to render the favorite Pokemon.
 */
 function addFavoriteEventListener() {
    const favorite = document.getElementById('favorite-pokemon');

    favorite.addEventListener('click', () => {
        renderPokemonArr(favoritePokemon);
        addCardEventListeners(favoritePokemon);
        hideSmallLoader();
    });
}
 

/**
 * Shows the Pokemon detail modal.
 * @param {Number} pokemonId Id of the Pokemon to be displayed
 */
function showDetailModal(pokemonId) {
    const body = document.getElementById('body');
    const modal = document.getElementById('pokemon-detail-modal');
    const pokemon = getPokemon(pokemonId);
    
    body.classList.add('overflow-hidden');
    renderModalDetails(pokemon);
    modal.classList.remove('d-none');

    const favoriteIcon = document.getElementById('modal-favorite');
    favoriteIcon.addEventListener('click', (event) => toggleFavoritePokemon(event, pokemon));
}


/**
 * Saves favorite Pokemon to local storage.
 */
function saveFavoritePokemon() {
    localStorage.setItem('favPokemon', JSON.stringify(favoritePokemon));
}


/**
 * Loafs favorite Pokemon from local storage.
 */
function loadFavoritePokemon() {
    const loadedPokemon = JSON.parse(localStorage.getItem('favPokemon'));

    if (loadedPokemon) favoritePokemon = loadedPokemon;
}


/**
 * Hides the Pokemon detail modal.
 */
function hideDetailModal() {
    const body = document.getElementById('body');
    const modal = document.getElementById('pokemon-detail-modal');

    body.classList.remove('overflow-hidden');
    modal.classList.add('d-none');
}


/**
 * Hides the loader.
 */
function hideLoader() {
    const loader = document.getElementById('loader');
    const pokemonPreviewContainer = document.getElementById('pokemon-preview-card-container');

    loader.classList.add('d-none');
    pokemonPreviewContainer.classList.remove('d-none');
}


/**
 * Shows the small-loader.
 */
 function showSmallLoader() {
    const smallLoader = document.getElementById('small-loader');

    smallLoader.classList.remove('d-none');
}


/**
 * Hides the small-loader.
 */
 function hideSmallLoader() {
    const smallLoader = document.getElementById('small-loader');

    smallLoader.classList.add('d-none');
}


/**
 * Renders a error message to the pokemonPreviewContainer if an error occurs while fetching data from the API.
 */
function renderErrorMessage() {
    const pokemonPreviewContainer = document.getElementById('pokemon-preview-card-container');
    pokemonPreviewContainer.innerHTML = '';

    pokemonPreviewContainer.innerHTML = templates.errorTemp();
}


init();