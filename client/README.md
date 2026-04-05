CHARIS ATELIER - README

==================================================

🛍️ Charis Atelier  
A modern multi-vendor e-commerce platform for artisanal, ethnic, and curated lifestyle products.

--------------------------------------------------

📦 SUBMISSION STRUCTURE (IMPORTANT)

ZIP File Name:
2305088_2305080.zip

Inside the ZIP:

2305088_2305080/
├── client/                # Frontend (Next.js)
├── server/                # Backend (Node.js + Express)
├── database/
│   ├── schema.sql         # Create all tables
│   └── seed.sql           # Insert sample data
└── README.txt             # This file



--------------------------------------------------

✨ FEATURES

🛍️ Multi-Vendor Marketplace
- Sellers can create stores and manage products
- Admin approval workflow
- Store-based product ownership

👤 Role-Based Access
- Customer: Browse, order, cancel, track
- Seller: Manage products & orders
- Admin: Manage platform, delivery, payouts
- Delivery Man: Handle assigned deliveries

💳 Checkout System
- Stock locking using transactions (FOR UPDATE)
- Promo & discount support
- Cash on Delivery (COD) system
- Delivery charge calculation

📦 Order System
- Seller confirm/cancel orders
- Delivery lifecycle:
  not_ready → shipment_ready → out_for_delivery → delivered
- Order timeline tracking

💰 Payout System
- Admin-controlled payout generation
- Based on delivered orders
- Payment tracking system

🎨 UI/UX
- Modern glassmorphism design
- Responsive layout
- Consistent theme (beige / purple / sky blue)

--------------------------------------------------

🛠️ TECH STACK

Frontend:
- Next.js
- Tailwind CSS
- Redux Toolkit
- Lucide React

Backend:
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

--------------------------------------------------

🧠 SYSTEM ARCHITECTURE

Customer → Checkout → Order Created
         → Seller Confirms
         → Delivery Assigned
         → Delivered → Payout Eligible

Key Concepts:
- Transaction-safe checkout
- Role-based middleware
- Modular backend routing
- State-driven order workflow

--------------------------------------------------

🗄️ DATABASE DESIGN

Core Tables:
- users
- customers
- sellers
- admin
- delivery_man
- store
- products
- orders
- order_items
- order_status
- payouts

Highlights:
- Strong relational integrity
- Foreign key constraints
- Stock locking for consistency
- Order timeline tracking

--------------------------------------------------

🔌 API OVERVIEW

Auth:
- POST /api/auth/register
- POST /api/auth/login

Products:
- GET /api/public/products
- POST /api/seller/products

Orders:
- POST /api/checkout/create
- GET /api/orders
- PATCH /api/orders/:id/cancel

Admin:
- GET /api/admin/orders
- PATCH /api/admin/orders/:id/assign-delivery
- POST /api/admin/orders/:id/refund

Payout:
- GET /api/payouts
- POST /api/payouts/create

--------------------------------------------------

🚀 SETUP & RUN INSTRUCTIONS

1. Extract ZIP:
unzip 2305088_2305080.zip
cd 2305088_2305080

2. Setup Database (PostgreSQL):
Run:
\i database/schema.sql


3. Backend Setup:
cd server
npm install

Create .env:
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key

Run backend:
npm run dev

4. Frontend Setup:
cd client
npm install
npm run dev

5. Access:
Frontend: http://localhost:3000
Backend:  http://localhost:5000

--------------------------------------------------

📸 SCREENSHOTS
(Add screenshots if required)

--------------------------------------------------

🚀 FUTURE IMPROVEMENTS
- Online payment integration
- Real-time notifications
- Advanced analytics dashboard
- Mobile application

--------------------------------------------------

📜 LICENSE
For academic use only.

--------------------------------------------------

✨ PROJECT NOTE
This project demonstrates a complete full-stack e-commerce system with:
- multi-role architecture
- transaction-safe checkout
- real-world delivery workflow
- scalable backend design