/**
 * Represents the rank of a card.
 * @author Rajitha Wannigama
 */
var Rank = {
    /**
     * @type {String}
     * @private
     */
    value: undefined,
    /**
     * Create a new rank. Must use this function over Object.create(Rank).
     * @constructor
     * @this {Rank}
     * @param {String|Number} value '2','3','4','5','6','7','8','9','0','j','q','k','a','w','0'. Case does
     * not matter.
     * @returns {Rank}
     * @throws {Error}
     */
    create: function(value) {
        // The ranks in a card deck. 'W' stands for Joker.
        var ranks = Deck.ranks;
        // The cards.Rank object.
        var obj;
        // If its a number, get the string version. If its a string, make sure its
        // lower case.
        if ( typeof value == 'number' ) {
            value = '' + value;
        }
        else if ( typeof value == 'string' ) {
            value = value.toLowerCase();
        }
        else {
            // Any other type is not accepted.
            throw new Error('cards.Rank.create: Invalid value for a rank. value = ' + value);
        }
        
        if ( ranks.indexOf(value) == -1 ) {
            throw new Error('cards.Rank.create: Invalid value for a rank. value = ' + value);
        }
        
        obj = Object.create(this);
        obj.value = value;
        return obj;
    },
    /**
     * Get the HTML code for this rank.
     * @param {Object} [options]
     * @returns {String|undefined} An undefined value will only be returned if this object
     * was created without using the cards.Rank.create() function.
     */
    html: function(options) {
        return (this.value == '0') ? '10' : this.value.toUpperCase();
    }
};
