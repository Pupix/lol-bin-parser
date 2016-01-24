(function () {
    'use strict';

    var fileReader = require('lol-file-parser'),
        read = require('./read'),
        parse = require('./parse');

    module.exports = fileReader({

        name: 'BinParser',

        parse: function (parser, cb) {
            parse(parser, cb);
        },

        read: function (reader, cb) {
            read(reader, cb);
        }

    });

}());
