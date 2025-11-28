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
- [ ] Product model + migration  
  - name  
  - description  
  - SKU  
  - price  
  - cost  
  - stock  
  - category_id  
  - supplier_id  
- [ ] CRUD endpoints  
- [ ] Stock increment/decrement helpers  
- [ ] Fetch low-stock items (threshold)

### Frontend
- [ ] Product listing page  
- [ ] Filters (category, supplier, low stock)  
- [ ] Add/Edit product modal  
- [ ] Delete product confirmation dialog  

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
- [ ] Supplier model + migration  
- [ ] CRUD endpoints  
- [ ] Supplier listing page  
- [ ] Add/Edit/Delete supplier  

---

## 7. **Dashboard & Analytics**
- [ ] Total Products  
- [ ] Total Inventory Value  
- [ ] Total Sales (monthly)  
- [ ] Total Customers  
- [ ] Charts:
  - Sales over time  
  - Low stock items  
  - Category distribution  

---

## 8. **Admin Tools**
- [ ] User management (create/delete employees)
- [ ] View logs
- [ ] Role assignment  

---

## 9. **General UI/UX**
- [ ] Sidebar navigation  
- [ ] Collapsible sidebar  
- [ ] Dark & light theme toggle  
- [ ] Notifications (success/error)  
- [ ] Loading states everywhere  

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
