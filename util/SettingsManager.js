/**
 * A bot JSON settings manager created for the bot Rekrastik, created by BluSpring.
 */
const fs = require('fs');

/**
 * Just to set the data.
 * @param {String} path
 * @private 
 */
function justDoIt(path) {
    if(require(path) == undefined)
        return {};
    else
        return require(path);
}
/**
 * The JSON manager.
 * @param {String} path - The path for the JSON code.
 */
    class Manager {
        constructor(path) {
            this.data = justDoIt(path);
            this.path = path;
        }

        /**
         * This is probably the stupidest way to give the thing...
         * @param {String} id
         * @private
         */
        waitNoID(id) {
            if(!this.data[id])
                this.data[id] = {};
        }
        /**
         * Sets the setting for the specific ID and key for the specific value.
         * @param {String} id 
         * @param {String} key 
         * @param {String} value 
         */
        set(id, key, value) {
            this.waitNoID(id);
            this.data[id][key] = value;
            fs.writeFile(this.path, JSON.stringify(this.data), (err) => {
                if(err)
                    return err;
            });
            return `Set key "${key}" for ID "${id}" with value "${value}"!`;
        }

        /**
         * Retrieves the setting for the specific ID and key.
         * @param {String} id - The guild/user ID.
         * @param {String} key - The key you want to get.
         */
        get(id, key) {
            if(!this.data[id] || !this.data[id][key])
                return undefined;
            
            return this.data[id][key];
        }
    }

    module.exports.Manager = Manager;