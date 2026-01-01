export const typeDefs = `#graphql
  # User type
  type User {
    id: ID!
    username: String!
    role: String!
    token: String
  }

  # Dimensions
  type Dimensions {
    length: Int!
    width: Int!
    height: Int!
  }

  # Shipment data
  type Shipment {
    id: ID!
    trackingNumber: String!
    itemDescription: String!
    category: String!
    quantity: Int!
    weight: String!
    dimensions: Dimensions!
    origin: String!
    destination: String!
    carrier: String!
    status: String!
    priority: String!
    shipDate: String!
    estimatedDelivery: String!
    actualDelivery: String
    cost: String!
    insurance: Boolean!
    signature: Boolean!
    customerName: String!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  # Pagination result
  type ShipmentConnection {
    shipments: [Shipment!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  # Input types
  input DimensionsInput {
    length: Int!
    width: Int!
    height: Int!
  }

  input ShipmentInput {
    itemDescription: String!
    category: String!
    quantity: Int!
    weight: String!
    dimensions: DimensionsInput!
    origin: String!
    destination: String!
    carrier: String!
    status: String!
    priority: String!
    cost: String!
    insurance: Boolean!
    signature: Boolean!
    customerName: String!
    notes: String
  }

  input UpdateShipmentInput {
    itemDescription: String
    category: String
    quantity: Int
    weight: String
    dimensions: DimensionsInput
    origin: String
    destination: String
    carrier: String
    status: String
    priority: String
    cost: String
    insurance: Boolean
    signature: Boolean
    customerName: String
    notes: String
  }

  input ShipmentFilter {
    trackingNumber: String
    itemDescription: String
    category: String
    carrier: String
    status: String
    priority: String
    origin: String
    destination: String
    customerName: String
  }

  enum SortField {
    trackingNumber
    itemDescription
    category
    carrier
    status
    priority
    shipDate
    estimatedDelivery
    cost
    createdAt
  }

  enum SortOrder {
    asc
    desc
  }

  # All queries (read operations)
  type Query {
    listShipments(
      filter: ShipmentFilter
      sortBy: SortField
      sortOrder: SortOrder
    ): [Shipment!]!

    getShipment(id: ID!): Shipment

    listShipmentsPaginated(
      page: Int
      limit: Int
      filter: ShipmentFilter
      sortBy: SortField
      sortOrder: SortOrder
    ): ShipmentConnection!

    me: User
  }

  # All mutations (write operations)
  type Mutation {
    login(username: String!, password: String!): User!
    register(username: String!, password: String!, role: String!): User!

    addShipment(input: ShipmentInput!): Shipment!
    updateShipment(id: ID!, input: UpdateShipmentInput!): Shipment!
    deleteShipment(id: ID!): Boolean!
  }
`;
