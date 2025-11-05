const Validator = require("Validator")
const middleware = require("../../../../middleware/validators")
const validationRules = require("../../../../utilites/rules")
const supplierModel = require("../model/supplierModel");
const common = require("../../../../utilites/common");
const message = require('../../../../language/en');
const { required } = require('../../../../language/ar');

class suppliersController {
    constructor() { }

    //Register
    async register(req, res) {

        let requestData = req.body
        console.log("Data : ", req.body)
        let rules = validationRules.register;
        // FIX: Check if req.language exists and has required property
        let message = {
            required: req.language?.required
        }
        let keywords = {}
        try {
            if (middleware.checkValidationRules(req, res, requestData, rules, message, keywords)) {
                let response = await supplierModel.register(requestData)
                return middleware.sendResponse(req, res, response)
            }
        } catch (error) {
            return middleware.sendErrorMessage(req, res, error)
        }
    }
    async login(req, res) {

        let requestData = req.body
        console.log("Data : ", req.body)
        let rules = validationRules.login;
        // FIX: Check if req.language exists and has required property
        let message = {
            required: req.language?.required
        }
        let keywords = {}
        try {
            if (middleware.checkValidationRules(req, res, requestData, rules, message, keywords)) {
                let response = await supplierModel.login(requestData)
                return middleware.sendResponse(req, res, response)
            }
        } catch (error) {
            return middleware.sendErrorMessage(req, res, error)
        }
    }
    async addProduct(req, res) {

        let requestData = req.body
        requestData.supplierId = req.supplierId
        console.log("Data : ", req.body)
        let rules = validationRules.addProduct;
        // FIX: Check if req.language exists and has required property
        let message = {
            required: req.language?.required
        }
        let keywords = {}
        try {
            if (middleware.checkValidationRules(req, res, requestData, rules, message, keywords)) {
                let response = await supplierModel.addProduct(requestData)
                return middleware.sendResponse(req, res, response)
            }
        } catch (error) {
            return middleware.sendErrorMessage(req, res, error)
        }
    }
    async updateProduct(req, res) {
        let requestData = req.body
        requestData.supplierId = req.supplierId
        console.log("Update Data : ", req.body)
        let rules = validationRules.updateProduct;
        // FIX: Check if req.language exists and has required property
        let message = {
            required: req.language?.required
        }
        let keywords = {}
        try {
            if (middleware.checkValidationRules(req, res, requestData, rules, message, keywords)) {
                let response = await supplierModel.updateProduct(requestData)
                return middleware.sendResponse(req, res, response)
            }
        } catch (error) {
            return middleware.sendErrorMessage(req, res, error)
        }
    }
    async getOrder(req, res) {
        let requestData = {}
        requestData.supplierId = req.supplierId
        if(req?.params?.id){
            requestData.id = parseInt(req.params.id)
        }
        console.log("Update Data : ", requestData)
        try {
            let response = await supplierModel.getOrder(requestData)
            return middleware.sendResponse(req, res, response)
        } catch (error) {
            return middleware.sendErrorMessage(req, res, error)
        }
    }
    async updateStocks(req, res) {
        let requestData = {}
        requestData.supplierId = req.supplierId
        if(req?.params?.id){
            requestData.id = parseInt(req.params.id)
        }
        if(req?.params?.stock){
            requestData.stock = parseInt(req.params.stock)
        }
        console.log("Update Data : ", requestData)
        try {
            let response = await supplierModel.updateStocks(requestData)
            return middleware.sendResponse(req, res, response)
        } catch (error) {
            return middleware.sendErrorMessage(req, res, error)
        }
    }
}
module.exports = new suppliersController()