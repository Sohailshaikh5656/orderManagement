<p align="center">
  <img src="https://nodejs.org/static/images/logo.svg" width="100" alt="Node.js"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width="100" alt="Express.js"/>
  <img src="https://raw.githubusercontent.com/prisma/presskit/main/Assets/Prisma-LightSymbol.svg" width="100" alt="Prisma ORM"/>
  <img src="https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg" width="100" alt="MySQL"/>
</p>

<h1 align="center">🚀 Order Management System (Node.js + Express + Prisma + MySQL)</h1>

A **modular Order Management System** built with **Node.js**, **Express**, **Prisma ORM**, and **MySQL**, featuring secure authentication, API documentation, and a clean modular structure for scalability.

---


📸 **Project Demo**

<div align="center">
<hr />
<img src='./ScreenShot/s1.png' height=400>
<br />
<hr />
<img src='./ScreenShot/s2.png' height=400>
<br />
<hr />
<img src='./ScreenShot/s3.png' height=400>
<br />
<hr />
<img src='./ScreenShot/s4.png' height=400>
<br />
<hr />
</div>

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

After starting the project, open this in your browser 👇<br>
👉 http://localhost:3000/api-doc

This will open the EJS-based API Documentation Dashboard.<br>
<br>
🔐 Middleware Overview
Middleware	Description
validateApiKey	Validates API key from headers before processing routes.<br>
validateHeaderToken	Checks JWT token (skips /api-doc and /uploads routes).<br>
extractHeaderLanguage	(Optional) Extracts user’s preferred language from header.<br>

<br>
🧩 Features<br><br>

✅ Node.js + Express Backend<br>
✅ Prisma ORM Integration (MySQL)<br>
✅ Modular Folder Structure (v1 Modules)<br>
✅ API Key & JWT Token Authentication<br>
✅ Built-in API Documentation with EJS<br>
✅ Admin Controller & Buyer Model Included<br>
✅ Middleware-Based Request Validation<br>
✅ CORS Enabled<br>
✅ Easy to Extend and Maintain<br><br>

🧪 Example API Endpoint<br><br>

Get Analytics<br>

GET http://localhost:3000/api/admin/analytics<br><br>


Get API Docs<br>

GET http://localhost:3000/api-doc<br>

👨‍💻 Author<br><br>

Shaikh Sohel<br>
🎓 MCA Student @ LJ Campus<br>
💼 Full Stack Developer (Laravel | Node.js | Next.js | Django)<br>
📧 Email: shaikhsohail1131@gmail.com<br>

🌐 GitHub: https://github.com/Sohailshaikh5656

🧾 License

This project is licensed under the MIT License.
Feel free to use and modify for learning or development purposes.
