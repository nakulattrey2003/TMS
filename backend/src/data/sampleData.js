// Store shipments data
export let shipments = [];

// List of cities for origin/destination
const cities = [
  "New York, USA",
  "Los Angeles, USA",
  "Chicago, USA",
  "Houston, USA",
  "Miami, USA",
  "Seattle, USA",
  "Boston, USA",
  "San Francisco, USA",
  "London, UK",
  "Paris, France",
  "Tokyo, Japan",
  "Sydney, Australia",
];

// List of carriers
const carriers = ["FedEx", "UPS", "DHL", "USPS"];

// List of statuses
const statuses = [
  "In Transit",
  "Delivered",
  "Pending",
  "Out for Delivery",
  "Delayed",
];

// Get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Get random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fetch data from Fake Store API and convert to shipments
export async function loadShipmentsFromAPI() {
  try {
    console.log("📦 Fetching product data from API...");

    const url = "https://fakestoreapi.com/products";
    let products;

    // Retry loop with exponential backoff (3 attempts)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url);
        const contentType = response.headers.get("content-type") || "";

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `HTTP ${
              response.status
            } - content-type=${contentType} - body=${text.substring(0, 200)}`
          );
        }

        if (!contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(
            `Unexpected content-type: ${contentType} - body=${text.substring(
              0,
              200
            )}`
          );
        }

        products = await response.json();
        break; // success
      } catch (err) {
        console.error(
          `Attempt ${attempt} failed to fetch products:`,
          err.message
        );
        if (attempt === 3) throw err;
        // wait before retrying
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }

    // Create more shipments by repeating the products 5 times (to get 100 shipments)
    const expandedProducts = [];
    for (let i = 0; i < 5; i++) {
      expandedProducts.push(...products);
    }

    // Convert each product to a shipment
    shipments = expandedProducts.map((product, index) => {
      const origin = getRandomItem(cities);
      const destination = getRandomItem(cities.filter((c) => c !== origin));
      const status = getRandomItem(statuses);
      const shipDate = new Date(
        Date.now() - getRandomNumber(1, 10) * 24 * 60 * 60 * 1000
      );
      const deliveryDate = new Date(
        shipDate.getTime() + getRandomNumber(3, 7) * 24 * 60 * 60 * 1000
      );

      return {
        id: String(index + 1),
        trackingNumber: `TMS${String(index + 1).padStart(6, "0")}`,
        itemDescription: product.title,
        category: product.category,
        quantity: getRandomNumber(1, 50),
        weight: (product.price * 0.5).toFixed(1),
        dimensions: {
          length: getRandomNumber(20, 60),
          width: getRandomNumber(20, 50),
          height: getRandomNumber(10, 40),
        },
        origin: origin,
        destination: destination,
        carrier: getRandomItem(carriers),
        status: status,
        priority: getRandomItem(["Standard", "Express", "Overnight"]),
        shipDate: shipDate.toISOString(),
        estimatedDelivery: deliveryDate.toISOString(),
        actualDelivery:
          status === "Delivered" ? deliveryDate.toISOString() : null,
        cost: (product.price * 2.5).toFixed(2),
        insurance: Math.random() > 0.5,
        signature: Math.random() > 0.6,
        customerName: `Customer ${index + 1}`,
        notes: product.description ? product.description.substring(0, 80) : "",
        createdAt: shipDate.toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    console.log(`✅ Loaded ${shipments.length} shipments from API`);
    return shipments;
  } catch (error) {
    console.error("❌ Failed to fetch from API:", error.message);
    console.log("📦 Using fallback sample data...");

    // Fallback: Create some sample shipments if API fails
    shipments = [
      {
        id: "1",
        trackingNumber: "TMS000001",
        itemDescription: "Electronics Package",
        category: "electronics",
        quantity: 5,
        weight: "10.5",
        dimensions: { length: 40, width: 30, height: 20 },
        origin: "New York, USA",
        destination: "Los Angeles, USA",
        carrier: "FedEx",
        status: "In Transit",
        priority: "Express",
        shipDate: new Date("2024-12-20").toISOString(),
        estimatedDelivery: new Date("2024-12-25").toISOString(),
        actualDelivery: null,
        cost: "125.00",
        insurance: true,
        signature: true,
        customerName: "Customer 1",
        notes: "Handle with care",
        createdAt: new Date("2024-12-20").toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return shipments;
  }
}

// User accounts for login
export const users = [
  {
    id: "1",
    username: "admin",
    password: "$2a$10$YlWFOwBowYOZ1dtKYC0DdunAzL.ipOk8aCH/sO5VzW1cDIpEX.sFi", // password123
    role: "Admin",
  },
  {
    id: "2",
    username: "employee",
    password: "$2a$10$YlWFOwBowYOZ1dtKYC0DdunAzL.ipOk8aCH/sO5VzW1cDIpEX.sFi", // password123
    role: "Employee",
  },
];

// Helper to get next ID for new shipments
export const getNextId = () => {
  const ids = shipments.map((s) => parseInt(s.id));
  const maxId = Math.max(...ids);
  return String(maxId + 1);
};
