const adminController = require("../controller/adminController");
const adminInstance = adminController
const userRoute = (app)=>{

    //Just two Route
    app.post("/api/admin/register",adminInstance.register);
    app.post("/api/admin/login",adminInstance.login);
    app.get("/api/admin/orders/:id/:status",adminInstance.updateOrderStatus);
    app.get("/api/admin/analytics",adminInstance.analytics);
    // app.get("/api/properties",adminInstance.getProperties);
    // app.post("/api/login",userInstance.login)

}

module.exports = userRoute