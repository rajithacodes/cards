/**
 * Represents a playing card.
 * @TODO Add support for blank cards, use '00' as the code.
 * @author Rajitha Wannigama
 */
var Card = {
    /**
     * @type {Rank}
     * @private
     */
    rank: undefined,
    /**
     * @type {Suit}
     * @private
     */
    suit: undefined,
    
    /**
     * Create a new card.
     * Card.create('2C'); // Two of Clubs
     * Card.create('WC'); // The Joker - suit lets you identify each joker.
     * @constructor
     * @this {Card}
     * @param {String} value '2c' for Two of Clubs. Case does not matter, e.g. '2c' == '2C'
     * @returns {Card}
     * @throws {Error}
     */
    create: function(value) {
        var obj, rank, suit;
        // Value must be a string of length 2.
        if ( (typeof value != 'string') || (value.length != 2) ) {
            throw new Error('cards.Card.create: Invalid value for a card. value = ' + value);
        }
        
        value = value.toLowerCase();
        
        rank = Rank.create(value[0]);
        suit = Suit.create(value[1]);
        
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
                scale: '',
                selectable: false,
                hover_effect: 'zoom', // 'push', 'highlight'
                zoom_on_hover: false
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
    },
    /**
     * 
     * @param {RegExp}
     * @returns {Boolean}
     */
    is: function() {
    }
};
