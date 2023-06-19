'use strict';

import { pokemonCardTemp, pokemonDialogHeadTemp } from "./templates.js";
import { replaceUnicodeCharacter } from "./utilities.js";


const pokemonDataUrl = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonSpeciesUrl = 'https://pokeapi.co/api/v2/pokemon-species/';
let nextListUrl = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemonBatch = [];
let allPokemon = [];
let favoritePokemonIds = [];
let favoritePokemon = [];
let searchedPokemon = [];
let isRenderedFavorite = false;


/**
 * Intersection observer that gets triggered 250px before the last card scrolls into view.
 */
const lastCardObserver = new IntersectionObserver(
    entries => {
        const lastCard = entries[0];

        if (!lastCard.isIntersecting) return;
        lastCardObserver.unobserve(lastCard.target);
        showLoader();
        renderNextBatch();
    }, { rootMargin: '250px' }
);

/**
 * Initial function that gets executed after the page has loaded.
 */
async function init() {
    loadFavoritePokemon();
    renderNextBatch();
    addLoadAllEventListener();
    addLoadFavEventListener();
    addCloseModalEventListener();
    addSearchbarEventListener();
}

/**
 * Adds a click event listener to every card to open the modal on click.
 * @param {array} dataList List of Pokemon objects.
 */
function addCardEventlistener(dataList) {
    const cards = document.querySelectorAll('.pokemon-card');

    cards.forEach(card => {
        card.addEventListener('click', event => {
            const pokemonId = event.currentTarget.dataset.id;
            const pokemon = findPokemon(pokemonId, dataList);

            displayModal(pokemon);
        });
    });
}

/**
 * Add a click event listener to the logo container to load all Pokemon.
 */
function addLoadAllEventListener() {
    const logoContainerEl = document.getElementById('logo-container');

    logoContainerEl.addEventListener('click', async () => {
        isRenderedFavorite = false;
        clearHTMLContainer();
        resetNextListUrl();
        renderNextBatch();
    });
}

/**
 * Add a click event listener to the favorite icon to load all favorite Pokemon.
 */
function addLoadFavEventListener() {
    const loadFavEl = document.getElementById('load-fav');

    loadFavEl.addEventListener('click', async () => {
        isRenderedFavorite = true
        clearHTMLContainer();
        await renderPokemonList(favoritePokemonIds, favoritePokemon);
        addCardEventlistener(favoritePokemon);
        hideLoader();
    });
}

/**
 * Add the onKeyDown event listener to the search bar. On enter all Pokemon are searched.
 */
function addSearchbarEventListener() {
    const searchbarEl = document.getElementById('search');

    searchbarEl.addEventListener('keydown', event => {
        const searchQery = (event.target.value).trim().toLowerCase();

        if (event.key === 'Enter' && searchQery.length > 0) {
            event.target.value = '';
            searchPokemon(searchQery);
        };
    })
}

/**
 * Add a click event listener to the modal close button.
 */
function addCloseModalEventListener() {
    const closeBtn = document.getElementById('close');

    closeBtn.addEventListener('click', () => closeModal());
}

/**
 * Fetches a list of Pokemon based on the nextListUrl variable. Sets the nextListUrl variable
 * with the new offset after fetching.
 * @returns Array of simple Pokemon information (name, url).
 */
async function fetchPokemonList() {
    const pokemonList = await fetch(nextListUrl).then(response => response.json());
    nextListUrl = pokemonList.next;

    return pokemonList.results;
}

/**
 * Fetches the data of a Pokemon from the given PokeApi endpoint.
 * @param {string} url Enpoint of the PokeApi.
 * @param {string | number} name Name or number of the Pokemon.
 * @returns 
 */
async function fetchPokemonData(url, name) {
    return await fetch(url + name).then(response => response.json());
}

/**
 * Iterates over the rawList array, fetches the data from the pokemon,
 * stores it in the dataArray and renders the HTML into the card container.
 * @param {array} rawList List of numbers or names of Pokemon.
 * @param {array} dataList List where the pokemon objects should be stored.
 */
async function renderPokemonList(rawList, dataList) {
    const containerEl = document.getElementById('pokemon-container');
    let cachedHTML = '';

    for (let pokemon of rawList) {
        let identifier = pokemon.name ? pokemon.name : pokemon;
        let pokemonObj, data, species;

        try {
            [data, species] = await fetchDataAndSpecies(identifier);
        } catch (err) {
            console.warn('Could not fetch data for pokemon: ', identifier);
            identifier = pokemon.url.split('/')[6];
            console.warn('Fetching again with ID: ', identifier);

            try {
                [data, species] = await fetchDataAndSpecies(identifier);
            } catch (err) {
                console.error(`Second fetch was not successfull! Pokemon with id ${identifier} is skipped!`)
                continue;
            }

        }
        pokemonObj = createPokemon(data, species);
        dataList.push(pokemonObj);
        cachedHTML += pokemonCardTemp(pokemonObj);
    }
    containerEl.innerHTML += cachedHTML;
}

