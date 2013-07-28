/**
 * Shuffling functions.
 * The shuffling functions are free to modify the given range array but the result must be returned. Only the
 * returned value is used!
 * @author Rajitha Wannigama
 */
var Shuffle = {
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
