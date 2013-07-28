/**
 * The main closure.
 * This is optional.
 * Can use this file to specify special behaviour to use the external_name
 * as a function as well as a package.
 * @version 0.1.0
 * @author Rajitha Wannigama
 */

/**
 * Keep track of the old property in the window object that our closure will
 * replace, in case of conflict.
 */
var _cjs = window['cjs'];

/**
 * The main closure function.
 */
var main;

main = function() {}

main.noConflict = function() {
    // Only replace with the previous value if the current value is this library.
    if ( window['cjs'] === main ) {
        window['cjs'] = _cjs;
    }
    return main;
}

/**
 * To use on body's onload attribute.
 */
main.init = function() {
    //alert('main.init() done.');
}

// Globals used in all packages
var document = window.document;
var session = window.sessionStorage;
var local = window.localStorage;

// Globals used in the {cards} package
// NONE for now