/**
 * Fetches the Pokemon data and species simultaneously.
 * @param {string | number} identifier Name or number of the Pokemon.
 * @returns Promise[].
 */
async function fetchDataAndSpecies(identifier) {
    return await Promise.all([
        fetchPokemonData(pokemonDataUrl, identifier),
        fetchPokemonData(pokemonSpeciesUrl, identifier)
    ]);
}

/**
 * Renders the next batch of pokemon based on the info in the query paramter of the nextListUrl variable.
 */
async function renderNextBatch() {
    loadedPokemonBatch = await fetchPokemonList();
    await renderPokemonList(loadedPokemonBatch, allPokemon);
    hideLoader();
    addCardEventlistener(allPokemon);
    lastCardObserver.observe(document.querySelector('pokemon-card:last-child'));
}

/**
 * Searches all Pokemon up to the 8th generation if the search query is contained in the name.
 * @param {string} searchQery Search query.
 */
async function searchPokemon(searchQery) {
    showLoader();
    const url = 'https://pokeapi.co/api/v2/pokemon/?limit=905';
    const pokemonList = await fetch(url).then(response => response.json());
    const searchResult = pokemonList.results.filter(pokemon => pokemon.name.includes(searchQery));
    const filteredResult = searchResult.filter(pokemon => !pokemon.name.includes("-mega") && !pokemon.name.includes("-gmax"));

    clearHTMLContainer();
    while (filteredResult.length !== 0) {
        await renderPokemonList(filteredResult.splice(0, 5), searchedPokemon);
    }
    addCardEventlistener(searchedPokemon);
    hideLoader();
}

/**
 * Clears the Pokemon card container element.
 */
function clearHTMLContainer() {
    const containerEl = document.getElementById('pokemon-container');

    containerEl.innerHTML = '';
}

/**
 * Resets the nextListUrl to the original one.
 */
function resetNextListUrl() {
    nextListUrl = 'https://pokeapi.co/api/v2/pokemon/';
}

/**
 * Creates a Pokemon object from the data and species information from the API.
 * @param {object} data Data object from the pokemon endpoint.
 * @param {object} species Data object from the species endpoint.
 * @returns 
 */
function createPokemon(data, species) {
    const spriteFrontDefault = data.sprites.other.dream_world.front_default;
    return {
        id: data.id,
        name: data.name,
        sprite: spriteFrontDefault ? spriteFrontDefault : '../assets/img/questionmark.svg',
        height: data.height,
        weight: data.weight,
        color: species.color.name,
        habitat: species.habitat?.name,
        types: getPokemonTypes(data),
        stats: getStats(data),
        genera: getGenera(species),
        description: getDescription(species)
    }
}

/**
 * Extracts the stats from the Pokemon data object.
 * @param {object} data Data object from the pokemon endpoint.
 * @returns Array of Pokemon stats.
 */
function getStats(data) {
    let stats = [];

    data.stats.forEach(({ base_stat, stat }) => {
        stats.push(base_stat);
    })

    return stats;
}

/**
 * Extracts the types from the Pokemon data object.
 * @param {object} data Data object from the pokemon endpoint.
 * @returns Array of Pokemon types.
 */
function getPokemonTypes(data) {
    let types = [];

    data.types.forEach(type => {
        types.push(type.type.name);
    });

    return types;
}

/**
 * Extracts the genera from the Pokemon species object.
 * @param {object} data species object from the pokemon endpoint.
 * @returns Genera of the Pokemon.
 */
function getGenera(species) {
    const genus = species.genera.find(genus => genus.language.name === 'en');
    return genus.genus;
}

/**
 * Extracts the description from the Pokemon species object.
 * @param {object} data species object from the pokemon endpoint.
 * @returns Description of the Pokemon.
 */
function getDescription(species) {
    const description = species.flavor_text_entries.find(text => text.language.name === 'en');
    return replaceUnicodeCharacter(description.flavor_text);
}

/**
 * Finds a Pokemon by Id in the given list.
 * @param {number} pokemonId Id of the searched Pokemon.
 * @param {array} dataList Array of Pokemon objects.
 * @returns Object of the searched Pokemon if in the list.
 */
function findPokemon(pokemonId, dataList) {
    return dataList.find(pokemon => pokemon.id == pokemonId);
}

/**
 * Opens the modal and renders the information of the given Pokemon.
 * @param {object} pokemon Object of the Pokemon that should be displayed.
 */
function displayModal(pokemon) {
    const modalEl = document.getElementById('dialog');

    renderModalHead(pokemon);
    setPokemonImage(pokemon);
    setAbout(pokemon);
    setBaseStats(pokemon);
    setBaseStatsProgress(pokemon);
    setFavoriteIconEventListener(pokemon);
    if (favoritePokemonIds.includes(pokemon.id)) setFavoriteIconImage(true);
    modalEl.className = `bg-${pokemon.color}`;
    modalEl.showModal();
}

