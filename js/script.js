'use strict';

import { pokemonCardTemp, pokemonDialogHeadTemp } from "./templates.js";
import { replaceUnicodeCharacter } from "./utilities.js";



const pokemonDataUrl = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonSpeciesUrl = 'https://pokeapi.co/api/v2/pokemon-species/';
let nextListUrl = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemonBatch = [];
let allPokemon = [];
let favoritePokemon = [];


const lastCardObserver = new IntersectionObserver(
    entries => {
        const lastCard = entries[0];

        if (!lastCard.isIntersecting) return;
        lastCardObserver.unobserve(lastCard.target);
        showLoader();
        renderNextBatch();
    }, {rootMargin: '250px'}
);


async function init() {
    loadFavoritePokemon();
    renderNextBatch();
    document.getElementById('close').addEventListener('click', () => {
        closeModal();
    })
}


function cardEventlistener() {
    const cards = document.querySelectorAll('pokemon-card');
    
    cards.forEach(card => {
        card.addEventListener('click', event => {
            const pokemonId = event.currentTarget.dataset.id;
            const pokemon = findPokemon(pokemonId);

            displayModal(pokemon);
        });
    });
}


async function renderNextBatch() {
    loadedPokemonBatch = await fetchPokemonList();
    await renderPokemon();
    hideLoader();
    cardEventlistener();
    lastCardObserver.observe(document.querySelector('pokemon-card:last-child'));
}


async function fetchPokemonList() {
    const pokemonList = await fetch(nextListUrl).then(response => response.json());
    nextListUrl = pokemonList.next;
    return pokemonList.results;
}


async function fetchPokemonData(url, name) {
    return await fetch(url + name).then(response => response.json());
}


async function renderPokemon() {
    const containerEl = document.getElementById('pokemon-container');
    let cachedHTML = '';

    for (let pokemon of loadedPokemonBatch) {
        let pokemonObj, data, species;

        try {
            [data, species] = await Promise.all([
                fetchPokemonData(pokemonDataUrl, pokemon.name),
                fetchPokemonData(pokemonSpeciesUrl, pokemon.name)
            ]);
        } catch (err) {
            console.error(`Could not fetch data for pokemon: ${pokemon.name}`);
            console.error(err.message);
            continue;
        }
        pokemonObj = createPokemon(data, species);
        allPokemon.push(pokemonObj);
        cachedHTML += pokemonCardTemp(pokemonObj);
    }
    containerEl.innerHTML += cachedHTML;
}


function createPokemon(data, species) {
    return {
        id: data.id,
        name: data.name,
        sprite: data.sprites.other.dream_world.front_default,
        height: data.height,
        weight: data.weight,
        color: species.color.name,
        habitat: species.habitat.name,
        types: getPokemonTypes(data),
        stats: getStats(data),
        genera: getGenera(species),
        description: getDescription(species)
    }
}


function getStats(data) {
    let stats = [];

    data.stats.forEach(({base_stat, stat}) => {
        stats.push(base_stat);
    })

    return stats;
}


function getPokemonTypes(data) {
    let types = [];

    data.types.forEach(type => {
        types.push(type.type.name);
    });

    return types;
}


function getGenera(species) {
    const genus = species.genera.find(genus => genus.language.name === 'en');
    return genus.genus;
}


function getDescription(species) {
    const description = species.flavor_text_entries.find(text => text.language.name === 'en');
    return replaceUnicodeCharacter(description.flavor_text);
}


function findPokemon(pokemonId) {
    return allPokemon.find(pokemon => pokemon.id == pokemonId);
}


function displayModal(pokemon) {
    const modalEl = document.getElementById('dialog');

    renderModalHead(pokemon);
    setPokemonImage(pokemon);
    setAbout(pokemon);
    setBaseStats(pokemon);
    setBaseStatsProgress(pokemon);
    setFavoriteIconEventListener(pokemon);
    if (favoritePokemon.includes(pokemon.id)) setFavoriteIconImage(true);
    modalEl.className = `bg-${pokemon.color}`;
    modalEl.showModal();
}


function renderModalHead(pokemon) {
    const modalHeadEl = document.getElementById('modal-head');

    modalHeadEl.innerHTML = pokemonDialogHeadTemp(pokemon);
}


function setPokemonImage(pokemon) {
    const pokemonImageEl = document.getElementById('modal-pokemon');

    pokemonImageEl.src = pokemon.sprite;
}


function setAbout(pokemon) {
    const descriptionEl = document.getElementById('description');
    const habitatEl = document.getElementById('habitat');
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weight');

    descriptionEl.textContent = pokemon.description;
    habitatEl.textContent = `Habitat: ${pokemon.habitat}`;
    heightEl.textContent = pokemon.height;
    weightEl.textContent = pokemon.weight;
}


