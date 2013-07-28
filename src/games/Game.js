/**
 * Represents a typical turn-based card game.
 * @author Rajitha Wannigama
 */
var Game = {
    players: undefined,
    table: undefined,
    /**
     * The player who's current turn it is.
     * @private
     * @type {Player}
     */
    turn: undefined,
    /**
     * The deck to use for this game.
     * @protected
     * @type {cards.Pile}
     */
    deck: undefined,
    
    // --- METHODS ---
    /**
     * 
     * @param {Array} players the names of the players.
     * e.g. ["Homer","Bart","Marge","Lisa"]
     * @param {Boolean} direction the direction to place the players on the table.
     * true for clockwise, false for anti-clockwise.
     */
    create: function(players, direction) {
        var game = Object.create(this);
        game.players = [];
        
        // if players is a number, randomly choose names
        // if players is an array of strings, use those as the names
        if ( Array.isArray(players) ) {
            
        }
        else if ( typeof players === 'number' ) {
        }
        else {
            // invalid argument
        }
        
        var i;
        // Create the players
        for ( i = 0; i < players.length; i++ ) {
            game.players.push( Player.create(players[i]) );
        }
    },
    /**
     * Make a move.
     * @param {Player} player
     * @param {} move
     * @returns {} 
     */
    play: function(player, move) {
        if ( player === this.turn ) {
            // Check if the move is valid
            // If the trick is over, winner of the trick starts next
            if ( this.isValidMove(move) ) {
                
            }
        }
        else {
            // Not this player's turn
        }
    },
    /**
     * An abstract function that is to be replaced by game objects that use this
     * object as a prototype.
     * @param {Player} player
     * @param {Card} move 
     * @returns {Boolean} 
     */
    isValidMove: function(player, move) {
        return false;
    }
};
