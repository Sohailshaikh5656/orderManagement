
const responseCode = require("../../../../utilites/responseCode");
const common = require("../../../../utilites/common");
const { request } = require("express");
const { PrismaClient } = require("@prisma/client")
const jwt = require('jsonwebtoken');

const Prisma = new PrismaClient()

class suppliersModel {

    constructor() { }

    //Register New Admin

    async register(requestData) {
        try {
            let newSupplier = {
                email: requestData.email,
                name: requestData.name,
                password: requestData.password,
                role: "Supplier"
            }
            newSupplier.password = await common.getHashedPassword(newSupplier.password)
            const supplier = await Prisma.user.create({
                data: newSupplier
            })
            console.log("New Supplier Register : ", supplier)

            if (supplier) {
                delete supplier?.password
                let JWTToken = jwt.sign(
                    { supplier_id: supplier.id }, process.env.SECRET_KEY, { "expiresIn": "1d" }
                )
                supplier.jwtToken =  JWTToken
                return {
                    code: responseCode.SUCCESS,
                    keyword: "supplier_register",
                    data: supplier
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "insert_failed",
                    data : "Failed to Insert Data !"
                };
            }

        } catch (error) {
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "some_went_wrong",
                data: error
            }
        }
    }
    async login(requestData) {
        try {
            let supplierCredientials = {
                email: requestData.email,
                password: requestData.password,
            }
            const supplier = await Prisma.user.findUnique({
                where : {email : supplierCredientials.email, role : "Supplier"}
            })
            console.log("Supplier Login : ", supplier)

            if (supplier) {
                const compare = await common.comparePasswords(supplierCredientials.password, supplier.password)
                if (!compare) {
                    return {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "password not matched",
                        data: "Entered a Wrong Password !"
                    }
                }
                delete supplier?.password
                let JWTToken = jwt.sign(
                
                    { supplier_id: supplier.id }, process.env.SECRET_KEY, { "expiresIn": "1d" }
                
                )

                supplier.JWTToken = JWTToken
                return {
                    code: responseCode.SUCCESS,
                    keyword: "supplier_login",
                    data: supplier
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "supplier_not_found",
                    data : "Wrong Email for Supplier Login ! Or Email Not Found"
                };
            }

        } catch (error) {
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "some_went_wrong",
                data: error
            }
        }
    }

    async addProduct(requestData){
         try {
            let ProductData = {
                name: requestData.name,
                description : requestData.description,
                price : requestData.price,
                unit : requestData.unit,
                conversion : requestData.conversion,
                stock : requestData.stock,
                supplierId : requestData.supplierId
            }
            const product = await Prisma.product.create({
                data:ProductData
            })
            console.log("Add Product : ", product)

            if (product) {
                return {
                    code: responseCode.SUCCESS,
                    keyword: "product_added",
                    data: product
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "product_not_added",
                    data : "Failed to Add Product"
                };
            }

        } catch (error) {
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "some_went_wrong",
                data: error
            }
        }
    }

    async updateProduct(requestData){
        try{
            let updateProductData = {
                id : requestData.id
            }

            if(requestData?.name){
                updateProductData.name = requestData.name
            }
            if(requestData?.description){
                updateProductData.description = requestData.description
            }
            if(requestData?.price){
                updateProductData.price = requestData.price
            }
            if(requestData?.conversion){
                updateProductData.conversion = requestData.conversion
            }
            if(requestData?.stock){
                updateProductData.conversion = requestData.stock
            }
            
            const product = await Prisma.product.update({
                where:{id:updateProductData.id},
                data : updateProductData
            })
            if(product){
                return {
                    code: responseCode.SUCCESS,
                    keyword: "product_updated",
                    data: product
                }
            }
        }catch(error){
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "some_went_wrong",
                data: error
            }
        }
    }
    async updateProduct(requestData){
        try{
            let updateProductData = {
                id : requestData.id
            }
            
            const product = await Prisma.product.update({
                where:{id:updateProductData.id, supplierId : requestData.supplierId},
                data : {
                    stock : requestData.stock
                }
            })
            if(product){
                return {
                    code: responseCode.SUCCESS,
                    keyword: "product_stock_updated",
                    data: product
                }
            }
        }catch(error){
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "some_went_wrong",
                data: error
            }
        }
    }

    async getOrder(requestData) {
        try {
            let filter = {

            }
            if(requestData.id){
                filter.id = requestData.id
            }
            filter.product = {
                    supplierId:requestData.supplierId
                }
            console.log("Supplier ID : ",requestData.supplierId)
           const OrderItems = await Prisma.OrderItems.findMany({
            where : filter,include:{
                product:true
            },orderBy:{
                id:'desc'
            }
           })

           if (OrderItems.length > 0) {
                return {
                    code: responseCode.SUCCESS,
                    keyword: "order_items",
                    data: OrderItems
                }
            }else if (OrderItems.length <=0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "no_order_items",
                    data: "No Order Items Found !"
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "order_items_not_found",
                    data : "Error in Finding Order Items According Supplier"
                };
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "some_went_wrong",
                data: error
            }
        }
    }

}

module.exports = new suppliersModel()
