/**
 * Represents the suit of a card.
 * @author Rajitha Wannigama
 */
var Suit = {
    /**
     * @type {String}
     * @private
     */
    value: undefined,
    
    /**
     * Create a new Suit. Must use this function instead of Object.create(Suit) to create a 
     * suit.
     * @constructor
     * @this {Suit}
     * @param {String} value 'c', 'h', 's' or 'd'. Case does not matter. '0' is used for a blank card.
     * @returns {Suit}
     * @throws {Error}
     */
    create: function(value) {
        if ( typeof value != 'string' ) {
            throw new Error('cards.Suit.create: value must be a string! value = ' + value);
        }
        // The four suits.
        var suits = Deck.suits;
        // The object we are creating (cards.Suit).
        var obj;
        // We want to allow people to use either C or c for clubs.
        value = value.toLowerCase();
        if ( suits.indexOf(value) == -1 ) {
            throw new Error('cards.Suit.create: Invalid value for a suit. value = ' + value);
        }
        obj = Object.create(this);
        obj.value = value;
        return obj;
    },
    /**
     * Get the HTML representation of this Suit.
     * @param {Object} [options]
     * @returns {String|undefined} An undefined value will only be returned if this object
     * was created without using the cards.Suit.create() function.
     */
    html: function(options) {
        var html_ent = {
            c: '&clubs;',
            h: '&hearts;',
            s: '&spades;',
            d: '&diams;'
        };
        return html_ent[this.value];
    }
};
