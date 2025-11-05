const supplierController = require("../controller/supplierController");
const supplierInstance = supplierController
const userRoute = (app)=>{

    //Just two Route
    app.post("/api/supplier/register",supplierInstance.register);
    app.post("/api/supplier/login",supplierInstance.login);
    app.post("/api/supplier/products",supplierInstance.addProduct);
    app.get("/api/supplier/orders",supplierInstance.getOrder);
    app.get("/api/supplier/orders/:id",supplierInstance.getOrder);
    app.get("/api/supplier/products/:id/:stock",supplierInstance.updateStocks);

}

module.exports = userRoute