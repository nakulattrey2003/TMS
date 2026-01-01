import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import ShipmentGrid from '../components/ShipmentGrid';
import ShipmentTiles from '../components/ShipmentTiles';
import DetailModal from '../components/DetailModal';
import ViewToggle from '../components/ViewToggle';

const LIST_SHIPMENTS = gql`
  query ListShipments {
    listShipments {
      id
      trackingNumber
      itemDescription
      category
      quantity
      weight
      dimensions {
        length
        width
        height
      }
      origin
      destination
      carrier
      status
      priority
      shipDate
      estimatedDelivery
      actualDelivery
      cost
      insurance
      signature
      customerName
      notes
      createdAt
      updatedAt
    }
  }
`;

const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;

const UPDATE_SHIPMENT = gql`
  mutation UpdateShipment($id: ID!, $input: UpdateShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      id
      status
    }
  }
`;

function Dashboard() {
  const [viewMode, setViewMode] = useState('tile');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [editingShipment, setEditingShipment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('id');
  const [searchQuery, setSearchQuery] = useState('');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { role: 'Guest' };

  const { loading, error, data, refetch } = useQuery(LIST_SHIPMENTS);

  const [deleteShipment] = useMutation(DELETE_SHIPMENT, {
    onCompleted: function() {
      refetch();
      alert('Shipment deleted successfully');
    },
    onError: function(error) {
      alert('Error deleting shipment: ' + error.message);
    }
  });

  const [updateShipment] = useMutation(UPDATE_SHIPMENT, {
    onCompleted: function() {
      refetch();
      alert('Shipment updated successfully');
    },
    onError: function(error) {
      alert('Error updating shipment: ' + error.message);
    }
  });

  function handleShipmentClick(shipment) {
    setSelectedShipment(shipment);
  }

  function handleEdit(shipment) {
    setEditingShipment(shipment);
  }

  function handleDelete(shipment) {
    if (window.confirm(`Are you sure you want to delete shipment ${shipment.trackingNumber}?`)) {
      deleteShipment({ variables: { id: shipment.id } });
    }
  }

  function handleFlag(shipment) {
    const newStatus = prompt('Enter new status (Pending/InTransit/Delivered/Cancelled):', shipment.status);
    if (newStatus && ['Pending', 'InTransit', 'Delivered', 'Cancelled'].includes(newStatus)) {
      updateShipment({
        variables: {
          id: shipment.id,
          input: { status: newStatus }
        }
      });
    }
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = {
      itemDescription: formData.get('itemDescription'),
      origin: formData.get('origin'),
      destination: formData.get('destination'),
      carrier: formData.get('carrier'),
      status: formData.get('status'),
      priority: formData.get('priority'),
      weight: formData.get('weight'),
      cost: formData.get('cost')
    };

    updateShipment({
      variables: {
        id: editingShipment.id,
        input: input
      }
    });
    setEditingShipment(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading shipments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  let shipments = data?.listShipments || [];

  // Apply search filter
  if (searchQuery) {
    shipments = shipments.filter(function(shipment) {
      const query = searchQuery.toLowerCase();
      return (
        shipment.itemDescription.toLowerCase().includes(query) ||
        shipment.trackingNumber.toLowerCase().includes(query) ||
        shipment.id.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query)
      );
    });
  }

  // Apply status filter
  if (filterStatus !== 'All') {
    shipments = shipments.filter(function(shipment) {
      if (filterStatus === 'Delayed') {
        // Check if estimated delivery has passed
        const estimatedDate = new Date(shipment.estimatedDelivery);
        const now = new Date();
        return shipment.status !== 'Delivered' && estimatedDate < now;
      }
      return shipment.status === filterStatus;
    });
  }

  // Apply sorting
  shipments = [...shipments].sort(function(a, b) {
    if (sortBy === 'id') {
      return parseInt(a.id) - parseInt(b.id);
    } else if (sortBy === 'name') {
      return a.itemDescription.localeCompare(b.itemDescription);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    } else if (sortBy === 'date') {
      return new Date(b.shipDate) - new Date(a.shipDate);
    } else if (sortBy === 'priority') {
      const priorityOrder = { 'Overnight': 3, 'Express': 2, 'Standard': 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    return 0;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
          <p className="text-gray-600">Total: {shipments.length} shipments</p>
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by ID, name, tracking number, or location..."
              value={searchQuery}
              onChange={function(e) { setSearchQuery(e.target.value); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={function(e) { setFilterStatus(e.target.value); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={function(e) { setSortBy(e.target.value); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="id">ID</option>
              <option value="name">Name (A-Z)</option>
              <option value="status">Status</option>
              <option value="date">Ship Date (Newest)</option>
              <option value="priority">Priority (High-Low)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || filterStatus !== 'All' || sortBy !== 'id') && (
          <div className="mt-4">
            <button
              onClick={function() {
                setSearchQuery('');
                setFilterStatus('All');
                setSortBy('id');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <ShipmentGrid
          shipments={shipments}
          onShipmentClick={handleShipmentClick}
        />
      ) : (
        <ShipmentTiles
          shipments={shipments}
          onShipmentClick={handleShipmentClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFlag={handleFlag}
        />
      )}

      {selectedShipment && (
        <DetailModal
          shipment={selectedShipment}
          onClose={function() { setSelectedShipment(null); }}
        />
      )}

      {/* Edit Modal */}
      {editingShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold">Edit Shipment</h2>
              <button
                onClick={function() { setEditingShipment(null); }}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <input
                    name="itemDescription"
                    type="text"
                    defaultValue={editingShipment.itemDescription}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Origin</label>
                  <input
                    name="origin"
                    type="text"
                    defaultValue={editingShipment.origin}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Destination</label>
                  <input
                    name="destination"
                    type="text"
                    defaultValue={editingShipment.destination}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Carrier</label>
                  <select
                    name="carrier"
                    defaultValue={editingShipment.carrier}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="DHL">DHL</option>
                    <option value="USPS">USPS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={editingShipment.status}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="InTransit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                  <select
                    name="priority"
                    defaultValue={editingShipment.priority}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Weight (lbs)</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.01"
                    defaultValue={editingShipment.weight}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Cost ($)</label>
                  <input
                    name="cost"
                    type="number"
                    step="0.01"
                    defaultValue={editingShipment.cost}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={function() { setEditingShipment(null); }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
