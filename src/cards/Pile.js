/**
 * A pile of cards. A card deck is a Pile of cards.
 * Indexes:
 *      Positive index: Starts from the top of the deck, when the deck is face DOWN. 0 = top card.
 *                      Starts from the bottom of the deck, when the deck is face UP. 0 = bottom card.
 *      Negative index: Starts from the bottom of the the deck, when the deck is face DOWN. -1 = bottom card.
 *                      Starts from the top of the deck, when the deck is face UP. -1 = top card.
 * @author Rajitha Wannigama
 */
var Pile = {
    /**
     * The list of cards in this pile, using cards.Card objects to represent a card.
     * @private
     * @type {Array}
     */
    cards: undefined,
    /**
     * The list of cards in this pile, using the string representation rather than using
     * cards.Card objects.
     * @private
     * @type {Array}
     */
    cards_str: undefined,
    
    // UI stuff
    /**
     * If this Pile is selectable as a whole, this is set to true.
     * @private
     * @type {Boolean}
     */
    is_selectable: false,
    /**
     * The function to execute when the pile is selected.
     * @private
     * @type {Function}
     */
    on_select: undefined,
    
    // methods
    /**
     * Create a new Pile of cards.
     * @constructor
     * @this {Pile}
     * @param {...Pile} a list of Pile objects used to create this new Pile, in the order
     * needed.
     * @returns {Pile}
     * @throws {Error}
     */
    create: function() {
        if ( arguments.length == 0 ) {
            // Create an empty Pile
            var obj = Object.create(this);
            obj.cards = [];
            return obj;
        }
        else {
            // Create a new Pile from a bunch of piles.
            var i, j;
            var pile = Object.create(this);
            pile.cards = [];
            for (i = 0; i < arguments.length; i++) {
                if ( !this.isPile(arguments[i]) ) {
                    // Error, this is not a Pile object!
                    throw Error('cards.Pile.create: Argument ' + i + ' is not a cards.Pile object. arguments[' + i + '] = ' + arguments[i]);
                }
                // Add the cards from this pile (arguments[i]) to the end of our new pile
                pile.cards = pile.cards.concat(arguments[i].cards);
            }
            return pile;
        }
    },
    /**
     * Add a Card or an array of Cards.
     * @param {cards.Card|Array} c
     * @returns {cards.Pile} this Pile object for method chaining.
     */
    add: function(c) {
        if ( Array.isArray(c) ) {
        }
        else if ( this.isPile(c) ) {
            
        }
        else {
            this.cards.push(c);
            return this;
        }
    },
    /**
     * Check if an object is a Pile object.
     * @param {Object} the object to check
     * @returns {Boolean} true if the parameter is a cards.Pile object.
     */
    isPile: function(obj) {
        return (typeof obj === 'object') && (Array.isArray(obj.cards));
    },
    /**
     * 
     * @param {Object} [options]
     * @returns {Object #<HTMLDivElement>}
     * @throws {Error}
     */
    html: function(options) {
        // Default options
        var def_options = {
            faceup: true, // or false for facedown
            display: 'stack', // or 'spread' or 'fan' (spread in an arc)
            direction: 'LR', // LR = left to right, RL = right to left
            /* 
             * For display: 'spread':
             * 'normal' - normal spread with just the card rank and suit shown
             * 'full' - show each card in full
             * 'half' - show half of each card
             * <css-unit> - space each card using the CSS measurement. e.g. '10px' applies 10px
             *              of spacing between each card.
             */
            spacing: 'normal'
            
        };
        if ( typeof options !== 'undefined' ) {
            // Parse options
            if ( typeof options.faceup !== 'undefined' ) {
                // Using !! to make sure its a boolean value
                def_options.faceup = !!options.faceup;
            }
            if ( typeof options.display !== 'undefined' ) {
                if ( /^(stack|spread)$/.test(options.display) ) {
                    def_options.display = options.display;
                }
                else {
                    throw new Error('cards.Pile.html: invalid value for option "display": ' + options.display);
                }
            }
            if ( typeof options.direction !== 'undefined' ) {
                if ( /^(LR|RL)$/.test(options.direction) ) {
                    def_options.direction = options.direction;
                }
                else {
                    throw new Error('cards.Pile.html: invalid value for option "direction": ' + options.direction);
                }
            }
            if ( typeof options.spacing !== 'undefined' ) {
                // @TODO Add support for CSS units
                if ( /^(normal|full|half)$/.test(options.direction) ) {
                    def_options.direction = options.direction;
                }
                else {
                    throw new Error('cards.Pile.html: invalid value for option "direction": ' + options.direction);
                }
            }
        }
        
        var div = document.createElement('div');
        var c;
        var c_width = parseInt((this.cards[0].html()).style.width, 10);
        var c_height = parseInt((this.cards[0].html()).style.height, 10);
        var spacing = 34;
        for (var i = 0; i < this.cards.length; i++) {
            c = this.cards[i].html({faceup: def_options.faceup});
            c.style.position = 'absolute';
            c.style.left = (i*spacing) + 'px';
            div.appendChild(c);
        }
        
        c_width += 2;
        div.style.position = 'relative';
        div.style.width = '' + ( ( spacing * (this.cards.length-1) ) + c_width ) + 'px';
        div.style.height = c_height + 'px';
        div.style.zIndex = '2';
        return div;
    },
    /**
     * Deal cards from this pile, one at a time, into different piles.
     * @this {cards.Pile}
     * @param {Number} n the number of cards to deal
     * @param {Number} [piles=1] the number of piles to deal. Default is 1. -1 = all cards.
     * @returns {cards.Pile|Array} if piles=1 or undefined, a cards.Pile object is returned. Otherwise an
     * array of cards.Pile objects is returned.
     * @throws {Error}
     */
    deal: function(n, piles) {
        // If n is given, it must be a number.
        if ( (typeof n != 'undefined') && (typeof n != 'number') ) {
            throw new Error('cards.Pile.deal: n must be a number. n = ' + n);
        }
        // If piles is given, it must be a number.
        if ( (typeof piles != 'undefined') && (typeof piles != 'number') ) {
            throw new Error('cards.Pile.deal: piles must be a number. piles = ' + piles);
        }
        n = (typeof n === 'undefined') ? 1 : n;
        n = (n == -1) ? this.cards.length : n;
        // n must be valid - less than (or equal to) the total number of cards in this pile and higher than 1.
        if ( (n > this.cards.length) || (n < 1) ) {
            throw new Error('cards.Pile.deal: n is out of range. n = ' + n);
        }
        
        // The number of piles we need to deal.
        piles = (typeof piles === 'undefined') ? 1 : piles;
        piles = (piles < 1) ? 1 : piles;
        // The cards.Pile objects.
        var obj_piles = [];
        var i;
        
        // Create the number of piles we need.
        for ( i = 0; i < piles; i++ ) {
            obj_piles.push( this.create() );
        }
        
        // Deal out the cards
        var j = 0;
        for ( i = 0; i < n; i++ ) {
            obj_piles[j].cards.push( this.cards[i] );
            
            // Increment second loop counter
            j++;
            j = (j == piles) ? 0 : j;
        }
        
        return obj_piles.length == 1 ? obj_piles[0] : obj_piles;
        /*
        if ( arguments.length < 1 ) {
            // Must contain at least one argument
            return false;
        }
        // By default, we want to deal out ALL cards in this pile
        var num = -1;
        if ( (typeof arguments[0]) == 'number' ) {
            // We want to deal out a specific number of cards
            num = arguments[0];
        }
        
        var j = 1;
        for (var i = 0; i < this.cards.length; i++) {
            arguments[j].add(this.cards[i]);
            j++;
            j = j == arguments.length ? 1 : j;
        }
        
        for (i = 0; i < arguments.length; i++) {
            
        }
        */
    },
    /**
     * Find a card at the given index. This function does NOT remove the card from this Pile. It simply
     * returns a reference to the {cards.Card} object.
     * @this {cards.Pile}
     * @param {Number} n the index of the card
     * @returns {cards.Card|undefined} undefined is returned if the index does not exist.
     */
    find: function(n) {
        return this.cards[n];
    },
    /**
     * pile.shuffle({f:cards.Shuffle.overhand, n:[6,8]});
     * pile.shuffle(cards.Shuffle.riffle);
     * pile.shuffle(cards.Shuffle.riffle, 2);
     * pile.shuffle(cards.Shuffle.riffle, 2, 10);
     * @param {Function} [func=cards.Shuffle.overhand] can be a user defined function
     * @param {Number} [a=1] the number of times to perform the shuffle. If "b" is not given, then the
     * shuffle is performed exactly "a" times.
     * @param {Number} [b] if "b" is given, the shuffle is performed a random
     * number of times between "a" and "b".
     * @returns {cards.Pile} this Pile object for method chaining.
     * @throws {Error}
     */
    shuffle: function(options) {
        if ( typeof options === 'undefined' ) {
            options = Pile.shuffle.options();
        }
        else if ( !Pile.shuffle.isValidOptions(options) ) {
            // Options passed in is not valid.
            throw new Error('cards.Pile.shuffle: invalid options given. options = ' + options);
        }
        var i, n;
        if ( Array.isArray(options.n) ) {
            // n is a random number between the range given by options.n
            n = Math.floor(Math.random() * (options.n[1] - options.n[0] + 1)) + options.n[0]
        }
        else {
            n = options.n;
        }
        
        var range = [];
        // Generate initial range
        for ( i = 0; i < this.cards.length; i++ ) {
            range.push(i);
        }
        for ( i = 0; i < n; i++ ) {
            range = options.f(range);
        }
        
        // @TODO Validate output from the shuffling function -- check there are no duplicates
        /*
        Use code:
        // Make sure we create a copy
        s_range = range.concat([]);
        // Sort using numerical comparisons, not dictionary order
        range.sort(function(a,b) {
            return (a < b) ? -1 : (a > b ? 1 : 0 );
        });
        */
        var cards_new = [];
        for ( i = 0; i < range.length; i++ ) {
            cards_new.push( this.cards[ range[i] ] );
        }
        this.cards = cards_new;
        return this;
    },
    /**
     * Cut the cards. The function cuts the card at a random position around the middle of the pile.
     * @returns {cards.Pile} this Pile object.
     * @throws {Error}
     */
    cut: function(options) {
        var len = this.cards.length;
        if ( len < 0 ) {
            throw new Error('cards.Pile.cut: Unexpected array length of ' + len);
        }
        
        switch (len) {
            case 0:
            case 1:
                // Do nothing
                break;
            case 2:
                // Swap the cards
                var t = this.cards[0];
                this.cards[0] = this.cards[1];
                this.cards[1] = t;
                break;
            default:
                // If its even, cuts exactly in half
                // If its odd, puts smaller portion in bottom
                var half = Math.floor(len/2);
                var bottom = this.cards.slice(0,half);
                var top = this.cards.slice(half);
                this.cards = top.concat(bottom);
                break;
        }
        
        return this;
    }
};

