import { useState } from 'react';

function ShipmentTile({ shipment, onShipmentClick, onEdit, onDelete, onFlag }) {
  const [showOptions, setShowOptions] = useState(false);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { role: 'Guest' };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative">
      {/* Options Button */}
      <div className="absolute top-2 right-2">
        <button
          onClick={function(e) {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="text-gray-600 hover:text-gray-900 p-1"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {/* Options Menu */}
        {showOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            {user.role === 'Admin' && (
              <button
                onClick={function(e) {
                  e.stopPropagation();
                  setShowOptions(false);
                  onEdit(shipment);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </span>
              </button>
            )}
            <button
              onClick={function(e) {
                e.stopPropagation();
                setShowOptions(false);
                onFlag(shipment);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Flag
              </span>
            </button>
            {user.role === 'Admin' && (
              <button
                onClick={function(e) {
                  e.stopPropagation();
                  setShowOptions(false);
                  onDelete(shipment);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tile Content */}
      <div onClick={function() { onShipmentClick(shipment); }} className="cursor-pointer">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900">{shipment.itemDescription}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{shipment.trackingNumber}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
            shipment.status === 'InTransit' ? 'bg-blue-100 text-blue-800' :
            shipment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {shipment.status}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            shipment.priority === 'High' ? 'bg-red-100 text-red-800' :
            shipment.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {shipment.priority}
          </span>
        </div>

        <div className="text-sm text-gray-700">
          <p className="mb-1">
            <span className="font-semibold">Carrier:</span> {shipment.carrier}
          </p>
          <p>
            <span className="font-semibold">To:</span> {shipment.destination}
          </p>
        </div>
      </div>
    </div>
  );
}

function ShipmentTiles({ shipments, onShipmentClick, onEdit, onDelete, onFlag }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate pagination
  const totalPages = Math.ceil(shipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShipments = shipments.slice(startIndex, endIndex);

  // Handle page changes
  function goToPage(pageNumber) {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }

  return (
    <div>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentShipments.map(function(shipment) {
          return (
            <ShipmentTile
              key={shipment.id}
              shipment={shipment}
              onShipmentClick={onShipmentClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onFlag={onFlag}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, function(_, index) {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={function() { goToPage(pageNumber); }}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, shipments.length)} of {shipments.length} shipments
        </div>
      )}
    </div>
  );
}

export default ShipmentTiles;
