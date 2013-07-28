/**
 * The object used to create card decks. The actual deck is represented as a Pile object.
 * @author Rajitha Wannigama
 */
var Deck = {
    /**
     * The allowed card ranks. 0 = Ten, w = Joker, b = Blank card, everything else is normal.
     * @public
     * @type {Array}
     */
    ranks: ['2','3','4','5','6','7','8','9','0','j','q','k','a','w','b'],
    /**
     * The allowed suits.
     * @public
     * @type {Array}
     */
    suits: ['c','h','s','d'],
    /**
     * Create a new deck of cards. Default behaviour is to create a standard 52-card deck (no jokers), in new deck
     * order (same as a standard Bicycle deck).
     * @constructor
     * @this {Deck}
     * @param {Object} [options]
     *      Possible options: Jokers included? If so, 2 or 4?
     * @returns {Pile}
     */
    create: function(options) {
        if ( typeof options === 'undefined' ) {
            var cards = 'ah2h3h4h5h6h7h8h9h0hjhqhkh' +
                'ac2c3c4c5c6c7c8c9c0cjcqckc' +
                'kdqdjd0d9d8d7d6d5d4d3d2dad' +
                'ksqsjs0s9s8s7s6s5s4s3s2sas';
            return this.create_from_string(cards);
            //'wc,wd'
        }
        var c, i, j, t, pile;
        var ranks = ['2','3','4','5','6','7','8','9','0','j','q','k','a','w'];
        var suits = ['c','h','s','d'];
        
        t = typeof options;
        if ( t == 'string' ) {
            switch (t) {
                case 'red':
                    break;
                case 'black':
                    break;
                case 'face':
                case 'court':
                    ranks = ['j','q','k','a'];
                    break;
                case 'standard':
                case 'nojokers':
                    ranks = ['2','3','4','5','6','7','8','9','0','j','q','k','a'];
                    break;
                default:
                    break;
            }
        }
        
        // Create the deck using two arrays: ranks and suits
        pile = Pile.create();
        for ( i = 0; i < ranks.length; i++ ) {
            for ( j = 0; j < suits.length; j++ ) {
                // Get the value of the card. e.g. '2c'.
                c = ranks[i] + suits[j];
                pile.add( Card.create(c) );
            }
        }
        
        // Create the deck using a string that defines all cards exactly, in order
        return pile;
    },
    /**
     * Create a deck (or pile) of cards from a string representation of the deck.
     * @private
     * @param {String} str the string representation of all the cards needed.
     * @returns {Array} of cards.Pile objects.
     */
    create_from_string: function(str) {
        if ( typeof str !== 'string' ) {
            // @TODO display warning
            return [];
        }
        if ( (str.length % 2) != 0 ) {
            // String must have even length, since each card is represented by two characters.
            // @TODO display warning
            return [];
        }
        var i, c;
        var pile = Pile.create();
        for ( i = 0; i < str.length; i += 2 ) {
            // Get the card in string form
            c = str[i] + str[i+1];
            // Create the Card object
            pile.add( Card.create(c) );
        }
        return pile;
    },
    /**
     * Create a list of cards from a regular expression.
     * Goes through all available cards (including the blank card) in string form and applies the given regular
     * expression. If the card matches the expression, it is used in the deck.
     * @private
     * @param {Object #<RegExp>} r the regular expression to be applied to all cards available.
     * @param {Array} cards
     * @returns {Array}
     */
    create_from_regex: function(r, cards) {
        if ( r instanceof RegExp ) {
            r.test();
        }
        else {
            // r is not a regular expression
            // @TODO Throw Exception or Show warning and return empty array?
        }
    }
};
