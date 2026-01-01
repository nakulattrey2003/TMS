# TMS Frontend

Transportation Management System - React Frontend

## Features

✅ **Login System**
- Admin and Employee roles
- JWT authentication
- Test accounts: admin/password123, employee/password123

✅ **Hamburger Menu (Sidebar)**
- Dashboard
- Shipments (with submenu: All, In Transit, Delivered)
- Analytics
- Settings
- User info and logout

✅ **Horizontal Menu (Header)**
- Home
- Tracking
- Reports
- Help
- Notification and profile icons

✅ **Dual View Modes**
- **Grid View**: Table with 10 columns (Tracking #, Description, Origin, Destination, Carrier, Status, Priority, Ship Date, ETA, Cost)
- **Tile View**: Card layout with essential fields
- Toggle button to switch between views

✅ **Options Menu (⋮)**
- Edit (Admin only) - Update shipment details
- Flag - Change shipment status
- Delete (Admin only) - Remove shipment

✅ **Detail View**
- Click any shipment to see full details
- Modal popup with all 21 fields
- Close button to return to list

✅ **Responsive Design**
- Mobile-friendly hamburger menu
- Tailwind CSS styling
- Clean, modern UI

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **React Router** - Navigation

## Getting Started

### Prerequisites

- Node.js v22.17.0
- Backend server running at http://localhost:4000

### Installation

```bash
cd frontend
npm install
```

### Run Development Server

```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx        # Hamburger menu with submenu
│   │   ├── Header.jsx         # Horizontal menu bar
│   │   ├── ShipmentGrid.jsx   # Table view (10 columns)
│   │   ├── ShipmentTiles.jsx  # Card/tile view
│   │   ├── DetailModal.jsx    # Shipment detail popup
│   │   └── ViewToggle.jsx     # Grid/Tile toggle button
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   └── Dashboard.jsx      # Main dashboard with all views
│   ├── apollo-client.js       # GraphQL client setup
│   ├── App.jsx                # Main app with routing
│   └── main.jsx               # Entry point
├── package.json
└── vite.config.js
```

## Test Accounts

| Username | Password     | Role     |
|----------|-------------|----------|
| admin    | password123 | Admin    |
| employee | password123 | Employee |

## Features by Role

### Admin
- View all shipments
- Add new shipments
- Edit shipments
- Delete shipments
- Change status (flag)

### Employee
- View all shipments
- Change status (flag)

## API Connection

Frontend connects to backend GraphQL API at:
```
http://localhost:4000/graphql
```

JWT token stored in localStorage after login.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Notes

- Sidebar auto-collapses on mobile
- All data fetched from backend API
- Real-time updates after mutations
- Clean code with normal function syntax (no arrow functions)
