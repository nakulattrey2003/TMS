# TMS Backend - GraphQL API

Transportation Management System Backend built with Node.js, Express, and Apollo GraphQL.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Server: `http://localhost:4000` | GraphQL Playground: `http://localhost:4000/graphql`

## 🔑 Test Credentials

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | `admin` | `password123` | Full CRUD |
| Employee | `employee` | `password123` | Read-only |

## 📊 Data Source

Fetches **20 products** from [Fake Store API](https://fakestoreapi.com/products?limit=20) and transforms them into shipment data.

---

## 🔌 API Endpoints

### Mutations (Write Operations)

| Operation | Input | Output | Access | Description |
|-----------|-------|--------|--------|-------------|
| **login** | `username: String!`<br>`password: String!` | `User` (token, id, username, role) | Public | Authenticate and get JWT token |
| **register** | `username: String!`<br>`password: String!`<br>`role: String` | `User` (token, id, username, role) | Public | Create new user account |
| **addShipment** | `input: ShipmentInput!` | `Shipment` | Admin only | Create new shipment |
| **updateShipment** | `id: ID!`<br>`input: ShipmentInput!` | `Shipment` | Admin only | Update existing shipment |
| **deleteShipment** | `id: ID!` | `Boolean!` | Admin only | Delete shipment by ID |

### Queries (Read Operations)

| Operation | Input | Output | Access | Description |
|-----------|-------|--------|--------|-------------|
| **listShipments** | `filter: ShipmentFilter`<br>`sortBy: SortField`<br>`sortOrder: SortOrder` | `[Shipment!]!` | Authenticated | Get all shipments with filters/sorting |
| **getShipment** | `id: ID!` | `Shipment` | Authenticated | Get single shipment by ID |
| **listShipmentsPaginated** | `page: Int`<br>`limit: Int`<br>`filter: ShipmentFilter`<br>`sortBy: SortField`<br>`sortOrder: SortOrder` | `ShipmentConnection!` | Authenticated | Get paginated shipments |
| **me** | None | `User` | Authenticated | Get current user info |

---

## 📋 Data Types

### ShipmentInput
```
itemDescription, category, quantity, weight, dimensions {length, width, height}, 
origin, destination, carrier, status, priority, cost, insurance, signature, 
customerName, notes
```

### ShipmentFilter
```
trackingNumber, itemDescription, category, carrier, status, priority, 
origin, destination, customerName
```

### SortField (enum)
```
trackingNumber | itemDescription | category | carrier | status | priority | 
shipDate | estimatedDelivery | cost | createdAt
```

### SortOrder (enum)
```
asc | desc
```

---

## 🔒 Authorization

| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Employee** | ✅ | ❌ | ❌ | ❌ |
| **Unauthenticated** | ❌ | ❌ | ❌ | ❌ |

---

## 📦 Available Values

**Carriers**: FedEx, UPS, DHL, USPS  
**Statuses**: Pending, In Transit, Out for Delivery, Delivered, Delayed  
**Priorities**: Standard, Express, Overnight  
**Categories**: electronics, jewelery, men's clothing, women's clothing

---

## 🧪 Testing

```bash
powershell -ExecutionPolicy Bypass -File test-backend.ps1
```

**Coverage**: ✅ Auth ✅ Queries ✅ Mutations ✅ Pagination ✅ Filters ✅ Authorization

---

## 🛠️ Tech Stack

Node.js v22 | Express | Apollo Server | GraphQL | JWT | bcryptjs | Fake Store API

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── data/sampleData.js      # API data fetching
│   ├── resolvers/              # Query & mutation resolvers
│   ├── schema/typeDefs.js      # GraphQL schema
│   ├── utils/auth.js           # JWT utilities
│   └── index.js                # Server entry point
├── test-backend.ps1            # Test suite
└── package.json
```

---

## 🌐 Deployment

**Platforms**: Render | Railway | Heroku | AWS | Azure

**Environment Variables**:
```env
PORT=4000
JWT_SECRET=your-secret-key
```

---

## 📝 Example Usage

### Login
```graphql
mutation {
  login(username: "admin", password: "password123") {
    token
    role
  }
}
```

### List Shipments with Filter
```graphql
query {
  listShipments(filter: { carrier: "FedEx" }, sortBy: shipDate, sortOrder: desc) {
    trackingNumber
    itemDescription
    status
  }
}
```

### Add Shipment (Admin)
```graphql
mutation {
  addShipment(input: {
    itemDescription: "Laptop"
    category: "electronics"
    quantity: 1
    weight: "5.0"
    dimensions: { length: 40, width: 30, height: 10 }
    origin: "New York, USA"
    destination: "LA, USA"
    carrier: "FedEx"
    status: "Pending"
    priority: "Express"
    cost: "75.00"
    insurance: true
    signature: true
    customerName: "John Doe"
    notes: "Fragile"
  }) {
    id
    trackingNumber
  }
}
```

---

**Built with ❤️ for Transportation Management**
