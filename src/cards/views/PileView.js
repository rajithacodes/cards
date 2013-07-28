/**
 * A view for a Pile object.
 * @author Rajitha Wannigama
 */
var PileView = {
    /**
     * Indicates if the pile is selectable as a whole.
     * @type {Boolean}
     */
    pile_selectable: false,
    /**
     * The number of cards that can be selected in this pile.
     * - Can be a whole number or an array with two elements indicating a range.
     * - Can be a regular expression if the number of selections are more complex.
     * e.g. the user can only select 2 or 4 cards can be represented as: /^[24]$/
     * With this RegExp object the user cannot select 1,3, 5 or more cards: he can only
     * select 2 or 4 cards.
     * - Can be a function that is called every time a card is selected. This gives you the most
     * freedom to define a customized selection.
     * @type {Integer|Array|RegExp|Function}
     */
    cards_selectable: 0,
    
    create: function() {
    }
};
