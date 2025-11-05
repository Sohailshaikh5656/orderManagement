let dotenv = require("dotenv");
dotenv.config()
// let cryptlib = require("cryptlib");

// Debugging: Check if the key is loaded
console.log("Encryption Key from ENV:", process.env.ENCRYPTION_SECRET_KEY);


let constant = {
    // encryptionKey: cryptlib.getHashSha256("xza548sa3vcr641b5ng5nhy9mlo64r6k", 32),
    encryptionIV : "5ng5nhy9mlo64r6k",
    app_url : process.env.URL+process.env.PORT+'/',
    api_key:process.env.API_KEY,
    secret_key : process.env.SECRET_KEY,
    port_base_url :process.env.URL+process.env.PORT+'/'
};

console.log("Final Encryption Key:", constant.encryptionKey);

module.exports = constant
