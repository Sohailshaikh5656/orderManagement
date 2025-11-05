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