function setBaseStats(pokemon) {
    const stats = ['hp', 'attack', 'defence', 'special-attack', 'special-defence', 'speed'];

    stats.forEach((stat, index) => {
        const statEl = document.getElementById(stat);
        statEl.textContent = pokemon.stats[index];
    })
}


function setBaseStatsProgress(pokemon) {
    const statsProgress = ['hp-progress', 'attack-progress', 'defence-progress', 'special-attack-progress', 'special-defence-progress', 'speed-progress'];
    const conversionFactor = 1.6;

    statsProgress.forEach((progress, index) => {
        const progressEl = document.getElementById(progress);
        progressEl.style.width = `${(pokemon.stats[index] / conversionFactor).toFixed(2)}%`;;
    })
}


function setFavoriteIconEventListener(pokemon) {
    const favoriteEl = document.getElementById('favorite');

    favoriteEl.addEventListener('click', () => toggleFavoritePokemon(pokemon));
}


function toggleFavoritePokemon(pokemon) {
    if (!favoritePokemon.includes(pokemon.id)) {
        favoritePokemon.push(pokemon.id);
        setFavoriteIconImage(true);
    } else {
        const index = favoritePokemon.indexOf(pokemon.id);
        favoritePokemon.splice(index, 1);
        setFavoriteIconImage(false);
    }
    saveFavoritePokemon();
}


function setFavoriteIconImage(isLiked) {
    const favoriteEl = document.getElementById('favorite');

    if (isLiked) {
        favoriteEl.src = "./assets/icons/favorite_white.svg";
    } else {
        favoriteEl.src = "./assets/icons/favorite_border_white.svg";
    }
}


function closeModal() {
    const modalEl = document.getElementById('dialog');

    modalEl.close();
}


function showLoader() {
    const loaderEl = document.getElementById('loader');

    loaderEl.classList.remove('d-none');
}


function hideLoader() {
    const loaderEl = document.getElementById('loader');

    loaderEl.classList.add('d-none');
}


function saveFavoritePokemon() {
    localStorage.setItem('fav-pokemon', JSON.stringify(favoritePokemon));
}


function loadFavoritePokemon() {
    const loadedPokemon = localStorage.getItem('fav-pokemon');

    if (loadedPokemon) {
        favoritePokemon = JSON.parse(loadedPokemon);
    }
}


init();

// import { Pokemon } from './pokemon.js';
// import * as templates from './templates.js';


// const pokemonArr = [];
// const loadingStepSize = 24;
// const startId = 1;
// const endId = 151;

// let loadedEntries = 0;
// let isFiltered = false;
// let isFinished = false;
// let favoritePokemon = [];


// /**
//  * Function that runs after the page is fully loaded.
//  */
// async function init() {
//     try {
//         await fetchGroupOfPokemon(loadingStepSize, startId);
//         hideLoader();
//         showSmallLoader();
//         renderPokemonArr(pokemonArr);
//         addNeededEventListeners(pokemonArr);
//         loadFavoritePokemon();
//         fetchRemainingPokemon();
//     } catch (error) {
//         console.error(error);
//         hideLoader();
//         hideSmallLoader();
//         renderErrorMessage();
//     }
// }


// /**
//  * Fetches the data of a Pokemon with the given ID from the API.
//  * @param {Number} id ID-Number of the Pokemon 
//  * @return {Object} Object with the fetched Pokemon data
//  */
// async function fetchPokemonData(id = 1) {
//     const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
//     const pokemonData = await fetch(url).then(response => response.json());
//     return pokemonData;
// }


// /**
//  * Fetches the species data of a Pokemon with the given ID from the API.
//  * @param {Number} id ID-Number of the Pokemon 
//  * @return {Object} Object with the fetched Pokemon species data
//  */
// async function fetchPokemonSpecies(id = 1) {
//     const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
//     const pokemonSpecies = await fetch(url).then(response => response.json());
//     return pokemonSpecies;
// }


// /**
//  * Creates a new Pokemon object.
//  * @param {Object} pokemonData Object with the fetched Pokemon data
//  * @param {Object} pokemonSpecies Object with the fetched Pokemon species data
//  * @return {Pokemon} Pokemon object
//  */
// function createPokemon(pokemonData, pokemonSpecies) {
//     return new Pokemon(pokemonData, pokemonSpecies);
// }


// /**
//  * Returns the Pokemon object of the given ID.
//  * @param {Number} pokemonId ID of the Pokemon
//  * @returns Pokemon object
//  */
// function getPokemon(pokemonId) {
//     return pokemonArr[pokemonId - 1];
// }


// /**
//  * Adds the given Pokemon object to the pokemonArr array.
//  * @param {Pokemon} pokemonObj Pokemon object
//  */
// function addPokemonToArray(pokemonObj) {
//     pokemonArr.push(pokemonObj);
// }


