function DetailModal({ shipment, onClose }) {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold">Shipment Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700">Tracking Number:</label>
              <p className="text-gray-900">{shipment.trackingNumber}</p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Status:</label>
              <p>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  shipment.status === 'InTransit' ? 'bg-blue-100 text-blue-800' :
                  shipment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {shipment.status}
                </span>
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-gray-700">Description:</label>
              <p className="text-gray-900">{shipment.itemDescription}</p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Origin:</label>
              <p className="text-gray-900">{shipment.origin}</p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Destination:</label>
              <p className="text-gray-900">{shipment.destination}</p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Carrier:</label>
              <p className="text-gray-900">{shipment.carrier}</p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Priority:</label>
              <p>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  shipment.priority === 'High' ? 'bg-red-100 text-red-800' :
                  shipment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {shipment.priority}
                </span>
              </p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Ship Date:</label>
              <p className="text-gray-900">{new Date(shipment.shipDate).toLocaleDateString()}</p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Estimated Delivery:</label>
              <p className="text-gray-900">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
            </div>

            {shipment.actualDelivery && (
              <div>
                <label className="font-semibold text-gray-700">Actual Delivery:</label>
                <p className="text-gray-900">{new Date(shipment.actualDelivery).toLocaleDateString()}</p>
              </div>
            )}

            <div>
              <label className="font-semibold text-gray-700">Weight:</label>
              <p className="text-gray-900">{shipment.weight} lbs</p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Dimensions:</label>
              <p className="text-gray-900">
                {shipment.dimensions.length} × {shipment.dimensions.width} × {shipment.dimensions.height} inches
              </p>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Cost:</label>
              <p className="text-gray-900 text-lg font-bold">${parseFloat(shipment.cost).toFixed(2)}</p>
            </div>

            {shipment.sender && (
              <div className="md:col-span-2">
                <label className="font-semibold text-gray-700">Sender:</label>
                <p className="text-gray-900">{shipment.sender}</p>
              </div>
            )}

            {shipment.recipient && (
              <div className="md:col-span-2">
                <label className="font-semibold text-gray-700">Recipient:</label>
                <p className="text-gray-900">{shipment.recipient}</p>
              </div>
            )}

            {shipment.specialInstructions && (
              <div className="md:col-span-2">
                <label className="font-semibold text-gray-700">Special Instructions:</label>
                <p className="text-gray-900">{shipment.specialInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
