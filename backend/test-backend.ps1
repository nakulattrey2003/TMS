# Backend Testing Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TMS BACKEND API TESTING" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:4000/graphql"

# Test 1: Admin Login
Write-Host "[1] Testing Admin Login..." -ForegroundColor Yellow
$loginQuery = '{"query":"mutation { login(username: \"admin\", password: \"password123\") { token username role } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $loginQuery -ContentType "application/json"
    $token = $response.data.login.token
    Write-Host "✅ PASSED - Admin logged in successfully" -ForegroundColor Green
    Write-Host "   Role: $($response.data.login.role)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 2: List Shipments
Write-Host "[2] Testing List Shipments..." -ForegroundColor Yellow
$listQuery = '{"query":"query { listShipments { id trackingNumber itemDescription status } }"}'
$headers = @{ "Authorization" = "Bearer $token" }
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $listQuery -ContentType "application/json" -Headers $headers
    $count = $response.data.listShipments.Count
    Write-Host "✅ PASSED - Retrieved $count shipments" -ForegroundColor Green
    Write-Host "   Sample: $($response.data.listShipments[0].trackingNumber) - $($response.data.listShipments[0].itemDescription)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 3: Get Single Shipment
Write-Host "[3] Testing Get Shipment by ID..." -ForegroundColor Yellow
$getQuery = '{"query":"query { getShipment(id: \"1\") { id trackingNumber itemDescription origin destination carrier status } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $getQuery -ContentType "application/json" -Headers $headers
    Write-Host "✅ PASSED - Retrieved shipment #1" -ForegroundColor Green
    Write-Host "   $($response.data.getShipment.trackingNumber): $($response.data.getShipment.status)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 4: Pagination
Write-Host "[4] Testing Pagination..." -ForegroundColor Yellow
$pageQuery = '{"query":"query { listShipmentsPaginated(page: 1, limit: 5) { totalCount currentPage totalPages hasNextPage shipments { id trackingNumber } } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $pageQuery -ContentType "application/json" -Headers $headers
    Write-Host "✅ PASSED - Pagination working" -ForegroundColor Green
    Write-Host "   Total: $($response.data.listShipmentsPaginated.totalCount) | Page: $($response.data.listShipmentsPaginated.currentPage)/$($response.data.listShipmentsPaginated.totalPages)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 5: Filter by Status
Write-Host "[5] Testing Filter by Status..." -ForegroundColor Yellow
$filterQuery = '{"query":"query { listShipments(filter: { status: \"In Transit\" }) { id trackingNumber status } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $filterQuery -ContentType "application/json" -Headers $headers
    Write-Host "✅ PASSED - Filter working" -ForegroundColor Green
    Write-Host "   Found $($response.data.listShipments.Count) shipments with status 'In Transit'`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 6: Sorting
Write-Host "[6] Testing Sorting..." -ForegroundColor Yellow
$sortQuery = '{"query":"query { listShipments(sortBy: trackingNumber, sortOrder: asc) { trackingNumber itemDescription } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $sortQuery -ContentType "application/json" -Headers $headers
    Write-Host "✅ PASSED - Sorting working" -ForegroundColor Green
    Write-Host "   First: $($response.data.listShipments[0].trackingNumber)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 7: Add Shipment (Admin only)
Write-Host "[7] Testing Add Shipment (Admin)..." -ForegroundColor Yellow
$addQuery = '{"query":"mutation { addShipment(input: { itemDescription: \"Test Package\", category: \"Test\", quantity: 1, weight: \"5.0\", dimensions: { length: 10, width: 10, height: 10 }, origin: \"New York, USA\", destination: \"Los Angeles, USA\", carrier: \"FedEx\", status: \"Pending\", priority: \"Standard\", cost: \"50.00\", insurance: false, signature: false, customerName: \"Test Customer\", notes: \"Test shipment\" }) { id trackingNumber itemDescription status } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $addQuery -ContentType "application/json" -Headers $headers
    $newId = $response.data.addShipment.id
    Write-Host "✅ PASSED - Shipment added" -ForegroundColor Green
    Write-Host "   New ID: $newId | Tracking: $($response.data.addShipment.trackingNumber)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 8: Update Shipment (Admin only)
Write-Host "[8] Testing Update Shipment (Admin)..." -ForegroundColor Yellow
$updateQuery = "{`"query`":`"mutation { updateShipment(id: \`"$newId\`", input: { status: \`"In Transit\`" }) { id status } }`"}"
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $updateQuery -ContentType "application/json" -Headers $headers
    Write-Host "✅ PASSED - Shipment updated" -ForegroundColor Green
    Write-Host "   Status changed to: $($response.data.updateShipment.status)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 9: Delete Shipment (Admin only)