// /**
//  * Fetches the given amount of Pokemon (data and species) and adds them to the pokemonArr array.
//  * @param {Number} amount Amount of Pokemon to fetch
//  * @param {Number} startId Pokemon ID to start with
//  */
// async function fetchGroupOfPokemon(amount = loadingStepSize, startId = 1) {
//     const initialStartId = startId;

//     for (let index = startId; index <= amount + (startId - 1) && index <= endId; index++) {
//         const [pokemonData, pokemonSpecies] = await Promise.all([fetchPokemonData(index), fetchPokemonSpecies(index)])
//         const pokemonObj = createPokemon(pokemonData, pokemonSpecies);
//         addPokemonToArray(pokemonObj);
//         loadedEntries = index;
//     }

//     return initialStartId;
// }


// /**
//  * Fetches the remaining Pokemon until the endId is reached.
//  */
// async function fetchRemainingPokemon() {
//     while (loadedEntries < endId) {
//         await fetchGroupOfPokemon(loadingStepSize, loadedEntries + 1);
//         if (!isFiltered) {
//             renderPokemonArr(pokemonArr);
//             addCardEventListeners(pokemonArr);
//         }
//     }
//     hideSmallLoader();
//     isFinished = true;
// }


// /**
//  * Renders all Pokemon in the given pokemonArray into the preview container.
//  * @param {Array} pokemonArray Array of Pokemon objects
//  */
// function renderPokemonArr(pokemonArray) {
//     const pokemonPreviewContainer = document.getElementById('pokemon-preview-card-container');
//     pokemonPreviewContainer.innerHTML = '';

//     pokemonArray.forEach(pokemon => {
//         pokemonPreviewContainer.innerHTML += templates.pokemonCardTemp(pokemon);
//     });

//     if (!isFinished) showSmallLoader();
// }


// /**
//  * Renders the Pokemon details to the detail modal.
//  * @param {Pokemon} pokemon Pokemon object
//  */
// function renderModalDetails(pokemon) {
//     const modalHeader = document.getElementById('modal-header');
//     const modalTab1 = document.getElementById('tab1-content');
//     const modalTab2 = document.getElementById('tab2-content');

//     modalHeader.className = '';
//     modalHeader.classList.add('modal-header', `bg-${pokemon.color}`);
//     modalHeader.innerHTML = templates.detailModalHeaderTemp(pokemon);
//     modalTab1.innerHTML = templates.detailModalBodyAboutTemp(pokemon);
//     modalTab2.innerHTML = templates.detailModalBodyBaseStatsTemp(pokemon);
// }


// /**
//  * Filters the pokemonArr array with the given search term.
//  * @param {String} searchTerm Search term which is used to filter the Pokemon
//  */
// function filterPokemonArray(searchTerm) {
//     isFiltered = searchTerm ? true : false;

//     const filteredPokemon = pokemonArr.filter(pokemon => {
//         return pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
//     });
    
//     renderPokemonArr(filteredPokemon);
//     addCardEventListeners(filteredPokemon);
//     hideSmallLoader();
//     resetSearchBar();
// }


// /**
//  * Resets the input in the searchbar.
//  */
// function resetSearchBar() {
//     const searchBar = document.getElementById('search');

//     searchBar.value = '';
// }


// /**
//  * Adds the pokemon to the favorites list or removes it if it is already there.
//  * @param {Object} event Event object
//  * @param {Pokemon} pokemon Pokemon object
//  */
// function toggleFavoritePokemon(event, pokemon) {
//     if (!pokemon.isLiked) {
//         addPokemonToFavorite(event, pokemon);
//     } else {
//         removePokemonFromFavorite(event, pokemon);
//     }
// }


// /**
//  * Adds the pokemon to the favoritePokemon array.
//  * @param {Object} event Event object 
//  * @param {Pokemon} pokemon Pokemon object 
//  */
// function addPokemonToFavorite(event, pokemon) {
//     pokemon.isLiked = true;
//     event.target.src = `./assets/icons/favorite_white.svg`;

//     if (!favoritePokemon.includes(pokemon)) {
//         favoritePokemon.push(pokemon);
//     }

//     saveFavoritePokemon();
// }


// /**
//  * Removes the pokemon to the favoritePokemon array.
//  * @param {Object} event Event object 
//  * @param {Pokemon} pokemon Pokemon object 
//  */
// function removePokemonFromFavorite(event, pokemon) {
//     pokemon.isLiked = false;
//     event.target.src = `./assets/icons/favorite_border_white.svg`;

//     favoritePokemon.splice(favoritePokemon.indexOf(pokemon), 1);

//     saveFavoritePokemon();
// }


