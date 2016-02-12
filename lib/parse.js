(function () {
    'use strict';

    /*********************************************************************/

    module.exports = function (parser, cb) {
        var bin = {
                header: {},
                properties: []
        },

        i = 0,

        readProperty = function () {
            var result = {},
                check = parser.tell() + 4, // block length + first uint
                i = 0;

            result.length = parser.uint32();
            result.hash = parser.uint();
            result.entriesCounter = parser.ubyte();
            result.unkByte = parser.ubyte();

            result.subFields = [];

            for (i = 0; i < result.entriesCounter; i += 1) {
                result.subFields.push(readDetail());
            }

            if (check + result.length !== parser.tell()) {
                console.error('Wrong detail size from ' + check + ' to ' + parser.tell() + '. It\'s ' + (parser.tell() - check) + ', but should have been ' + result.length);
            }

            return result;

        },

        readDetail = function () {
            var result = {};

            result.hash = parser.uint32();
            result.type = parser.ubyte();
            result.value = readField(result.type);

            return result;
        },

        readField = function (type) {
            var result,
                check = parser.tell(),
                i = 0;

            switch(type) {

                case 0:
                    result = {};
                    result.unk = parser.ushort(3);
                    result.value = readDetail();
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 12:
                    result = !!parser.ubyte();
                    break;
                case 6:
                case 7:
                case 17:
                    result = parser.uint();
                    break;
                case 10:
                case 15:
                case 21:
                    result = parser.float();
                    break;
                case 11:
                    result = parser.float(2);
                    break;
                case 13:
                    result = parser.float(4);
                    break;
                case 16:
                    result = {};
                    result.nameLength = parser.ushort();
                    result.value = parser.string(result.nameLength);
                    break;
                case 18:
                    result = {};
                    result.entriesType = parser.byte();
                    result.entriesSize = parser.uint();
                    result.entriesCount = parser.uint();

                    result.subFields = [];

                    for (i = 0; i < result.entriesCount; i += 1) {
                        result.subFields.push(readField(result.entriesType));
                    }
                    break;
                case 19:
                case 20:
                    result = {};
                    result.hash = parser.uint();
                    result.entriesSize = parser.uint();
                    result.entriesCount = parser.ushort();

                    result.subFields = [];

                    for (i = 0; i < result.entriesCount; i += 1) {
                        result.subFields.push(readDetail());
                    }
                    break;
                case 22:
                    result = {};
                    result.entriesType = parser.byte();
                    result.entriesCount = parser.byte();

                    result.subFields = [];

                    for (i = 0; i < result.entriesCount; i += 1) {
                        result.subFields.push(readField(result.entriesType));
                    }
                    break;
                case 23:
                    result = {};
                    result.entriesType = parser.ubyte();
                    result.entriesType1 = parser.ubyte();
                    result.unk = parser.ushort(2);
                    result.entriesCount = parser.uint();

                    result.subFields = [];

                    for (i = 0; i < result.entriesCount; i += 1) {
                        result.subFields.push({
                            0: readField(result.entriesType),
                            1: readField(result.entriesType1)
                        });
                    }
                    break;
                default:
                    console.log("Unknown detail type starting at: ", check);
                    break;
            }

            return result;
        };

        bin.header.magic = parser.string(4);
        bin.header.version = parser.uint32();
        bin.header.entriesCounter = parser.uint32();
        bin.header.types = parser.uint32(bin.header.entriesCounter);

        if (bin.header.version !== 1) {
            return cb(new Error('Unknown .bin version'), null);
        }

        // PROPERTIES
        for (i = 0; i < bin.header.entriesCounter; i += 1) {
            bin.properties.push(readProperty())
        }

        cb(null, bin);

    };

}());
