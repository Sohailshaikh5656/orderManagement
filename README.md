<p align="center">
  <img src="https://nodejs.org/static/images/logo.svg" width="100" alt="Node.js"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width="100" alt="Express.js"/>
  <img src="https://raw.githubusercontent.com/prisma/presskit/main/Assets/Prisma-LightSymbol.svg" width="100" alt="Prisma ORM"/>
  <img src="https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg" width="100" alt="MySQL"/>
</p>

<h1 align="center">🚀 Order Management System (Node.js + Express + Prisma + MySQL)</h1>

A **modular Order Management System** built with **Node.js**, **Express**, **Prisma ORM**, and **MySQL**, featuring secure authentication, API documentation, and a clean modular structure for scalability.

---

## 📁 Project Structure

```bash
order-management/
│
├── modules/
│   ├── v1/
│   │   ├── Admin/
│   │   │   ├── controller/
│   │   │   │   └── AdminController.js
│   │   │   ├── routes/
│   │   │   │   └── route.js
│   │   │   └── model/
│   │   │       └── adminModel.js
│   │   ├── buyer/
│   │   │   ├── model/
│   │   │   │   └── buyerModel.js
│   │   └── Api_document/
│   │       ├── route.js
│   │       └── view/
│   │           ├── api_doc.ejs
│   │           └── reference_code.ejs
│
├── middleware/
│   └── validators.js
│
├── configure/
│   └── constant.js
│
├── prisma/
│   └── schema.prisma
│
├── app.js
├── package.json
├── .env
└── README.md

```


⚙️ Installation Guide

Follow these steps to set up and run the project locally 👇

1️⃣ Clone the Repository
```bash
git clone https://github.com/Sohailshaikh5656/orderManagement.git
cd orderManagement

```

2️⃣ Install Dependencies
```bash
npm install
```

3️⃣ Setup Environment Variables
```bash
Create a .env file in the root directory:

PORT=3000
DATABASE_URL="mysql://root:password@localhost:3306/order_management"
JWT_SECRET=your_secret_key
API_KEY=your_api_key

```

4️⃣ Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init

```

5️⃣ Start the Server
```bash
npm start


or

node app.js
```


🧠 Test the API Documentation

After starting the project, open this in your browser 👇
👉 http://localhost:3000/api_doc

This will open the EJS-based API Documentation Dashboard.

🔐 Middleware Overview
Middleware	Description
validateApiKey	Validates API key from headers before processing routes.
validateHeaderToken	Checks JWT token (skips /api-doc and /uploads routes).
extractHeaderLanguage	(Optional) Extracts user’s preferred language from header.
🧩 Features

✅ Node.js + Express Backend
✅ Prisma ORM Integration (MySQL)
✅ Modular Folder Structure (v1 Modules)
✅ API Key & JWT Token Authentication
✅ Built-in API Documentation with EJS
✅ Admin Controller & Buyer Model Included
✅ Middleware-Based Request Validation
✅ CORS Enabled
✅ Easy to Extend and Maintain

🧪 Example API Endpoint

Get Analytics

GET http://localhost:3000/api/admin/analytics


Get API Docs

GET http://localhost:3000/api_doc

👨‍💻 Author

Shaikh Sohel
🎓 MCA Student @ LJ Campus
💼 Full Stack Developer (Laravel | Node.js | Next.js | Django)
📧 Email: shaikhsohail1131@gmail.com

🌐 GitHub: https://github.com/Sohailshaikh5656

🧾 License

This project is licensed under the MIT License.
Feel free to use and modify for learning or development purposes.