// /**
//  * Adds all the needed event listeners to the DOM.
//  * @param {Array} pokemonArr Array with Pokemon objects
//  */
// function addNeededEventListeners(pokemonArr) {
//     addCardEventListeners(pokemonArr);
//     addModalBackgroundEventListener();
//     addCloseIconEventListener();
//     addShowEventListener();
//     addSearchEventListener();
//     addFavoriteEventListener();
// }


// /**
//  * Adds the click event listener to each card to open the Pokemon details.
//  * @param {Array} pokemonArray Array of Pokemon objects
//  */
// function addCardEventListeners(pokemonArray) {
//     const cards = document.querySelectorAll('.pokemon-preview-card');

//     cards.forEach((card, index) => {
//         card.addEventListener('click', () => showDetailModal(pokemonArray[index].id));
//     });
// }


// /**
//  * Adds the click event listener to the background of the details modal to close the Pokemon details.
//  */
// function addModalBackgroundEventListener() {
//     const modalBackgroud = document.getElementById('modal-background');

//     modalBackgroud.addEventListener('click', hideDetailModal);
// }


// /**
//  * Adds the click event listener to the close icon of the detail modal to close the Pokemon details.
//  */
// function addCloseIconEventListener() {
//     const closeIcon = document.getElementById('close-icon');

//     closeIcon.addEventListener('click', hideDetailModal);
// }


// /**
//  * Adds the click event listener to the 'show all' button to render all Pokemon.
//  */
// function addShowEventListener() {
//     const showBtn = document.getElementById('show-all');

//     showBtn.addEventListener('click', () => {
//         renderPokemonArr(pokemonArr);
//         addCardEventListeners(pokemonArr);
//     });
// }


// /**
//  * Adds the change event listener to the searchbar to search Pokemon by pressing enter.
//  */
// function addSearchEventListener() {
//     const searchBar = document.getElementById('search');

//     searchBar.addEventListener('change', () => filterPokemonArray(searchBar.value));
// }


// /**
//  * Adds the click event listener to the favorite icon to render the favorite Pokemon.
//  */
//  function addFavoriteEventListener() {
//     const favorite = document.getElementById('favorite-pokemon');

//     favorite.addEventListener('click', () => {
//         renderPokemonArr(favoritePokemon);
//         addCardEventListeners(favoritePokemon);
//         hideSmallLoader();
//     });
// }
 

// /**
//  * Shows the Pokemon detail modal.
//  * @param {Number} pokemonId Id of the Pokemon to be displayed
//  */
// function showDetailModal(pokemonId) {
//     const body = document.getElementById('body');
//     const modal = document.getElementById('pokemon-detail-modal');
//     const pokemon = getPokemon(pokemonId);
    
//     body.classList.add('overflow-hidden');
//     renderModalDetails(pokemon);
//     modal.classList.remove('d-none');

//     const favoriteIcon = document.getElementById('modal-favorite');
//     favoriteIcon.addEventListener('click', (event) => toggleFavoritePokemon(event, pokemon));
// }


// /**
//  * Saves favorite Pokemon to local storage.
//  */
// function saveFavoritePokemon() {
//     localStorage.setItem('favPokemon', JSON.stringify(favoritePokemon));
// }


// /**
//  * Loafs favorite Pokemon from local storage.
//  */
// function loadFavoritePokemon() {
//     const loadedPokemonBatch = JSON.parse(localStorage.getItem('favPokemon'));

//     if (loadedPokemonBatch) favoritePokemon = loadedPokemonBatch;
// }


// /**
//  * Hides the Pokemon detail modal.
//  */
// function hideDetailModal() {
//     const body = document.getElementById('body');
//     const modal = document.getElementById('pokemon-detail-modal');

//     body.classList.remove('overflow-hidden');
//     modal.classList.add('d-none');
// }


// /**
//  * Hides the loader.
//  */
// function hideLoader() {
//     const loader = document.getElementById('loader');
//     const pokemonPreviewContainer = document.getElementById('pokemon-preview-card-container');

//     loader.classList.add('d-none');
//     pokemonPreviewContainer.classList.remove('d-none');
// }


// /**
//  * Shows the small-loader.
//  */
//  function showSmallLoader() {
//     const smallLoader = document.getElementById('small-loader');

//     smallLoader.classList.remove('d-none');
// }


// /**
//  * Hides the small-loader.
//  */
//  function hideSmallLoader() {
//     const smallLoader = document.getElementById('small-loader');

//     smallLoader.classList.add('d-none');
// }


// /**
//  * Renders a error message to the pokemonPreviewContainer if an error occurs while fetching data from the API.
//  */
// function renderErrorMessage() {
//     const pokemonPreviewContainer = document.getElementById('pokemon-preview-card-container');
//     pokemonPreviewContainer.innerHTML = '';

//     pokemonPreviewContainer.innerHTML = templates.errorTemp();
// }


// init();