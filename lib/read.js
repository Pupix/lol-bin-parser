(function () {
    'use strict';

    // Vars
    var XP  = require('expandjs');
    var hashes = require('../util/hashes.json');

    /*********************************************************************/

    module.exports = function (data, cb) {
        var readable = {},

            readValue = function (data, type) {
                var result;

                switch(type) {

                    case 0:
                    case 12:
                        result = {x: data[0], y: data[1], z: data[2]};
                        break;
                    case 1:
                    case 3:
                    case 5:
                    case 6:
                    case 7:
                    case 10:
                    case 17:
                        result = data;
                        break;
                    case 9:
                    case 11:
                        result = {x: data[0], y: data[1]};
                        break;
                    case 13:
                        result = {x1: data[0], y1: data[1], x2: data[2], y2: data[3]};
                        break;
                    case 15:
                    case 21:
                        result = data;
                        break;
                    case 16:
                        result = data.value;
                        break;
                    case 18:
                        result = [];

                        XP.forEach(data.values, function (field) {
                            result.push(readValue(field, data.entriesType));
                        });
                        break;
                    case 19:
                    case 20:
                        result = {};

                        let dataName = hashes[data.hash] || data.hash;
                        result[dataName] = {};

                        XP.forEach(data.values, function (field) {
                            let fieldName = hashes[field.hash] || field.hash;
                            result[dataName][fieldName] = readValue(field.value, field.type);
                        });
                        break;
                    case 22:
                        result = [];

                        XP.forEach(data.values, function (field) {
                            result.push(readValue(field, data.entriesType));
                        });
                        break;
                    case 23:
                        result = [];

                        XP.forEach(data.values, function (field) {
                            // result[field[1].hash] = {}
                            result[0] = readValue(field[0], data.entriesType);
                            result[1] = readValue(field[1], data.entriesType1);
                        });
                        break;
                    default:
                        console.log('type:', type);
                        result = data;
                        //console.log("Unknown structure type: ", type);
                        break;
                }

                return result;
            };

        XP.forEach(data.properties, function (property, i) {
            let name = hashTable[property.hash] || property.hash;
            readable[name] = {};

            XP.forEach(property.values, function (field, i) {
                let fieldName = hashes[field.hash] || field.hash;
                readable[name][fieldName] = readValue(field.value, field.type);
            });
        });

        cb(null, readable);

    };

}());