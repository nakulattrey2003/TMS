function Help() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Help</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Test Accounts</h2>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Admin: username = admin, password = password123</li>
          <li>Employee: username = employee, password = password123</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Toggle between Grid and Tile views</li>
          <li>Click any shipment to see full details</li>
          <li>Use options menu (⋮) for Edit/Flag/Delete (Admin only)</li>
          <li>Navigate using sidebar or horizontal menu</li>
        </ul>
      </div>
    </div>
  );
}

export default Help;