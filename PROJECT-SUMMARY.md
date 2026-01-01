# Transportation Management System (TMS)

Complete full-stack application for interview assignment

## 🎯 Project Overview

A modern Transportation Management System built with React frontend and Node.js/GraphQL backend. Features authentication, role-based access control, dual view modes (grid/tile), and complete CRUD operations for shipments.

## 🚀 Tech Stack

### Backend
- **Node.js v22.17.0** with ES6 modules
- **Express.js** - Web framework
- **Apollo Server v3** - GraphQL API
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Fake Store API** - Data source (20 products → shipments)

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **React Router** - Navigation

## 📁 Project Structure

```
TMS/
├── backend/
│   ├── src/
│   │   ├── index.js              # Server entry point
│   │   ├── data/
│   │   │   └── sampleData.js     # Fetch from Fake Store API
│   │   ├── schema/
│   │   │   └── typeDefs.js       # GraphQL schema
│   │   ├── resolvers/
│   │   │   ├── index.js
│   │   │   ├── queries.js        # Read operations
│   │   │   └── mutations.js      # Write operations
│   │   └── utils/
│   │       └── auth.js           # JWT & password utils
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx        # Hamburger menu
    │   │   ├── Header.jsx         # Horizontal menu
    │   │   ├── ShipmentGrid.jsx   # Table view
    │   │   ├── ShipmentTiles.jsx  # Card view
    │   │   ├── DetailModal.jsx    # Detail popup
    │   │   └── ViewToggle.jsx     # Grid/Tile toggle
    │   ├── pages/
    │   │   ├── Login.jsx          # Login page
    │   │   └── Dashboard.jsx      # Main dashboard
    │   ├── apollo-client.js       # GraphQL setup
    │   ├── App.jsx                # Main app
    │   └── main.jsx               # Entry point
    ├── package.json
    └── README.md
```

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at: **http://localhost:4000/graphql**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

## 🔑 Test Accounts

| Username | Password     | Role     | Permissions              |
|----------|-------------|----------|--------------------------|
| admin    | password123 | Admin    | Full CRUD access         |
| employee | password123 | Employee | View & change status only|

## ✨ Features

### Backend Features
- ✅ GraphQL API with 5 mutations, 4 queries
- ✅ JWT authentication & authorization
- ✅ Role-based access control (Admin/Employee)
- ✅ Fetch 20 shipments from Fake Store API
- ✅ Filtering, sorting, pagination
- ✅ Password hashing with bcrypt
- ✅ Comprehensive test suite (14 tests, all passing)
- ✅ Clean code with normal function syntax

### Frontend Features
- ✅ **Login System** - JWT authentication
- ✅ **Hamburger Menu** - Sidebar with 1-level submenu
- ✅ **Horizontal Menu** - Header navigation (Home, Tracking, Reports, Help)
- ✅ **Grid View** - Table with 10 columns
- ✅ **Tile View** - Card layout with essential fields
- ✅ **View Toggle** - Switch between grid/tile modes
- ✅ **Options Menu (⋮)** - Edit, Flag, Delete on each tile
- ✅ **Detail Modal** - Click shipment to see all 21 fields
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Role-Based UI** - Admin sees edit/delete, Employee doesn't

## 📋 API Endpoints

### Mutations

| Mutation        | Input                           | Output      | Access  | Description           |
|-----------------|---------------------------------|-------------|---------|----------------------|
| login           | username, password              | token, user | Public  | Login and get JWT    |
| register        | username, password, role        | token, user | Public  | Create new user      |
| addShipment     | ShipmentInput                   | Shipment    | Admin   | Create shipment      |
| updateShipment  | id, UpdateShipmentInput         | Shipment    | Admin   | Update shipment      |
| deleteShipment  | id                              | String      | Admin   | Delete shipment      |

### Queries

| Query                 | Input                        | Output             | Access        | Description              |
|-----------------------|------------------------------|-------------------|---------------|--------------------------|
| listShipments         | filter, sortBy, sortOrder    | [Shipment]        | Authenticated | List all shipments       |
| getShipment           | id                           | Shipment          | Authenticated | Get single shipment      |
| listShipmentsPaginated| page, limit, filter, sortBy  | ShipmentConnection| Authenticated | List with pagination     |
| me                    | -                            | User              | Authenticated | Get current user         |

## 🧪 Testing

### Backend Tests

```bash
cd backend
.\test-backend.ps1
```

**All 14 tests passing:**
- Admin login
- Employee login
- List shipments
- Get shipment by ID
- Pagination
- Filtering (by status, priority, origin, destination)
- Sorting
- Add shipment (Admin only)
- Update shipment (Admin only)
- Delete shipment (Admin only)
- Employee restrictions
- Current user info
- Unauthenticated blocking

## 🎨 UI Screenshots

### Login Page
- Gradient background (blue to purple)
- Clean form with username/password
- Test credentials displayed

### Dashboard - Tile View
- Card layout with 3-4 columns
- Status badges (color-coded)
- Priority badges
- Options menu (⋮) on each card
- Tracking #, Description, Status, Carrier, Destination

### Dashboard - Grid View
- Table with 10 columns
- Sortable headers
- Hover effects
- Click to view details

### Detail Modal
- Full shipment information (21 fields)
- Clean layout with labels
- Close button
- Scrollable for long content

### Sidebar Menu
- Hamburger icon on mobile
- Shipments submenu (All, In Transit, Delivered)
- User info at bottom
- Logout button

### Header
- Horizontal navigation
- Notification icon
- Profile icon
- Responsive hamburger for mobile

## 🔧 Configuration

### Backend (.env)
```
PORT=4000
JWT_SECRET=your-secret-key-change-in-production
```

### Frontend (apollo-client.js)
```javascript
uri: 'http://localhost:4000/graphql'
```

## 📦 Data Model

### Shipment Type (21 fields)
- id, trackingNumber, description
- origin, destination, carrier
- status, priority
- shipDate, estimatedDelivery, actualDelivery
- weight, dimensions (length, width, height)
- cost, sender, recipient
- specialInstructions
- createdAt, updatedAt

### User Type
- id, username, password (hashed)
- role (Admin/Employee)
- createdAt

## 🌐 Deployment Notes

### Backend Deployment
- Ensure PORT environment variable is set
- Use production JWT secret
- Enable CORS for frontend domain
- Consider rate limiting

### Frontend Deployment
- Build: `npm run build`
- Update Apollo Client URI to production backend
- Deploy to Netlify/Vercel/etc.
- Set environment variables

## 💡 Code Style

- ✅ Normal function declarations (no arrow functions)
- ✅ Clear variable names
- ✅ Comments for complex logic
- ✅ Consistent formatting
- ✅ "3rd year college student" readable code

## 🎓 Interview Highlights

This project demonstrates:
1. **Full-Stack Skills** - React frontend + Node.js backend
2. **GraphQL Expertise** - Schema design, resolvers, queries, mutations
3. **Authentication** - JWT, bcrypt, role-based access
4. **UI/UX Design** - Dual views, responsive layout, clean interface
5. **Code Quality** - Clean, readable, well-structured
6. **Testing** - Comprehensive test coverage
7. **Problem Solving** - Real API integration, data transformation
8. **Documentation** - Clear README files

## 📞 Support

For questions or issues, refer to:
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Test script: `backend/test-backend.ps1`

---

**Built with ❤️ for interview assignment**
