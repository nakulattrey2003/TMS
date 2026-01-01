function ShipmentGrid({ shipments, onShipmentClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Tracking #</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Description</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Origin</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Destination</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Carrier</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Priority</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Ship Date</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">ETA</th>
            <th className="px-4 py-2 border text-left text-sm font-semibold">Cost</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map(function(shipment) {
            return (
              <tr
                key={shipment.id}
                onClick={function() { onShipmentClick(shipment); }}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-2 border text-sm">{shipment.trackingNumber}</td>
                <td className="px-4 py-2 border text-sm">{shipment.itemDescription}</td>
                <td className="px-4 py-2 border text-sm">{shipment.origin}</td>
                <td className="px-4 py-2 border text-sm">{shipment.destination}</td>
                <td className="px-4 py-2 border text-sm">{shipment.carrier}</td>
                <td className="px-4 py-2 border text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    shipment.status === 'InTransit' ? 'bg-blue-100 text-blue-800' :
                    shipment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {shipment.status}
                  </span>
                </td>
                <td className="px-4 py-2 border text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    shipment.priority === 'High' ? 'bg-red-100 text-red-800' :
                    shipment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {shipment.priority}
                  </span>
                </td>
                <td className="px-4 py-2 border text-sm">{new Date(shipment.shipDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-sm">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</td>
                <td className="px-4 py-2 border text-sm">${parseFloat(shipment.cost).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ShipmentGrid;
