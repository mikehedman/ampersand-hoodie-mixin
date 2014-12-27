var _ = require('underscore');

module.exports = {
    //implementing classes must include a HOODIE_TYPE session property, with the default argument filled in:
    // 'HOODIE_TYPE': ['string', true, 'person']
    session: {
        'HOODIE_TYPE': ['string', true]
    },

    //This sync function is a modified version of the code in ampersand-sync
    sync: function (method, model, options) {
        options = options ? _.clone(options) : {};
        var jsonPayload;
        var promise;

        // Ensure that we have a hoodie object type.
        if (!model.HOODIE_TYPE) {
            throw new Error('A HOODIE_TYPE property must be specified');
        }

        // Ensure that we have the appropriate request data.
        if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
            jsonPayload = options.attrs || model.toJSON(options) || options.data;
        }

        switch(method) {
            case 'read':
                if (options && options.id) {
                    promise = window.hoodie.store.find(model.HOODIE_TYPE, options.id);
                } else {
                    promise = window.hoodie.store.findAll(model.HOODIE_TYPE);
                }
                break;
            case 'create':
                if (!jsonPayload) {
                    throw new Error('Trying to add a model, but no data provided');
                } else {
                    promise = window.hoodie.store.add(model.HOODIE_TYPE, jsonPayload, options.silent);
                }
                break;
            case 'update':
            case 'patch':
                if (! jsonPayload) {
                    throw new Error('Trying to update a model, but no data provided');
                } else if (!model.id) {
                    throw new Error('Cannot update model - no id provided');
                } else {
                    promise = window.hoodie.store.update(model.HOODIE_TYPE, model.id, jsonPayload, options.silent);
                }
                break;
            case 'delete':
                if (!model.id) {
                    throw new Error('Cannot delete model - no id provided');
                } else {
                    promise = window.hoodie.store.remove(model.HOODIE_TYPE, model.id, options.silent);
                }
                break;
            default:
                throw new Error('Undefined hoodie method requested: ' + methodMap[method] + ' original: ' + method);
                break
        }

        promise.done(function(body) {
            if (options.success) return options.success(body, 'success');
        });
        promise.fail(function(error) {
            if (options.error) return options.error({}, 'error', error);
        });
    }
};