(function () {
    'use strict';

    // Vars
    var XP  = require('expandjs')

    /*********************************************************************/

    module.exports = function (data, cb) {
        var readable = {},

            readValue = function (data, type) {
                var result;

                switch(type) {

                    case 0:
                        result = readValue(data.value.value, data.value.type);
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 12:
                    case 17:
                    case 6:
                    case 7:
                    case 15:
                    case 10:
                    case 21:
                        result = data;
                        break;
                    case 11:
                        result = {x: data[0], y: data[1]};
                        break;
                    case 13:
                        result = {x1: data[0], y1: data[1], x2: data[2], y2: data[3]};
                        break;
                    case 16:
                        result = data.name;
                        break;
                    case 18:
                        result = [];

                        XP.forEach(data.subFields, function (field) {
                            result.push(readValue(field, data.entriesType));
                        });
                        break;
                    case 19:
                    case 20:
                        result = {};

                        XP.forEach(data.subFields, function (field) {
                            result[field.hash] = readValue(field.value, field.type);
                        });
                        break;
                    case 22:
                        //result = {};
                        //result.entriesType = parser.byte();
                        //result.entriesCount = parser.byte();
                        //
                        //result.subFields = [];
                        //
                        //for (i = 0; i < result.entriesCount; i += 1) {
                        //    result.subFields.push(readField(result.entriesType));
                        //}
                        break;
                    default:
                        console.log("Unknown structure type: ", type);
                        break;
                }

                return result;
            };

        XP.forEach(data.properties, function (property) {
            readable[property.hash] = [];

            readable[property.hash] = {};

            XP.forEach(property.subFields, function (field) {
                readable[property.hash][field.hash] = readValue(field.value, field.type);
            });
        });

        cb(null, readable);

    };

}());