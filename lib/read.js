(function () {
    'use strict';

    // Vars
    var XP  = require('expandjs');
    var hashes = require('../util/hashes.json');

    /*********************************************************************/

    module.exports = function (data, cb) {
        var readable = {},

            usedHashes = require(`${__dirname}/usedHashes.json`),
            usedHashesLength = Object.keys(usedHashes).length,

            hashTable = {
                "3552835389": "Characters/Blitzcrank/Skins/Skin0",
                "3536057770": "Characters/Blitzcrank/Skins/Skin1",
                "3519280151": "Characters/Blitzcrank/Skins/Skin2",
                "3502502532": "Characters/Blitzcrank/Skins/Skin3",
                "3485724913": "Characters/Blitzcrank/Skins/Skin4",
                "3468947294": "Characters/Blitzcrank/Skins/Skin5",
                "3452169675": "Characters/Blitzcrank/Skins/Skin6",
                "3435392056": "Characters/Blitzcrank/Skins/Skin7",
                "3418614437": "Characters/Blitzcrank/Skins/Skin8",
                "3401836818": "Characters/Blitzcrank/Skins/Skin9",
                "1685823854": "Characters/Blitzcrank/Skins/Skin10",
                "1702601473": "Characters/Blitzcrank/Skins/Skin11",
                "1400945719": "Characters/Blitzcrank/Skins/Meta",
                "2914574059": "Characters/Blitzcrank/CharacterRecords/Root",
                "1373299313": "Characters/Blitzcrank/Spells/RocketGrab",
                "2012186979": "Characters/Blitzcrank/Spells/Overdrive",
                "3268809498": "Characters/Blitzcrank/Spells/PowerFist",
                "918936691":  "Characters/Blitzcrank/Spells/StaticField",
                "1743548342": "Characters/Blitzcrank/Spells/PowerFistAttack",
                "1546774215": "Characters/Blitzcrank/Spells/ManaBarrier",
                "2748428230": "Characters/Blitzcrank/Spells/ManaBarrierIcon",
                "1958180971": "Characters/Blitzcrank/Spells/PowerFistSlow",
                "646977871":  "Characters/Blitzcrank/Spells/RocketGrabMissile",
                "2497778398": "Characters/Blitzcrank/Spells/BlitzcrankManaBarrierCD",
                "3430318381": "Characters/Blitzcrank/Spells/BlitzcrankBasicAttack2",
                "101376653":  "Characters/Blitzcrank/Spells/BlitzcrankCritAttack",
                "1316760077": "Characters/Blitzcrank/Spells/BlitzcrankBasicAttack",
                "1764221586": "Characters/Blitzcrank/Animations/Skin0",
                "1747443967": "Characters/Blitzcrank/Animations/Skin3",
                "1697111110": "Characters/Blitzcrank/Animations/Skin4",
                "1713888729": "Characters/Blitzcrank/Animations/Skin5",
                "1663555872": "Characters/Blitzcrank/Animations/Skin6",
                "1680333491": "Characters/Blitzcrank/Animations/Skin7",
                "818678652":  "Characters/Blitzcrank/Animations/Skin11",
            },

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

                        if (hashes[data.hash]) {
                            usedHashes[data.hash] = hashes[data.hash];
                        }

                        XP.forEach(data.values, function (field) {

                            let fieldName = hashes[field.hash] || field.hash;

                            if (hashes[field.hash]) {
                                usedHashes[field.hash] = hashes[field.hash];
                            }

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
                if (hashes[field.hash]) {
                    usedHashes[field.hash] = hashes[field.hash];
                }
                readable[name][fieldName] = readValue(field.value, field.type);
            });
        });

        if (Object.keys(usedHashes).length) {
            let fs = require('fs');

            if (Object.keys(usedHashes).length > usedHashesLength) {
                console.log('Found new hashes 🎉🎉🎉');
                fs.writeFile(`${__dirname}/usedHashes.json`, JSON.stringify(usedHashes, undefined, '  '), (err) => {
                    console.log('Updated the hash table 💕');
                });
            }

        }

        cb(null, readable);

    };

}());