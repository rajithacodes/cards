/**
 * Package initialization code.
 * This code appears AFTER all other source files.
 * So we can assume all objects have been created for our package.
 * Also exposes public objects.
 * @author Rajitha Wannigama
 */
// Rank and Suit are private objects
// Public objects
// This way the package can use different names to the public names for the objects.
// e.g. this.Deck = PrivateDeck;
// PrivateDeck is the name of the object inside the package, and Deck is used as the public name.
this.Deck = Deck;
this.Pile = Pile;
this.Card = Card;

/**
 * Default shuffling options.
 * f: the shuffling function
 * n: the number of times to call the shuffling function
 * @TODO allow "n" to be an array [x,y] where x,y are numbers > 0
 */
Pile.shuffle.DefaultOptions = {
    f: Shuffle.fisherYates,
    n: 1
};

/**
 * The current options are the ones used by the cards.Pile.shuffle function when no
 * explicit options are given.
 * @private
 */
Pile.shuffle.CurrentOptions = Pile.shuffle.DefaultOptions;
