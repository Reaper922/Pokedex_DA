/**
 * Helper class which provides usefull funktionality.
 * @class
 */
 export class Helper {
    /**
     * Capitalizes the first character of a string.
     * @param {String} string Input string
     * @returns Modified string
     */
    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    /**
     * Replaces unicode character in a string.
     * @param {String} string Input string
     * @returns Modified string
     */
    static replaceUnicodeCharacte(string) {
        return string.replace('\u000c', " ").replace('\n', " ");
    }
}