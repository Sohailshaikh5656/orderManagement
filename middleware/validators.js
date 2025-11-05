let en = require("../language/en");
let ar = require("../language/ar");
const Validator = require('Validator');
const { response } = require('express');
const responseCode = require("../utilites/responseCode")
let bypassMethods = ["signup","login","verifyOTP","resendOTP","forgetPassword","resetPassword","adminLogin","addAdmin", "register"];
const common = require('../utilites/common');
const { t, default: localizify } = require('localizify');
const jwt = require("jsonwebtoken")
let middleware = {
    //Validation Check
    checkValidationRules: function (req, res, request, rules, message, keywords) {
        const v = Validator.make(request, rules, message, keywords);
        if (v.fails()) {
            const errors = v.getErrors();  // Fetch all errors correctly
            console.log("Validation Errors:", errors);
    
            let errorMessage = Object.values(errors)[0][0]; //  Extract first error
    
            res.send({  //  Send response
                code: 0,
                message: errorMessage
            });
    
            return false;  //  Stop execution
        }
    
        return true;
    },        

    //Response
    sendResponse : function(req,res,message){
        //console.log(req.language);
        this.getMessage(req.language, { keyword: message.keyword, content : message.content }, (translatedMessage) => {
            console.log(translatedMessage);
            let responseData = {  // Fix: Define `responseData`
                code: message.code??null,
                message: translatedMessage ?? null, 
                data: message.data ?? null,  // Fix: Ensure `data` is not undefined
            };

            res.send(responseData)
        })
    },

    sendErrorMessage : function(req,res,error){
    console.error("Controller Error:", error);
        return res.status(500).json({
            code: 0,
            message: error || "Internal server error",
        });
    },

    getMessage : function(language,message,callback){
        localizify
        .add('en',en)
        .add('ar',ar)
        .setLocale(language);
        console.log(message);
        //console.log("Get Message", message.content);

        if (typeof message === "string") {
            message = { keyword: message };
        }
        let translatedMessage = t(message.keyword || message.keywords || "default_fallback_message");
        

        if (message.content) {
            Object.keys(message.content).forEach(key => {
                translatedMessage = translatedMessage.replace(`{ ${key} }`, message.content[key]);
            });
        }
        


        callback(translatedMessage);
    },
    extractHeaderLanguage: function (req, res, next) {
        var headerlang = req.headers['accept-language'] && req.headers['accept-language'] !== "" 
            ? req.headers['accept-language'] 
            : 'en';
    
        req.lang = headerlang;
        req.language = headerlang === 'en' ? en : ar;
    
        localizify
            .add('en', en)
            .add('ar', ar)
            .setLocale(req.lang);
    
        next(); // Ensure it proceeds to the next middleware
    },

    validateApiKey : function(req,res,callback){
        let api_key = (req.headers['api_key'] != undefined && req.headers['api_key'] != "") ? req.headers["api_key"] : '';
        let pathData = req.path.split("/");
        console.log("Path : ",pathData)
        if(pathData[1] == "api-doc") return callback()
        if(api_key != ""){
            try{
                console.log("ENV API KEY : ",process.env.api_key)
                console.log("Header API KEY : ",api_key)
                if(api_key != "" && api_key == process.env.API_KEY){
                    callback()
                }else{
                    let responseData = {
                        code : responseCode.OPERATION_FAILED,
                        keyword : "Invalid_Api_Key"
                    }

                    res.status(401)
                    middleware.sendResponse(req,res,responseData)
                }
            }catch(error){
                let responseData = {
                    code : responseCode.OPERATION_FAILED,
                    keyword : "Invalid_Api_Key"
                }

                middleware.sendResponse(req,res,responseData)
            }
        }else{
            let responseData = {
                code : responseCode.OPERATION_FAILED,
                keyword : "Invalid_Api_Key"
            }

            middleware.sendResponse(req,res,responseData)
        }
    },

     validateHeaderToken: function (req, res, callback) {
        let headerToken = req.headers['jwt_token'] && req.headers['jwt_token'] !== "" ? req.headers['jwt_token'] : '';
        let pathData = req.path.split("/");
        console.log("Path data : ",pathData)
        
        if (pathData[1] === "uploads" || pathData[1] === "api-doc") {
            return callback();
        }
        else if (bypassMethods.indexOf(pathData[3]) === -1 && pathData[1] !== "uploads") {
            if (headerToken !== "") {
                try {
                    console.log("Header token : ",headerToken)
                    // ✅ STEP 1: Verify the JWT
                    const decoded = jwt.verify(headerToken, process.env.SECRET_KEY);

                    console.log("Decoded : ",decoded)
                    // ✅ STEP 2: Decrypt the ID inside payload
                    // ✅ STEP 3: Route-based identity check
                    if (pathData[2] === "buyer") {
                        const decryptedId = decoded?.buyer_id 
                        console.log("Decrypted Buyer ID:", decryptedId);
                        req.buyerId = decryptedId;
                        callback();
                    } else if (pathData[2] === "admin") {
                        const decryptedId = decoded?.admin_id 
                        console.log("Decrypted Admin ID:", decryptedId);
                        req.adminId = decryptedId;
                        callback();
                    } else if (pathData[2] === "supplier") {
                        const decryptedId = decoded?.supplier_id 
                        console.log("Decrypted Supplier ID:", decryptedId);
                        req.supplierId = decryptedId;
                        callback();
                    } else {
                        res.status(401);
                        return middleware.sendResponse(req, res, {
                            code: responseCode.OPERATION_FAILED,
                            keyword: "Invalid_Role"
                        });
                    }
    
                } catch (error) {
                    console.error("Token validation error:", error.message);
                    res.status(401);
                    middleware.sendResponse(req, res, {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "Invalid_Token_Provided"
                    });
                }
            } else {
                res.status(401);
                middleware.sendResponse(req, res, {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "Token_Missing"
                });
            }
        }
        else {
            callback();
        }
    },
    
};

module.exports = middleware;
