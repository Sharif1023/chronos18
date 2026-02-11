
# Chronos | Luxury Watch E-Commerce

Chronos is a high-end, multi-brand watch e-commerce platform designed for exclusivity and aesthetic perfection. It features a private client portal, an immersive shopping experience, and a robust administrative atelier for collection management.

## 🏛️ Architecture

- **Frontend**: React 19, Tailwind CSS (Luxury Dark/Light Themes)
- **Routing**: React Router 7
- **Backend/Auth**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Notifications**: Formspree (Order Manifest Transmission)

## 🚀 Getting Started

### 1. Environment Configuration
Ensure your Supabase project is active and copy your credentials into `lib/supabase.ts`:
- `supabaseUrl`
- `supabaseAnonKey`

### 2. Database Setup
1. Open your **Supabase Dashboard**.
2. Navigate to the **SQL Editor**.
3. Paste the contents of `database/schema.sql` and run it. 
   - This will create the `watches`, `orders`, and `site_settings` tables.
   - It will also enable **Row Level Security (RLS)**.

### 3. Administrative Access
The dashboard is locked to a specific administrator. To access the **Atelier Dashboard** (`/admin`), you must log in with:
- **Email**: `sharifislam02001@gmail.com`

*Note: You can change the `ADMIN_EMAIL` constant in `components/ProtectedRoute.tsx` if needed.*

## 💎 Features

- **Private Atelier**: Personalized user profiles tracking collection value and acquisition history.
- **Immersive Gallery**: High-fidelity product details with technical manifestos.
- **Dynamic CMS**: Update the homepage hero section directly from the admin panel.
- **Museum Pieces**: Flag specific watches as "Featured" to highlight them on the landing page.
- **Scarcity Engine**: Automatic "Scarcity" badges for low-stock artifacts.

## 🛠️ Development

- `index.tsx`: Main entry point.
- `context/ShopContext.tsx`: Core logic for cart, products, and site configurations.
- `context/AuthContext.tsx`: Session handling and user state.
- `pages/`: Individual route components.

---
*Time is a masterpiece, meant to be worn with distinction.*
