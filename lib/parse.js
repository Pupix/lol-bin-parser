(function () {
    'use strict';

    /*********************************************************************/

    module.exports = function (parser, cb) {
        var bin = {
                header: {
                    linkedFiles: [],
                },
                properties: []
        },

        i = 0,

        readEntry = function () {
            var result = {},
                check = parser.tell() + 4, // block length + first uint
                i = 0;

            result.length = parser.uint();
            result.hash = parser.uint();
            result.valuesCount = parser.ushort();

            result.values = [];

            for (i = 0; i < result.valuesCount; i += 1) {
                result.values.push(readValue());
            }

            if (check + result.length !== parser.tell()) {
                console.error('Wrong detail size from ' + check + ' to ' + parser.tell() + '. It\'s ' + (parser.tell() - check) + ', but should have been ' + result.length);
            }

            return result;

        },

        readValue = function () {
            var result = {};

            result.hash = parser.uint32();
            result.type = parser.ubyte();

            result.value = readValueByType(result.type);

            return result;
        },

        readValueByType = function (type) {
            var result,
                check = parser.tell(),
                i = 0;

            switch(type) {

                case 0: // Done
                    result = parser.ushort(3);
                    break;
                case 1:
                case 24: // Done
                    result = !!parser.ubyte();
                    break;
                case 3: // Done
                    result = parser.ubyte();
                    break;
                case 5: // Done
                    result = parser.ushort();
                    break;
                case 6: // Done
                case 7: // Done
                case 17: // Done
                    result = parser.uint();
                    break;
                case 9: // Done
                    result = parser.uint(2);
                    break;
                case 10: // Done
                    result = parser.float();
                    break;
                case 11: // Done
                    result = parser.float(2);
                    break;
                case 12: // Done
                    result = parser.float(3);
                    break;
                case 13: // Done
                    result = parser.float(4);
                    break;
                case 15: // Done
                case 21: // Done
                    result = parser.ubyte(4);
                    break;
                case 16: //Done
                    result = {};
                    result.nameLength = parser.ushort();
                    result.value = parser.string(result.nameLength);
                    break;
                case 18: // Done
                    result = {};
                    result.entriesType = parser.byte();
                    result.entriesSize = parser.uint();
                    result.entriesCount = parser.uint();

                    result.values = [];

                    for (i = 0; i < result.entriesCount; i += 1) {
                        result.values.push(readValueByType(result.entriesType));
                    }
                    break;
                case 19: // Done
                case 20: // Done
                    result = {};
                    result.hash = parser.uint();
                    result.entriesSize = parser.uint();
                    result.entriesCount = parser.ushort();

                    result.values = [];

                    for (i = 0; i < result.entriesCount; i += 1) {
                        result.values.push(readValue());
                    }
                    break;
                case 22: // Done
                    result = {};
                    result.entriesType = parser.byte();
                    result.entriesCount = parser.byte();

                    result.values = [];

                    for (i = 0; i < result.entriesCount; i += 1) {
                        result.values.push(readValueByType(result.entriesType));
                    }
                    break;
                case 23: // Done
                    result = {};
                    result.entriesType = parser.ubyte();
                    result.entriesType1 = parser.ubyte();
                    result.entriesSize = parser.uint();
                    result.entriesCount = parser.uint();

                    result.values = [];

                    for (i = 0; i < result.entriesCount; i += 1) {
                        result.values.push({
                            0: readValueByType(result.entriesType),
                            1: readValueByType(result.entriesType1)
                        });
                    }
                    break;
                default:
                    console.log(`Unknown detail type '${type}' starting at: `, check);
                    throw new Error();
                    break;
            }

            return result;
        };

        bin.header.magic = parser.string(4);
        bin.header.version = parser.uint32();

        if (bin.header.version > 2) {
            return cb(new Error('Unknown .bin version'), null);
        }

        if (bin.header.version === 2) {
            bin.header.linkedFilesCount = parser.uint32();

            for (let i = 0; i < bin.header.linkedFilesCount; i += 1) {
                const file = {};

                file.length = parser.uint16();
                file.name = parser.string(file.length);
                bin.header.linkedFiles.push(file);
            }
        }

        bin.header.entriesCount = parser.uint32();

        if (bin.header.entriesCount) {
            bin.header.entriesTypes = parser.uint32(bin.header.entriesCount);
        }

        // PROPERTIES
        for (i = 0; i < bin.header.entriesCount; i += 1) {
            bin.properties.push(readEntry())
        }

        cb(null, bin);

    };

}());
