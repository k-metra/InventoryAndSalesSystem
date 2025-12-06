# Inventory & Sales System — Full Project To‑Do (Laravel + React)

## 1. **Authentication & User Roles**
- [x] User registration (Admin only)
- [x] Login & logout (JWT or Laravel Sanctum)
- [x] Role-based access:
  - Admin
  - Employee
- [x] Protect routes in backend
- [x] Protect routes in React with AuthContext

---

## 2. **Products Module**
### Backend
- [x] Product model + migration  
  - name  
  - description  
  - SKU  
  - price  
  - cost  
  - stock  
  - category_id  
  - supplier_id  
- [x] CRUD endpoints  
- [x] Stock increment/decrement helpers  
- [x] Fetch low-stock items (threshold)

### Frontend
- [x] Product listing page  
- [x] Filters (category, supplier, low stock)  
- [x] Add/Edit product modal  
- [x] Delete product confirmation dialog  

---

## 3. **Inventory Management**
- [ ] Real-time stock updates  
- [ ] Inventory history logs  
  - stock in  
  - stock out  
  - adjustments  
- [ ] Endpoint for inventory logs  
- [ ] UI for viewing stock activity  

---

## 4. **Sales Module**
### Backend
- [ ] Sales model + migration  
  - product_id  
  - quantity  
  - total_price  
  - customer_id  
  - payment method  
  - created_at  
- [ ] Endpoint to create a sale (auto reduce stock)
- [ ] Endpoint to list sales

### Frontend
- [ ] Sales POS-like UI  
- [ ] Add multiple items to cart  
- [ ] Checkout modal  
- [ ] Sales history page  

---

## 5. **Customers Module**
- [ ] Customer model + migration  
- [ ] CRUD endpoints  
- [ ] Customer listing page  
- [ ] Add/Edit/Delete customer  

---

## 6. **Suppliers Module**
- [x] Supplier model + migration  
- [x] CRUD endpoints  
- [X] Supplier listing page  
- [x] Add/Edit/Delete supplier  

---

## 7. **Dashboard & Analytics**
- [x] Total Products  
- [x] Total Inventory Value  
- [ ] Total Sales (monthly)  
- [ ] Total Customers  
- [ ] Charts:
  - [x] Sales over time  
  - [x] Low stock items  
  - Category distribution  

---

## 8. **Admin Tools**
- [ ] User management (create/delete employees)
- [ ] View logs
- [ ] Role assignment  

---

## 9. **General UI/UX**
- [x] Sidebar navigation  
- [x] Collapsible sidebar  
- [ ] Dark & light theme toggle  
- [x] Notifications (success/error)  
- [x] Loading states everywhere  

---

## 10. **Deployment**
- [ ] Laravel backend on VPS (Hostinger)  
- [ ] React frontend on VPS or Vercel  
- [ ] CORS configuration  
- [ ] SSL (HTTPS)  
- [ ] Reverse proxy (Nginx)  

---

## 11. **Optional Enhancements**
- [ ] Barcode/QR scanning for products  
- [ ] Export sales reports (CSV/PDF)  
- [ ] Role-based granular permissions  
- [ ] Activity logs (who edited what)  
- [ ] Offline mode for POS  
