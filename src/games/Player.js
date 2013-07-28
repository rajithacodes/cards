/**
 * Represents a player in a card game.
 */
var Player = {
    /**
     * The name of the player.
     * @private
     * @type {String}
     */
    name: undefined,
    /**
     * A list of card piles that belong to this player.
     * @private
     * @type {Array} array of Pile objects.
     */
    piles: undefined,
    /**
     * Create a new player.
     * @constructor
     * @name {String} name the name of the player
     * @returns {Player}
     */
    create: function(name) {
        var p = Object.create(this);
        p.name = name;
        return p;
    },
    /**
     * Check if a player has a card that matches the given pattern.
     * Can be an exact card or a condition. e.g. Two of Clubs or "A red card".
     * 
     * This function basically iterates through all the cards in a Pile and checks for a match
     * for the regular expression passed.
     * @param {RegExp} rx a regular expression that represents the card(s) to check for.
     * @param {Boolean} checkall by defaults its false so only the first Pile is checked.
     * @returns {Boolean} true if a card exists that match the pattern.
     */
    hasCard: function(rx, checkall) {
        checkall = checkall || false;
        
    }
};
