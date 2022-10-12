import { Helper } from './helper.js';

/**
 * Pokemon class which stores the relevant information from the API.
 * @class
 */
export class Pokemon {
    /**
     * Creates a new Pokemon Objekt.
     * @constructor
     * @param {Object} pokemonData Object with the fetched Pokemon data
     * @param {Object} pokemonSpecies Object with the fetched Pokemon species data
     */
    constructor(pokemonData, pokemonSpecies) {
        this.id = pokemonData.id
        this.name = Helper.capitalizeFirstLetter(pokemonData.name);
        this.types = pokemonData.types;
        this.height = pokemonData.height;
        this.weight = pokemonData.weight;
        this.moves = pokemonData.moves;
        this.stats = pokemonData.stats;
        this.sprite = pokemonData.sprites.other.dream_world.front_default;
        this.color = pokemonSpecies.color.name;
        this.genera = pokemonSpecies.genera[7].genus;
        this.habitat = pokemonSpecies.habitat.name;
        this.text = Helper.replaceUnicodeCharacte(pokemonSpecies.flavor_text_entries[1].flavor_text);
    }
}