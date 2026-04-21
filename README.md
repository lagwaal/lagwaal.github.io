# Lagwal Ecommerce — Premium Glove Store

Lagwal is a state-of-the-art ecommerce platform designed for a premium glove brand. It features a seamless integration of product showcase, local order management, and a WhatsApp-based checkout workflow.

## 🌟 Key Features

- **Premium UI/UX**: Dark-themed aesthetic with gold accents, professional typography, and smooth animations.
- **WhatsApp Checkout**: Orders are instantly sent to the store's WhatsApp for quick communication and confirmation.
- **Admin Dashboard**: Full control over products, orders, and store analytics.
- **Local Storage Engine**: All data (products, orders, settings) persists in the browser's local storage for a zero-backend setup.
- **Responsive Design**: Optimized for both mobile and desktop experiences.

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Vanilla CSS (Custom Design System)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access Admin Panel**:
   Navigate to `/admin` to access the dashboard. (Default password: `admin123`)

## 📁 Project Structure

- `src/components`: Reusable UI components.
- `src/context`: Cart and Product state management.
- `src/data`: Initial seed data for products.
- `src/pages`: Main application pages (Home, Products, Checkout, Admin).
- `src/utils`: Storage helpers and WhatsApp integration logic.

## 🔒 Security & Persistence

This application uses `localStorage` for data persistence. To clear all data, you can use the "Reset Store" option in the Admin Settings or clear your browser's local storage.