/**
 * Check if the shuffling options given is valid.
 * @param {*} options
 * @returns {Boolean} true if the options given is valid.
 */
Pile.shuffle.isValidOptions = function(options) {
    // options must be an object and contain two properties "f" and "n".
    // options.f must be a function.
    if ( (typeof options === 'object') && (typeof options.f === 'function') ) {
        var type = typeof options.n;
        // options.n can be a number > 0 or an array with length 2.
        if ( type === 'number' ) {
            return options.n > 0;
        }
        else if ( Array.isArray(options.n) ) {
            return (options.n.length == 2) && (options.n[0] > 0) && (options.n[1] >= options.n[0]);
        }
        else {
            // Invalid "n" property.
            return false;
        }
    }
    else {
        // Not an object, so not valid options.
        return false;
    }
}

/**
 * Set or get the options.
 * @param {Object|String} [options] use the string 'reset' to reset the options back to factory default.
 * @returns {Object} a reference to the current options object (if changed, the updated one is returned).
 * @throws {Error} if the options given are invalid.
 */
Pile.shuffle.options = function(options) {
    var type = typeof options;
    switch (type) {
        case 'undefined':
            // Just return the options
            break;
        case 'string':
            // Reset the options
            if ( options == 'reset' ) {
                Pile.shuffle.CurrentOptions = Pile.shuffle.DefaultOptions;
            }
            else {
                throw new Error('cards.Pile.shuffle.options: invalid options given. options = ' + options);
            }
            break;
        default:
            if ( Pile.shuffle.isValidOptions(options) ) {
                // Set the options
                Pile.shuffle.CurrentOptions = options;
            }
            else {
                throw new Error('cards.Pile.shuffle.options: invalid options given. options = ' + options);
            }
            break;
    }
    return Pile.shuffle.CurrentOptions;
}
