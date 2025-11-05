const buyerController = require("../controller/buyerController");
const buyerInstance = buyerController
const userRoute = (app)=>{

    //Just two Route
    app.post("/api/buyer/register",buyerInstance.register);
    app.post("/api/buyer/login",buyerInstance.login);
    app.get("/api/buyer/products",buyerInstance.getAllProduct);
    app.post("/api/buyer/orders",buyerInstance.order);
    app.get("/api/buyer/orders/:id",buyerInstance.getOrder);
    app.get("/api/buyer/orders",buyerInstance.getOrder);

}

module.exports = userRoute