'use strict';

/**
 * Capitalizes the first character of a string.
 * @param {String} string Input string
 * @returns Modified string
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}


// /**
//  * Replaces unicode character in a string.
//  * @param {String} string Input string
//  * @returns Modified string
//  */
export function replaceUnicodeCharacter(string) {
    return string.replace('\n', ' ').replace('\u000c', ' ');
}