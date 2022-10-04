class Pokemon {
    constructor(pokemonObj) {
        this.id = pokemonObj.id
        this.name = pokemonObj.name;
        this.types = pokemonObj.types;
        this.sprite = pokemonObj.sprites.other.dream_world.front_default;
    }
}

export default Pokemon;