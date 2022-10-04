/**
 * Pokemon class which stores the relevant information from the API.
 * @class
 */
class Pokemon {
    /**
     * Creates a new Pokemon Objekt.
     * @param {Object} pokemonData Object with the fetched Pokemon data
     * @param {Object} pokemonSpecies Object with the fetched Pokemon species data
     */
    constructor(pokemonData, pokemonSpecies) {
        this.id = pokemonData.id
        this.name = pokemonData.name;
        this.types = pokemonData.types;
        this.sprite = pokemonData.sprites.other.dream_world.front_default;
        this.color = pokemonSpecies.color.name;
    }
}

export default Pokemon;