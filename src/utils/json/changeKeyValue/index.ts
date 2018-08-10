const fs = require('fs')

export function jsonChangeKeyValue(FILE_PATH, KEY, VALUE) {
    delete require.cache[FILE_PATH]
    const FILE = require(FILE_PATH)
    FILE[KEY] = VALUE
    fs.writeFileSync(FILE_PATH, JSON.stringify(FILE, null, 2))
}
