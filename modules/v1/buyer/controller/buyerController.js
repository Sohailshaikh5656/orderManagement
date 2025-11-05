const Validator = require("Validator")
const middleware = require("../../../../middleware/validators")
const validationRules = require("../../../../utilites/rules")
const buyerModel = require("../model/buyerModel");
const common = require("../../../../utilites/common");
const message = require('../../../../language/en');
const { required } = require('../../../../language/ar');

class buyerController {
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
                let response = await buyerModel.register(requestData)
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
                let response = await buyerModel.login(requestData)
                return middleware.sendResponse(req, res, response)
            }
        } catch (error) {
            return middleware.sendErrorMessage(req,res,error)
        }
    }
    async order(req,res) {

        let requestData =  req.body
        requestData.buyerId = req.buyerId
        console.log("Data : ", req.body)
        let rules = validationRules.newOrder;
        // FIX: Check if req.language exists and has required property
        let message = {
            required: req.language?.required
        }
        let keywords = {}
        try {
            if(middleware.checkValidationRules(req,res,requestData,rules,message,keywords)){
                let response = await buyerModel.order(requestData)
                return middleware.sendResponse(req, res, response)
            }
        } catch (error) {
            console.log("Error : ",error)
            return middleware.sendErrorMessage(req,res,error)
        }
    }
    async getOrder(req,res) {

        let requestData =  {}
        requestData.buyerId = req.buyerId
        if(req.params?.id){
            requestData.orderId = parseInt(req.params?.id)
        }
        console.log("Data : ", req.body)
        try {
            let response = await buyerModel.getOrder(requestData)
            return middleware.sendResponse(req, res, response)
        } catch (error) {
            console.log("Error : ",error)
            return middleware.sendErrorMessage(req,res,error)
        }
    }
    async getAllProduct(req,res) {

        let requestData =  req.body
        console.log("Data : ", req.body)
        try {
            let response = await buyerModel.getAllProduct(requestData)
            return middleware.sendResponse(req, res, response)
        } catch (error) {
            return middleware.sendErrorMessage(req,res,error)
        }
    }

    
}
module.exports = new buyerController()