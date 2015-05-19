var schema = require('validate');

var dbAdaptorSchema = schema({
    connect: {
        type: 'function',
        required: true,
        message: 'dbAdaptor \'connect\' function is required'
    },
    findById: {
        type: 'function',
        required: true,
        message: 'dbAdaptor \'findById\' function is required'
    },
    findByUsername: {
        type: 'function',
        required: true,
        message: 'dbAdaptor \'findByUsername\' function is required'
    },
    serialize: {
        type: 'function',
        required: true,
        message: 'dbAdaptor \'serialize\' function is required'
    },
    getId: {
        type: 'function',
        message: 'dbAdaptor \'getId\' function is required'
    },
    getSalt: {
        type: 'function',
        message: 'dbAdaptor \'getSalt\' function is required'
    },
    getHash: {
        type: 'function',
        message: 'dbAdaptor \'getHash\' function is required'
    },
    getLastLogin: {
        type: 'function',
        message: 'dbAdaptor \'getLastLogin\' function is required'
    },
    getLastLogout: {
        type: 'function',
        message: 'dbAdaptor \'getLastLogout\' function is required'
    },
    getProfile: {
        type: 'function',
        message: 'dbAdaptor \'getProfile\' function is required'
    },
    getLoginAttempts: {
        type: 'function',
        message: 'dbAdaptor \'getLoginAttempts\' function is required if \'loginAttemptLimit\' option is greater than 0'
    },
    getLoginAttemptLockTime: {
        type: 'function',
        message: 'dbAdaptor \'getLoginAttemptLockTime\' function is required if \'loginAttemptLimit\' option is greater than 0'
    },
    create: {
        type: 'function',
        message: 'dbAdaptor \'create\' function is required'
    },
    update: {
        type: 'function',
        message: 'dbAdaptor \'update\' function is required'
    },
    editProfile: {
        type: 'function',
        message: 'dbAdaptor \'editProfile\' function is required'
    }
});

module.exports = function(adaptor) {
    var errors = dbAdaptorSchema.validate(adaptor, {
        strip: false
    });
};