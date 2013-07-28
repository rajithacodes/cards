(function(window) {
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

var cards = {};
/**
 * Represents a playing card.
 * @TODO Add support for blank cards, use '00' as the code.
 * @author Rajitha Wannigama
 */
cards.Card = {
    /**
     * @type {cards.Rank}
     * @private
     */
    rank: undefined,
    /**
     * @type {cards.Suit}
     * @private
     */
    suit: undefined,

    /**
     * Create a new card.
     * Card.create('2C'); // Two of Clubs
     * Card.create('WC'); // The Joker - suit lets you identify each joker.
     * @constructor
     * @this {cards.Card}
     * @param {String} value '2c' for Two of Clubs. Case does not matter, e.g. '2c' == '2C'
     * @returns {cards.Card}
     * @throws {Error}
     */
    create: function(value) {
        var obj, rank, suit;
        // Value must be a string of length 2.
        if ( (typeof value != 'string') || (value.length != 2) ) {
            throw new Error('cards.Card.create: Invalid value for a card. value = ' + value);
        }
        
        value = value.toLowerCase();
        
        rank = cards.Rank.create(value[0]);
        suit = cards.Suit.create(value[1]);
        
        obj = Object.create(this);
        obj.rank = rank;
        obj.suit = suit;
        return obj;
    },

    /**
     * Get the HTML code that displays this card.
     * @param {Object} [options] an object that defines how this card is displayed
     * {
     *      faceup: true,
     *      size: 'poker','bridge','jumbo','mini', 'custom' // if custom, define width and height
     *      scale: '5:2', '1:1' // the scale used to draw the card on the screen.
     *       poker size (2.5×3.5 inches (64×89 mm), or B8 size according to ISO 216)
     *       bridge size (2.25×3.5 inches (57×89 mm))
     *       smaller size (usually 1.75×2.625 inches (44×66.7 mm)) for solitaire
     *      
     * }
     * @returns {Object #<HTMLDivElement>}
     */
    html: function(options) {
        if ( typeof options === 'undefined' ) {
            // Use default options
            options = {
                faceup: true,
                size: 'poker',
                scale: ''
            }
        }
        var div = document.createElement('div');
        var divTop = document.createElement('div');
        var divBottom = document.createElement('div');
        var sRank = document.createElement('span');
        var sSuit = document.createElement('span');
        
        div.setAttribute('data-cards','card');
        div.style.position = 'relative';
        div.style.border = '1px solid #000000';
        div.style.backgroundColor = '#ffffff';
        div.style.borderRadius = '10px';
        div.style.fontFamily = '"Trebuchet MS", Helvetica, sans-serif';
        div.style.display = 'inline-block';
        div.style.width = '80px';
        div.style.height = '111.25px';
        //div.style.paddingLeft = '4px';
        //div.style.paddingRight = '4px';
        
        sRank.innerHTML = this.rank.html();
        sSuit.innerHTML = this.suit.html();
        
        if ( /^(h|d)$/.test(this.suit.value) ) {
            sSuit.style.color = 'red';
        }
        
        sRank.style.fontSize = '16px';
        if ( this.rank.value === '0' ) {
            sRank.style.fontSize = '14px';
        }
        sSuit.style.fontSize = '22px';
        
        divTop.appendChild(sRank);
        divTop.appendChild(sSuit);
        divTop.style.position = 'absolute';
        divTop.style.top = '0px';
        divTop.style.left = '4px';
        div.appendChild(divTop);
        
        divBottom.appendChild(sSuit.cloneNode(true));
        divBottom.appendChild(sRank.cloneNode(true));
        divBottom.style.transform = 'rotate(180deg)';
        divBottom.style.webkitTransform = 'rotate(180deg)';
        divBottom.style.MozTransform = 'rotate(180deg)';
        divBottom.style.msTransform = 'rotate(180deg)';
        divBottom.style.OTransform = 'rotate(180deg)';
        divBottom.style.position = 'absolute';
        divBottom.style.bottom = '0px';
        divBottom.style.right = '4px';
        div.appendChild(divBottom);
        
        return div;
    },
    /**
     * 
     * @param {Object} obj
     * @returns {Boolean} 
     */
    isCard: function(obj) {
        return typeof obj === 'object';
    }
};

/**
 * The object used to create card decks. The actual deck is represented as a Pile object.
 * @author Rajitha Wannigama
 */
cards.Deck = {
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
     * @this {cards.Deck}
     * @param {Object} [options]
     *      Possible options: Jokers included? If so, 2 or 4?
     * @returns {cards.Pile}
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
        pile = cards.Pile.create();
        for ( i = 0; i < ranks.length; i++ ) {
            for ( j = 0; j < suits.length; j++ ) {
                // Get the value of the card. e.g. '2c'.
                c = ranks[i] + suits[j];
                pile.add( cards.Card.create(c) );
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
        var pile = cards.Pile.create();
        for ( i = 0; i < str.length; i += 2 ) {
            // Get the card in string form
            c = str[i] + str[i+1];
            // Create the Card object
            pile.add( cards.Card.create(c) );
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

/**
 * A pile of cards. A card deck is a Pile of cards.
 * Indexes:
 *      Positive index: Starts from the top of the deck, when the deck is face DOWN. 0 = top card.
 *                      Starts from the bottom of the deck, when the deck is face UP. 0 = bottom card.
 *      Negative index: Starts from the bottom of the the deck, when the deck is face DOWN. -1 = bottom card.
 *                      Starts from the top of the deck, when the deck is face UP. -1 = top card.
 * @author Rajitha Wannigama
 */
cards.Pile = {
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
    
    /**
     * Create a new Pile of cards.
     * @constructor
     * @this {cards.Pile}
     * @param {...cards.Pile} a list of Pile objects used to create this new Pile, in the order
     * needed.
     * @returns {cards.Pile}
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
            options = cards.Pile.shuffle.options();
        }
        else if ( !cards.Pile.shuffle.isValidOptions(options) ) {
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
 * Default shuffling options.
 * f: the shuffling function
 * n: the number of times to call the shuffling function
 * @TODO allow "n" to be an array [x,y] where x,y are numbers > 0
 */
cards.Pile.shuffle.DefaultOptions = undefined;

/**
 * The current options are the ones used by the cards.Pile.shuffle function when no
 * explicit options are given.
 * @private
 */
cards.Pile.shuffle.CurrentOptions = undefined;

/**
 * Check if the shuffling options given is valid.
 * @param {*} options
 * @returns {Boolean} true if the options given is valid.
 */
cards.Pile.shuffle.isValidOptions = function(options) {
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
cards.Pile.shuffle.options = function(options) {
    if ( typeof cards.Pile.shuffle.DefaultOptions === 'undefined' ) {
        // Default options are not yet set up
        cards.Pile.shuffle.DefaultOptions = {
            f: cards.Shuffle.fisherYates,
            n: 1
        }
        if ( typeof cards.Pile.shuffle.CurrentOptions === 'undefined' ) {
            cards.Pile.shuffle.CurrentOptions = cards.Pile.shuffle.DefaultOptions;
        }
    }
    var type = typeof options;
    switch (type) {
        case 'undefined':
            // Just return the options
            break;
        case 'string':
            // Reset the options
            if ( options == 'reset' ) {
                cards.Pile.shuffle.CurrentOptions = cards.Pile.shuffle.DefaultOptions;
            }
            else {
                throw new Error('cards.Pile.shuffle.options: invalid options given. options = ' + options);
            }
            break;
        default:
            if ( cards.Pile.shuffle.isValidOptions(options) ) {
                // Set the options
                cards.Pile.shuffle.CurrentOptions = options;
            }
            else {
                throw new Error('cards.Pile.shuffle.options: invalid options given. options = ' + options);
            }
            break;
    }
    
    return cards.Pile.shuffle.CurrentOptions;
}

/**
 * Represents the rank of a card.
 * @author Rajitha Wannigama
 */
cards.Rank = {
    /**
     * @type {String}
     * @private
     */
    value: undefined,
    /**
     * Create a new rank. Must use this function over Object.create(cards.Rank).
     * @constructor
     * @this {cards.Rank}
     * @param {String|Number} value '2','3','4','5','6','7','8','9','0','j','q','k','a','w','0'. Case does
     * not matter.
     * @returns {cards.Rank}
     * @throws {Error}
     */
    create: function(value) {
        // The ranks in a card deck. 'W' stands for Joker.
        var ranks = cards.Deck.ranks;
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

/**
 * The shoe is a list of card decks.
 */
cards.Shoe = {
    decks: [],
    init: function() {

    }
};

/**
 * Shuffling functions.
 * The shuffling functions are free to modify the given range array but the result must be returned. Only the
 * returned value is used!
 * @author Rajitha Wannigama
 */
cards.Shuffle = {
    /**
     * The shuffle function generates a list of numbers that has been shuffled from the regular
     * ordering. The number range starts from 0 to (n-1).
     * @param {Number} [n=52] the upper limit for the range. e.g. if n=52 then the range is from 0 to 51
     * @param {Array} range an array of integer values.
     */
    none: function(range, n) {
        return range;
    },
    /**
     * The Fisher-Yates shuffle using Donald E. Knuth's variation.
     * http://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm
     */
    fisherYates: function(range) {
        var i, j, t;
        i = range.length;
        if ( i === 0 ) {
            return false;
        }
        while ( --i ) {
            j = Math.floor( Math.random() * ( i + 1 ) );
            t = range[i];
            range[i] = range[j];
            range[j] = t;
        }
        return range;
    },
    /**
     * The overhand shuffle. This algorithm tries to mimic a real overhand shuffle.
     * @param {Array} range
     * @param {Array} the shuffled range
     */
    overhand: function(range) {
        var i;
        var range = [];
        var shuffled = [];
        
        // Use 52 by default if n is not given
        n = (typeof n == 'undefined') ? 52 : n;
        
        for ( i = 0; i < n; i++ ) {
            range.push(i);
        }
        
        // Perfect Riffle shuffle
        var top = [];
        var bottom = [];
        
        if ( range.length < 6 ) {
            return range.reverse();
        }
        else {
            for ( i = 0; i < 6; i++ ) {
                
            }
        }
    },
    riffle: function(range) {
        return range;
    },
    hindu: function(range) {
        return range;
    }
};

/**
 * Represents the suit of a card.
 * @author Rajitha Wannigama
 */
cards.Suit = {
    /**
     * @type {String}
     * @private
     */
    value: undefined,
    
    /**
     * Create a new Suit. Must use this function instead of Object.create(cards.Suit) to create a 
     * suit.
     * @constructor
     * @this {cards.Suit}
     * @param {String} value 'c', 'h', 's' or 'd'. Case does not matter. '0' is used for a blank card.
     * @returns {cards.Suit}
     * @throws {Error}
     */
    create: function(value) {
        if ( typeof value != 'string' ) {
            throw new Error('cards.Suit.create: value must be a string! value = ' + value);
        }
        // The four suits.
        var suits = cards.Deck.suits;
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

main.cards = cards;
window.cjs = main;
return main;
})(window);
