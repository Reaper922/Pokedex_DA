/**
 * Pokemon class which stores all the relevant information from the API.
 */
class Pokemon {
    constructor(pokemonData, pokemonSpecies) {
        this.id = pokemonData.id
        this.name = pokemonData.name;
        this.types = pokemonData.types;
        this.sprite = pokemonData.sprites.other.dream_world.front_default;
        this.color = pokemonSpecies.color.name;
    }
}

export default Pokemon;