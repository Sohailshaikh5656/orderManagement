
const responseCode = require("../../../../utilites/responseCode");
const common = require("../../../../utilites/common");
const { request } = require("express");
const { PrismaClient } = require("@prisma/client")
const jwt = require('jsonwebtoken');
const { status } = require("init");

const Prisma = new PrismaClient()

class adminModel {

    constructor() { }

    //Register New Admin

    async register(requestData) {
        try {
            let newAdmin = {
                email: requestData.email,
                name: requestData.name,
                password: requestData.password,
                role: "Admin"
            }
            newAdmin.password = await common.getHashedPassword(requestData.password)
            const admin = await Prisma.user.create({
                data: newAdmin
            })
            console.log("New Admin Register : ", admin)

            if (admin) {
                delete admin?.password
                let JWTToken = jwt.sign(
                    { admin_id: admin.id }, process.env.SECRET_KEY, { "expiresIn": "1d" }
                )
                admin.jwtToken = JWTToken
                return {
                    code: responseCode.SUCCESS,
                    keyword: "admin_register",
                    data: admin
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "insert_failed",
                    data: "Failed to Insert Data !"
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
            let adminCredintails = {
                email: requestData.email,
                password: requestData.password,
            }
            const admin = await Prisma.user.findUnique({
                where: { email: adminCredintails.email, role: "Admin" }
            })
            console.log("New Admin Register : ", admin)

            if (admin) {
                const compare = await common.comparePasswords(requestData.password, admin.password)
                if (!compare) {
                    return {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "password not matched",
                        data: "Entered a Wrong Password !"
                    }
                }
                delete admin?.password
                let JWTToken = jwt.sign(

                    { admin_id: admin.id }, process.env.SECRET_KEY, { "expiresIn": "1d" }

                )

                admin.JWTToken = JWTToken
                return {
                    code: responseCode.SUCCESS,
                    keyword: "admin_login",
                    data: admin
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "admin_not_found",
                    data: "Wrong Email for Admin Login ! Or Email Not Found"
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
    async updateOrderStatus(requestData) {
        try {

            const statusArray = ["Pending", "Approved", "Fulfilled", "Cancelled"]
            let flag = false;
            for (let i = 0; i < statusArray.length; i++) {
                if (statusArray[i].toLowerCase() == requestData.status.toLowerCase()) {
                    requestData.status = statusArray[i]
                    flag = !flag
                }
            }
            if (!flag) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "wrong_status",
                    data: `Choose status from this [${statusArray}]`
                };
            }
            const checkStatus = await Prisma.order.findUnique({
                where: { id: requestData.orderId }
            })
            if (checkStatus.status.toLowerCase() === requestData.status.toLowerCase()) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "Already Status Changed",
                    data: `${requestData.status} status is Already Changed !`
                };
            }
            const orderStatus = await Prisma.order.update({
                where: { id: requestData.orderId },
                data: { status: requestData.status }
            })
            const status = await Prisma.StatusLog.create({
                data: {
                    orderId: requestData.orderId,
                    status: requestData.status
                }
            })
            if (requestData.status.toLowerCase() === statusArray[3].toLowerCase()) {
                const orderData = await Prisma.orderItems.findMany({
                    where: { orderId: requestData.orderId }
                });

                if (Array.isArray(orderData)) {
                    await Promise.all(
                        orderData.map(item =>
                            Prisma.product.update({
                                where: { id: item.productId },
                                data: { stock: { increment: item.quantity } }
                            })
                        )
                    );
                }
            }


            console.log("Status Changed ! : ", status)

            if (status) {
                return {
                    code: responseCode.SUCCESS,
                    keyword: "status_changed",
                    data: status
                }
            } else {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "error_in_status_change",
                    data: "Error in Stataus Change !"
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
    async analytics(requestData) {
        try {

            const analyticData = {
                totalUser: 0,
                Buyer: 0,
                Supplier: 0,
                totalProduct: 0,
                order: { total: 0, Pending: 0, Approved: 0, Fullfilled: 0, Cancelled: 0 }
            }

            //Running AAll Query
            const [userCounts,
                totalProduct,
                OrderStatus
            ] = await Promise.all([
                //User Count
                Prisma.user.groupBy({
                    by: ["role"],
                    where: { role: { in: ["Supplier", "Buyer"] } },
                    _count: { role: true }
                }),
                //Ti=otal Product
                Prisma.product.count(),

                //Order Count
                Prisma.order.groupBy({
                    by: ['status'],
                    where: { status: { in: ['Pending', 'Approved', 'Fulfilled', 'Cancelled'] } },
                    _count: { status: true }
                }),

            ])

            // === Process User Counts ===
            userCounts.forEach(u => {
                if (u.role === 'Buyer') analyticData.Buyer = u._count.role;
                if (u.role === 'Supplier') analyticData.Supplier = u._count.role;
            });
            analyticData.totalUser = analyticData.Buyer + analyticData.Supplier;

            // === Total Products ===
            analyticData.totalProduct = totalProduct;

            // === Order Status Counts ===
            OrderStatus.forEach(o => {
                analyticData.order[o.status] = o._count.status;
                analyticData.order.total += o._count.status;
            });


            // === Return Success ===
            return {
                code: responseCode.SUCCESS,
                keyword: "Dashboard data",
                data: analyticData
            };
        } catch (error) {
            console.error("Analytics Error:", error);
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "some_went_wrong",
                data: error.message
            };
        }
    }

}

module.exports = new adminModel()
