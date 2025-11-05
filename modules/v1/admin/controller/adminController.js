const Validator = require("Validator")
const middleware = require("../../../../middleware/validators")
const validationRules = require("../../../../utilites/rules")
const adminModel = require("../model/adminModel");
const common = require("../../../../utilites/common");
const message = require('../../../../language/en');
const { required } = require('../../../../language/ar');

class adminController {
    constructor() { }

    //Register
    async register(req,res) {

        let requestData =  req.body
        console.log("Data : ", req.body)
        let rules = validationRules.register;
        // FIX: Check if req.language exists and has required property
        let message = {
            required: req.language?.required
        }
        let keywords = {}
        try {
            if(middleware.checkValidationRules(req,res,requestData,rules,message,keywords)){
                let response = await adminModel.register(requestData)
                return middleware.sendResponse(req, res, response)
            }
        } catch (error) {
            return middleware.sendErrorMessage(req,res,error)
        }
    }
    async login(req,res) {

        let requestData =  req.body
        console.log("Data : ", req.body)
        let rules = validationRules.login;
        // FIX: Check if req.language exists and has required property
        let message = {
            required: req.language?.required
        }
        let keywords = {}
        try {
            if(middleware.checkValidationRules(req,res,requestData,rules,message,keywords)){
                let response = await adminModel.login(requestData)
                return middleware.sendResponse(req, res, response)
            }
        } catch (error) {
            return middleware.sendErrorMessage(req,res,error)
        }
    }
    async updateOrderStatus(req, res) {
        let requestData = {}
        requestData.status = req.params?.status
        if(req?.params?.id){
            requestData.orderId = parseInt(req.params.id)
        }
        console.log("Update Data : ", requestData)
        try {
            let response = await adminModel.updateOrderStatus(requestData)
            return middleware.sendResponse(req, res, response)
        } catch (error) {
            return middleware.sendErrorMessage(req, res, error)
        }
    }
    async analytics(req, res) {
        let requestData = {}
        console.log("Update Data : ", requestData)
        try {
            let response = await adminModel.analytics(requestData)
            return middleware.sendResponse(req, res, response)
        } catch (error) {
            return middleware.sendErrorMessage(req, res, error)
        }
    }
}
module.exports = new adminController()