let simpleLogin = {
    username : "required|string",
    phone : "required|digits:10",
    email : 'required|email',
    password : 'required|regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/',
    os_version : "required",
    app_version : "required",
    device_type : "required|in:A,I",
    latitude : "required|string",
    longitude : "required|string",
    address : "required|string"
}

let register = {
    email : "required|string|email",
    password : "required|string",
    name : "required|string"
}
let login = {
    email : "required|string|email",
    password : "required|string",
}

let addProduct = {
    name : "required|string|min:3",
    description : "required|string|min:8",
    price : "required|numeric",
    unit : "required|string|in:KG,G,MG,L,ML,PC,PCS,PACK,BAG,BOX,BOTTLE,CAN'",
    conversion : "required|numeric",
    stock : "required|numeric|min:1"
}
let updateProduct = {
    id: "required|numeric"
};

let newOrder = {
    buyerId : "required|numeric",
    OrderData : "required"
}


module.exports = {simpleLogin,register,login, addProduct, updateProduct, newOrder
};
