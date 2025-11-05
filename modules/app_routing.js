class routing{
    v1(app){
        let buyer = require("./v1/buyer/route/routes")
        let admin = require("./v1/admin/route/routes")
        let supplier = require("./v1/supplier/route/routes")
        buyer(app)
        admin(app)
        supplier(app)
        
    }
}

module.exports = new routing()