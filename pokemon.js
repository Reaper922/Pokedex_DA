/**
 * Pokemon class which stores the relevant information from the API.
 * @class
 */
class Pokemon {
    /**
     * Creates a new Pokemon Objekt.
     * @constructor
     * @param {Object} pokemonData Object with the fetched Pokemon data
     * @param {Object} pokemonSpecies Object with the fetched Pokemon species data
     */
    constructor(pokemonData, pokemonSpecies) {
        this.id = pokemonData.id
        this.name = this.capitalizeFirstLetter(pokemonData.name);
        this.types = pokemonData.types;
        this.height = pokemonData.height;
        this.weight = pokemonData.weight;
        this.abilities = pokemonData.abilities;
        this.moves = pokemonData.moves;
        this.stats = pokemonData.stats;
        this.sprite = pokemonData.sprites.other.dream_world.front_default;
        this.color = pokemonSpecies.color.name;
        this.genera = pokemonSpecies.genera[7].genus;
        this.habitat = pokemonSpecies.habitat.name;
        this.area = pokemonSpecies.pal_park_encounters[0].area.name;
        this.text = pokemonSpecies.flavor_text_entries[1].flavor_text.replace('\u000c', " ").replace('\n', "");
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
}

export default Pokemon;