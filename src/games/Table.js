/**
 * Represents a table at a card game.
 */
var Table = {
    /**
     * The number of players in the table.
     * @private
     * @type {Number}
     */
    size: undefined,
    /**
     * An array that stores the players and their locations on the table.
     * @private
     * @type {Array}
     */
    players: undefined,
    /**
     * A table can contain many piles that do not belong to players. For example, the center pile
     * in trick taking games.
     * @type {Array}
     */
    piles: undefined,
    /**
     * 
     * @constructor
     * @returns {Table}
     */
    create: function(size) {
        
    },
    /**
     * Get the player at the given position.
     * @param {Number} pos the position on the table
     * @returns {Player} the player at the given position
     * @throws {Exception} if the position given is out of range.
     */
    getPlayerAt: function(pos) {
        if ( (pos < 0) || (pos >= this.players.length) ) {
            throw new Exception('Table.getPlayerAt: position given is out of range: ' + pos);
        }
        else {
            return this.players[pos];
        }
    }
};
