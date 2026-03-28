
CHARIS ATELIER -  README

==================================================

✨ CharisAtelier
A modern multi-vendor e-commerce platform for artisanal, ethnic, and curated lifestyle products.

--------------------------------------------------

📖 TABLE OF CONTENTS
- Features
- Tech Stack
- System Architecture
- Database Design
- API Overview
- Getting Started
- Screenshots (placeholder)
- Future Improvements
- Contributing
- License

--------------------------------------------------

✨ FEATURES

🛍️ Multi-Vendor Marketplace
- Sellers can create stores and manage products
- Admin approval workflow
- Store-based product ownership

👤 Role-Based Access
- Customer: Browse, order, cancel, track
- Seller: Manage products & orders
- Admin: Manage platform, payouts, delivery
- Delivery: Handle deliveries

💳 Checkout System
- Stock locking (FOR UPDATE)
- Promo & discount system
- COD / Online-ready payment
- Delivery charge integration

📦 Order System
- Seller confirm/cancel
- Delivery lifecycle:
  not_ready → shipment_ready → out_for_delivery → delivered
- Order timeline tracking

💰 Payout System
- Admin payout creation
- Delivered-order-based payout
- Payment tracking

🎨 UI/UX
- Glassmorphism + gradients
- Responsive design
- Unified theme (beige / purple / sky blue)

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
- Transaction safety
- Role middleware
- Modular routing
- State-driven workflow

--------------------------------------------------

🗄️ DATABASE DESIGN

Core Tables:
- users
- sellers
- customers
- admin
- products
- store
- orders
- order_items
- order_status
- payouts

Highlights:
- Relational integrity
- Cascading deletes
- Stock locking
- Timeline tracking

--------------------------------------------------

🔌 API OVERVIEW

Auth:
- POST /api/auth/login
- POST /api/auth/register

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

🚀 GETTING STARTED

1. Clone repo:
git clone https://github.com/your-username/CharisAtelier.git

2. Install dependencies:
cd client && npm install
cd server && npm install

3. Setup .env:
PORT=5000
DATABASE_URL=your_db
JWT_SECRET=your_secret

4. Run:
cd server && npm run dev
cd client && npm run dev

5. Open:
http://localhost:3000

--------------------------------------------------

📸 SCREENSHOTS
(Add your UI screenshots here)

--------------------------------------------------

🚀 FUTURE IMPROVEMENTS
- Online payment integration
- Real-time notifications
- Analytics dashboard
- Mobile app version

--------------------------------------------------

🤝 CONTRIBUTING
- Fork repo
- Create branch
- Commit
- PR

--------------------------------------------------

📜 LICENSE
MIT License

--------------------------------------------------

✨ Built with passion for combining technology, art, and commerce.