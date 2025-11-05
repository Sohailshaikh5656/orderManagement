
const responseCode = require("../../../../utilites/responseCode");
const common = require("../../../../utilites/common");
const { request } = require("express");
const { PrismaClient } = require("@prisma/client")
const jwt = require('jsonwebtoken');

const Prisma = new PrismaClient()

class buyerModel {

    constructor() { }

    //Register New Admin

    async register(requestData) {
        try {
            let newBuyer = {
                email: requestData.email,
                name: requestData.name,
                password: requestData.password,
                role: "Buyer"
            }
            newBuyer.password = await common.getHashedPassword(newBuyer.password)
            const buyer = await Prisma.user.create({
                data: newBuyer
            })
            console.log("New Buyer Register : ", buyer)

            if (buyer) {
                delete buyer?.password
                let JWTToken = jwt.sign(
                    { buyer_id: buyer.id }, process.env.SECRET_KEY, { "expiresIn": "1d" }
                )
                buyer.jwtToken = JWTToken
                return {
                    code: responseCode.SUCCESS,
                    keyword: "buyer_register",
                    data: buyer
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "insert_failed",
                    data: "Failed to Insert Data !"
                };
            }

        } catch (error) {
            console.error("Error in register:", error);

            //Dublicate Email
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "email_exists",
                    data: "This email is already registered. Please use another email."
                };
            }
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "some_went_wrong",
                data: error
            }
        }
    }
    async login(requestData) {
        try {
            let BuyerCredientials = {
                email: requestData.email,
                password: requestData.password,
            }
            const buyer = await Prisma.user.findUnique({
                where: { email: BuyerCredientials.email, role: "Buyer" }
            })
            console.log("buyer Login : ", buyer)

            if (buyer) {
                const compare = await common.comparePasswords(BuyerCredientials.password, buyer.password)
                if (!compare) {
                    return {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "password not matched",
                        data: "Entered a Wrong Password !"
                    }
                }
                delete buyer?.password
                let JWTToken = jwt.sign(

                    { buyer_id: buyer.id }, process.env.SECRET_KEY, { "expiresIn": "1d" }

                )

                buyer.JWTToken = JWTToken
                return {
                    code: responseCode.SUCCESS,
                    keyword: "buyer_login",
                    data: buyer
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "buyer_not_found",
                    data: "Wrong Email for Buyer Login ! Or Email Not Found"
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
    async getAllProduct(requestData) {
        try {
            const products = await Prisma.product.findMany()
            console.log("All Products : ", products)

            if (products) {
                return {
                    code: responseCode.SUCCESS,
                    keyword: "all_products",
                    data: products
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "product_not_found",
                    data: "No product Found !"
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
    async order(requestData) {
        try {
            let GrandTotal = 0
            let newOrder = {
                buyerId: requestData.buyerId
            }
            const order = await Prisma.order.create({
                data: newOrder
            })
            console.log("Order : ", order)
            if (order) {
                for (let i = 0; i < requestData.OrderData.length; i++) {
                    let productOrder = requestData.OrderData[i]
                    let productObject = await Prisma.product.findUnique({
                        where: { id: productOrder.productId }
                    })
                    if (productObject?.id) {
                        let orderItem = {
                            orderId: order.id,
                            productId: productOrder.productId,
                            quantity: productOrder.quantity,
                            price: productObject.price,
                            totalPrice: productObject.price * productOrder.quantity,
                            uom: productObject.unit
                        }
                        GrandTotal += orderItem.totalPrice
                        const orderItemCreate = await Prisma.orderItems.create({
                            data: orderItem
                        })
                        const updateStock = await Prisma.product.update({
                            where : {id : productObject.id} ,data : {
                                stock : productObject.stock - productOrder.quantity
                            }
                        })
                    }
                }
            }

            const StatusLogCreate = await Prisma.StatusLog.create({
                data: {
                    orderId: order.id,
                    status: order.status
                }
            })


            const updateThisOrder = await Prisma.order.update({
                where: { id: order.id }, data: { grandTotal: GrandTotal }
            })

            if (updateThisOrder) {
                return {
                    code: responseCode.SUCCESS,
                    keyword: "order_placed",
                    data: { order: updateThisOrder, OrderStatus: StatusLogCreate }
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "order_not_placed",
                    data: "Error in Order Placeing !"
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

    async getOrder(requestData) {
        try {
            let orderId = requestData.orderId
            let buyerId = requestData.buyerId
            let order
            if (requestData.orderId) {
                order = await Prisma.order.findUnique({
                    where: { id: requestData.orderId, buyerId }
                })
                let StatusLogs = await Prisma.StatusLog.findMany({
                    where: { orderId: requestData.orderId }
                })
                let OrderDetails = await Prisma.orderItems.findMany({
                    where: { orderId }, include: {
                        product: true
                    }
                })

                if (order) {
                    order.StatusLog = StatusLogs,
                        order.OrderDetails = OrderDetails
                    return {
                        code: responseCode.SUCCESS,
                        keyword: "all_Order",
                        data: order
                    }
                } else {
                    return {
                        code: responseCode.SUCCESS,
                        keyword: "order_not_founr",
                        data: "Failed to Fetch Order"
                    }
                }
            } else {

                order = await Prisma.order.findMany({
                    where: { orderId }
                })

                console.log("nanla Order : ",order)
                if (order) {
                    for (let i = 0; i < order.length; i++) {
                        let StatusLogs = await Prisma.StatusLog.findMany({
                            where: { orderId: order[i].orderId }
                        })

                        let OrderDetails = await Prisma.orderItems.findMany({
                            where: { orderId: order[i].orderId }, include: {
                                product: true
                            }
                        })

                        order[i].StatusLogs = StatusLogs
                        order[i].orderDetails = OrderDetails
                    }
                    return {
                        code: responseCode.SUCCESS,
                        keyword: "all_Order",
                        data: order
                    }
                }
                return {
                    code: responseCode.SUCCESS,
                    keyword: "order_not_founr",
                    data: "Failed to Fetch Order"
                }
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

module.exports = new buyerModel()