/**
 * Renders the head of the modal.
 * @param {object} pokemon Object of the Pokemon.
 */
function renderModalHead(pokemon) {
    const modalHeadEl = document.getElementById('modal-head');

    modalHeadEl.innerHTML = pokemonDialogHeadTemp(pokemon);
}

/**
 * Sets the image of the given Pokemon in the modal.
 * @param {object} pokemon Object of the Pokemon.
 */
function setPokemonImage(pokemon) {
    const pokemonImageEl = document.getElementById('modal-pokemon');

    pokemonImageEl.src = pokemon.sprite;
}

/**
 * Sets the information of the about tab of the modal.
 * @param {object} pokemon Object of the Pokemon.
 */
function setAbout(pokemon) {
    const aboutInfo = ['description', 'habitat', 'height', 'weight'];

    aboutInfo.forEach(info => {
        const infoEl = document.getElementById(info);
        const infoText = info === 'habitat' ? `Habitat: ${pokemon[info]}` : pokemon[info];

        infoEl.textContent = infoText;
    });
}

/**
 * Sets the base stats of the stats tab of the modal.
 * @param {object} pokemon Object of the Pokemon.
 */
function setBaseStats(pokemon) {
    const stats = ['hp', 'attack', 'defence', 'special-attack', 'special-defence', 'speed'];

    stats.forEach((stat, index) => {
        const statEl = document.getElementById(stat);
        statEl.textContent = pokemon.stats[index];
    })
}

/**
 * Sets the progress of the base stats of the stats tab.
 * @param {object} pokemon Object of the Pokemon.
 */
function setBaseStatsProgress(pokemon) {
    const statsProgress = ['hp-progress', 'attack-progress', 'defence-progress', 'special-attack-progress', 'special-defence-progress', 'speed-progress'];
    const conversionFactor = 1.6;

    statsProgress.forEach((progress, index) => {
        const progressEl = document.getElementById(progress);
        progressEl.style.width = `${(pokemon.stats[index] / conversionFactor).toFixed(2)}%`;;
    })
}

/**
 * Set an event listener to be able to favorite the Pokemon.
 * @param {object} pokemon Object of the Pokemon.
 */
function setFavoriteIconEventListener(pokemon) {
    const favoriteEl = document.getElementById('favorite');

    favoriteEl.addEventListener('click', () => toggleFavoritePokemon(pokemon));
}

/**
 * Toggles whether the Pokemon is favored or not.
 * @param {object} pokemon Object of the Pokemon.
 */
async function toggleFavoritePokemon(pokemon) {
    if (!favoritePokemonIds.includes(pokemon.id)) {
        favoritePokemonIds.push(pokemon.id);
        setFavoriteIconImage(true);
    } else {
        const index = favoritePokemonIds.indexOf(pokemon.id);
        favoritePokemonIds.splice(index, 1);
        setFavoriteIconImage(false);
    }
    saveFavoritePokemon();
    if (isRenderedFavorite === true) {
        clearHTMLContainer();
        await renderPokemonList(favoritePokemonIds, favoritePokemon);
        addCardEventlistener(favoritePokemon);
        hideLoader();
    }
}

/**
 * Sets the image of the favorite icon in the modal whether the Pokemon is favored.
 * @param {boolean} isLiked Status whether the Pokemon is favored.
 */
function setFavoriteIconImage(isLiked) {
    const favoriteEl = document.getElementById('favorite');

    if (isLiked) {
        favoriteEl.src = "./assets/icons/favorite_white.svg";
    } else {
        favoriteEl.src = "./assets/icons/favorite_border_white.svg";
    }
}

/**
 * Close the Pokemon details modal.
 */
function closeModal() {
    const modalEl = document.getElementById('dialog');

    modalEl.close();
}

/**
 * Shows the pokeball loader.
 */
function showLoader() {
    const loaderEl = document.getElementById('loader');

    loaderEl.style.display = "flex";
}

/**
 * Hides the pokeball loader.
 */
function hideLoader() {
    const loaderEl = document.getElementById('loader');

    loaderEl.style.display = "none";
}

/**
 * Saves the favorite Pokemon to the local storage.
 */
function saveFavoritePokemon() {
    favoritePokemonIds.sort((a, b) => a - b);
    localStorage.setItem('fav-pokemon', JSON.stringify(favoritePokemonIds));
}

/**
 * Loads the favorite Pokemon from the local storage.
 */
function loadFavoritePokemon() {
    const loadedPokemon = localStorage.getItem('fav-pokemon');

    if (loadedPokemon) {
        favoritePokemonIds = JSON.parse(loadedPokemon);
    }
}


init();