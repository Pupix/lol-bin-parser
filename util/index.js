const UINT = require('cuint').UINT32;

module.exports = {
    createHash(entry) {
        entry = entry.toLowerCase();
        let hash = UINT(2166136261);
        let mask = UINT(16777619);

        for (let i = 0; i < entry.length; i += 1) {
            let temp = UINT(entry.charCodeAt(i));
            hash = (hash.xor(temp).multiply(mask));
        }

        return Number(hash.toString());
    },

    hashes: require('./hashes.json')
}