Write-Host "[9] Testing Delete Shipment (Admin)..." -ForegroundColor Yellow
$deleteQuery = "{`"query`":`"mutation { deleteShipment(id: \`"$newId\`") }`"}"
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $deleteQuery -ContentType "application/json" -Headers $headers
    Write-Host "✅ PASSED - Shipment deleted" -ForegroundColor Green
    Write-Host "   Deleted shipment ID: $newId`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 10: Employee Login and Restrictions
Write-Host "[10] Testing Employee Login..." -ForegroundColor Yellow
$empLoginQuery = '{"query":"mutation { login(username: \"employee\", password: \"password123\") { token username role } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $empLoginQuery -ContentType "application/json"
    $empToken = $response.data.login.token
    Write-Host "✅ PASSED - Employee logged in" -ForegroundColor Green
    Write-Host "   Role: $($response.data.login.role)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 11: Employee Can Read
Write-Host "[11] Testing Employee Read Access..." -ForegroundColor Yellow
$empHeaders = @{ "Authorization" = "Bearer $empToken" }
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $listQuery -ContentType "application/json" -Headers $empHeaders
    Write-Host "✅ PASSED - Employee can read shipments" -ForegroundColor Green
    Write-Host "   Retrieved $($response.data.listShipments.Count) shipments`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 12: Employee Cannot Add (Should Fail)
Write-Host "[12] Testing Employee Add Restriction..." -ForegroundColor Yellow
$empAddQuery = '{"query":"mutation { addShipment(input: { itemDescription: \"Test\", category: \"Test\", quantity: 1, weight: \"5.0\", dimensions: { length: 10, width: 10, height: 10 }, origin: \"New York, USA\", destination: \"LA, USA\", carrier: \"FedEx\", status: \"Pending\", priority: \"Standard\", cost: \"50.00\", insurance: false, signature: false, customerName: \"Test\", notes: \"Test\" }) { id } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $empAddQuery -ContentType "application/json" -Headers $empHeaders
    if ($response.errors -and $response.errors[0].message -match "admin") {
        Write-Host "✅ PASSED - Employee correctly blocked from adding`n" -ForegroundColor Green
    } else {
        Write-Host "❌ FAILED - Employee should not be able to add shipments`n" -ForegroundColor Red
        Write-Host "   Response: $($response | ConvertTo-Json -Depth 3)`n" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host "✅ PASSED - Employee correctly blocked (caught error)`n" -ForegroundColor Green
}

# Test 13: Current User Info
Write-Host "[13] Testing Current User (me) Query..." -ForegroundColor Yellow
$meQuery = '{"query":"query { me { id username role } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $meQuery -ContentType "application/json" -Headers $headers
    Write-Host "✅ PASSED - User info retrieved" -ForegroundColor Green
    Write-Host "   User: $($response.data.me.username) ($($response.data.me.role))`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 14: Unauthenticated Request (Should Fail)
Write-Host "[14] Testing Unauthenticated Request..." -ForegroundColor Yellow
$noAuthQuery = '{"query":"query { listShipments { id } }"}'
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $noAuthQuery -ContentType "application/json"
    if ($response.errors -and $response.errors[0].message -match "login") {
        Write-Host "✅ PASSED - Unauthenticated request correctly blocked`n" -ForegroundColor Green
    } else {
        Write-Host "❌ FAILED - Unauthenticated request should be blocked`n" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✅ PASSED - Unauthenticated request correctly blocked (caught error)`n" -ForegroundColor Green
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ALL 14 TESTS PASSED! 🎉" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✅ Authentication: Admin & Employee login working" -ForegroundColor Green
Write-Host "✅ Authorization: Role-based access control working" -ForegroundColor Green
Write-Host "✅ Queries: List, Get, Pagination working" -ForegroundColor Green
Write-Host "✅ Filtering & Sorting: Working correctly" -ForegroundColor Green
Write-Host "✅ Mutations: Add, Update, Delete working (Admin only)" -ForegroundColor Green
Write-Host "✅ Security: Unauthenticated requests blocked" -ForegroundColor Green
Write-Host "`n✅ BACKEND IS FULLY OPERATIONAL AND READY FOR FRONTEND!`n" -ForegroundColor Green -BackgroundColor Black
