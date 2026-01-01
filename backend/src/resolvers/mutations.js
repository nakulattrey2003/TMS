import { shipments, users, getNextId } from '../data/sampleData.js';
import { generateToken, hashPassword, comparePassword, requireAdmin } from '../utils/auth.js';

// User login
async function login(parent, args, context) {
  // Find user by username
  const user = users.find(u => u.username === args.username);
  if (!user) {
    throw new Error('Wrong username or password');
  }

  // Check if password matches
  const isPasswordCorrect = await comparePassword(args.password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Wrong username or password');
  }

  // Create JWT token
  const token = generateToken(user);

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    token
  };
}

// Register new user
async function register(parent, args, context) {
  // Check if username exists
  if (users.find(u => u.username === args.username)) {
    throw new Error('Username already taken');
  }

  // Hash the password
  const hashedPassword = await hashPassword(args.password);
  
  // Create new user
  const newUser = {
    id: String(users.length + 1),
    username: args.username,
    password: hashedPassword,
    role: args.role || 'Employee'
  };

  users.push(newUser);
  const token = generateToken(newUser);

  return {
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
    token
  };
}

// Add new shipment (Admin only)
function addShipment(parent, args, context) {
  // Check if user is admin
  requireAdmin(context);

  const newId = getNextId();
  const newShipment = {
    id: newId,
    trackingNumber: `TMS${newId.padStart(6, '0')}`,
    ...args.input,
    shipDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    actualDelivery: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  shipments.push(newShipment);
  return newShipment;
}

// Update existing shipment (Admin only)
function updateShipment(parent, args, context) {
  // Check if user is admin
  requireAdmin(context);

  const index = shipments.findIndex(s => s.id === args.id);
  if (index === -1) {
    throw new Error('Shipment not found');
  }

  // Update the shipment
  shipments[index] = {
    ...shipments[index],
    ...args.input,
    updatedAt: new Date().toISOString()
  };

  // If delivered, add actual delivery date
  if (args.input.status === 'Delivered' && !shipments[index].actualDelivery) {
    shipments[index].actualDelivery = new Date().toISOString();
  }

  return shipments[index];
}

// Delete shipment (Admin only)
function deleteShipment(parent, args, context) {
  // Check if user is admin
  requireAdmin(context);

  const index = shipments.findIndex(s => s.id === args.id);
  if (index === -1) {
    throw new Error('Shipment not found');
  }

  shipments.splice(index, 1);
  return true;
}

// Export all mutation functions
export const mutations = {
  login: login,
  register: register,
  addShipment: addShipment,
  updateShipment: updateShipment,
  deleteShipment: deleteShipment
};
