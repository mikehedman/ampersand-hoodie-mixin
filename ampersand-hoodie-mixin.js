var sync = require('./ampersand-hoodie-sync');


module.exports = {
    //implementing classes must include a HOODIE_TYPE session property, with the default argument filled in:
    // 'HOODIE_TYPE': ['string', true, 'person']
    session: {
        'HOODIE_TYPE': ['string', true]
    },

    //overriding to force our models to use the hoodie version of sync
    sync: function() {
        return sync.apply(this, arguments);
    }
};
