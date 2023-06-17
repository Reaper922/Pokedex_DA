'use strict';

import { pokemonCardTemp, pokemonDialogHeadTemp } from "./templates.js";
import { replaceUnicodeCharacter } from "./utilities.js";


const pokemonDataUrl = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonSpeciesUrl = 'https://pokeapi.co/api/v2/pokemon-species/';
let nextListUrl = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemonBatch = [];
let allPokemon = [];
let favoritePokemonIds = [];
let favoritePokemon = []


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
    }, {rootMargin: '250px'}
);

/**
 * Initial function that gets executed after the page loads.
 */
async function init() {
    loadFavoritePokemon();
    renderNextBatch();
    document.getElementById('close').addEventListener('click', () => {closeModal()});
    // document.getElementById('logo-container').addEventListener('click', () => renderPokemonList(loadedPokemonBatch, allPokemon));
    // document.getElementById('load-fav').addEventListener('click', () => renderPokemonList(favoritePokemonIds, favoritePokemon));
}

/**
 * Adds a click event listener to every card to open the modal on click.
 */
function addCardEventlistener() {
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
    await renderPokemonList();
    hideLoader();
    addCardEventlistener();
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


async function renderPokemonList() {
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
    if (favoritePokemonIds.includes(pokemon.id)) setFavoriteIconImage(true);
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
    if (!favoritePokemonIds.includes(pokemon.id)) {
        favoritePokemonIds.push(pokemon.id);
        setFavoriteIconImage(true);
    } else {
        const index = favoritePokemonIds.indexOf(pokemon.id);
        favoritePokemonIds.splice(index, 1);
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
    localStorage.setItem('fav-pokemon', JSON.stringify(favoritePokemonIds));
}


function loadFavoritePokemon() {
    const loadedPokemon = localStorage.getItem('fav-pokemon');

    if (loadedPokemon) {
        favoritePokemonIds = JSON.parse(loadedPokemon);
    }
}


init();