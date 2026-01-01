import { shipments } from '../data/sampleData.js';
import { authenticate } from '../utils/auth.js';

// Get all shipments with filters and sorting
function listShipments(parent, args, context) {
  // Check if user is logged in
  authenticate(context);

  let result = [...shipments];

  // Apply filters if provided
  if (args.filter) {
    if (args.filter.trackingNumber) {
      result = result.filter(s => 
        s.trackingNumber.toLowerCase().includes(args.filter.trackingNumber.toLowerCase())
      );
    }
    if (args.filter.status) {
      result = result.filter(s => s.status === args.filter.status);
    }
    if (args.filter.carrier) {
      result = result.filter(s => s.carrier === args.filter.carrier);
    }
    if (args.filter.category) {
      result = result.filter(s => s.category === args.filter.category);
    }
  }

  // Apply sorting if provided
  if (args.sortBy) {
    result.sort((a, b) => {
      const aValue = a[args.sortBy];
      const bValue = b[args.sortBy];
      
      if (args.sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1;
      }
      return aValue > bValue ? 1 : -1;
    });
  }

  return result;
}

// Get one shipment by ID
function getShipment(parent, args, context) {
  authenticate(context);
  return shipments.find(s => s.id === args.id);
}

// Get shipments with pagination
function listShipmentsPaginated(parent, args, context) {
  authenticate(context);

  const page = args.page || 1;
  const limit = args.limit || 10;

  // Get filtered and sorted results
  let result = [...shipments];

  // Apply filters
  if (args.filter) {
    if (args.filter.trackingNumber) {
      result = result.filter(s => 
        s.trackingNumber.toLowerCase().includes(args.filter.trackingNumber.toLowerCase())
      );
    }
    if (args.filter.status) {
      result = result.filter(s => s.status === args.filter.status);
    }
    if (args.filter.carrier) {
      result = result.filter(s => s.carrier === args.filter.carrier);
    }
  }

  // Apply sorting
  if (args.sortBy) {
    result.sort((a, b) => {
      const aValue = a[args.sortBy];
      const bValue = b[args.sortBy];
      if (args.sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1;
      }
      return aValue > bValue ? 1 : -1;
    });
  }

  // Calculate pagination
  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = result.slice(start, end);

  return {
    shipments: pageData,
    totalCount: total,
    currentPage: page,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

// Get current user info
function me(parent, args, context) {
  const user = authenticate(context);
  return user;
}

// Export all query functions
export const queries = {
  listShipments: listShipments,
  getShipment: getShipment,
  listShipmentsPaginated: listShipmentsPaginated,
  me: me
};
