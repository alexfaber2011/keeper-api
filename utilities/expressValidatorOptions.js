/**
 * Created by alexfaber on 3/23/16.
 */
module.exports = {
    customValidators: {
        isValidSortQuery: function (value) {
            var v = value.toLowerCase().replace("-", "");
            return v == 'date' || v == 'name';
        }
    },
    customSanitizers: {
        toSortQuery: function(value){
            return value.trim().toLowerCase();
        }
    }
};