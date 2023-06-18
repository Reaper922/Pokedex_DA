'use strict';

/**
 * Capitalizes the first character of a string.
 * @param {String} string Input string.
 * @returns String with first character capitalized.
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 
 * @param {string} num String of a number.
 * @param {number} totalLength Length of the string that should be returned.
 * @returns String with added leading zeros.
 */
export function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}

/**
 * Replaces unicode character in a string.
 * @param {String} string Input string.
 * @returns String witout \n or \u000c characters.
 */
export function replaceUnicodeCharacter(string) {
    return string.replace('\n', ' ').replace('\u000c', ' ');
}