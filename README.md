# lol-bin-parser
A parser for .bin files from League of Legends.

## Download
lol-bin-parser is installable via:

- [GitHub](https://github.com/Pupix/lol-bin-parser) `git clone https://github.com/Pupix/lol-bin-parser.git`
- [npm](https://www.npmjs.com/): `npm install lol-bin-parser`

## Usage example

```js
var BinParser = require('lol-bin-parser'),
    bin = new BinParser();
    
    // Read the package.json file
    bin.read('Fizz.bin', function (err, data) {
        console.log(data);
        "933543184": {
            "755834653": "Flesh",
            "762889000": "Fizz",
            "2407209295": {
                "2583134467": [
                    "Characters/Fizz/Skins/Base/Fizz_Base_VO_audio.bnk",
                    "Characters/Fizz/Skins/Base/Fizz_Base_VO_audio.wpk",
                    "Characters/Fizz/Skins/Base/Fizz_Base_VO_events.bnk"
                ],
                "2848286081": [
                    "Characters/Fizz/Skins/Base/Fizz_Base_SFX_audio.bnk",
                    "Characters/Fizz/Skins/Base/Fizz_Base_SFX_events.bnk"
                ]
                ...
            }
        }
    });

```

## Available methods

**N.B:** All methods act as promises if no callback is passed.

### parse(path, cb)

It will roughly parse a .bin file from the given path.

**Parameters**

1. **path {string}** A path to where the file to parse resides.
2. **[cb] {Function}** A callback called with `(error, parsedData)` as arguments.

### read(path, cb)

It will read a .bin file from the given path, leaving only the relevant data of the skeleton model.

**Parameters**

1. **path {string}** A path to where the file to read resides.
2. **[cb] {Function}** A callback called with `(error, readData)` as arguments.

