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

// Fetch data from Fake Store API (or local/dummy products) and convert to shipments
export async function loadShipmentsFromAPI() {
  console.log("📦 Loading product data for shipments...");

  // Decide whether to use external API. Default: use external only for non-production.
  // Override by setting USE_EXTERNAL_PRODUCT_API=true in environment to force external fetch in production.
  const useExternal =
    process.env.USE_EXTERNAL_PRODUCT_API === "true" ||
    process.env.NODE_ENV !== "production";

  // Local dummy products (used in production or if external is disabled)
  const localProducts = [
    {
      title: "Sample Widget",
      price: 19.99,
      category: "gadgets",
      description: "Reliable sample widget for demos.",
    },
    {
      title: "Portable Charger",
      price: 29.95,
      category: "electronics",
      description: "Compact power bank.",
    },
    {
      title: "Wireless Mouse",
      price: 24.5,
      category: "electronics",
      description: "Ergonomic wireless mouse.",
    },
    {
      title: "Travel Backpack",
      price: 59.99,
      category: "accessories",
      description: "Spacious and durable.",
    },
    {
      title: "Noise-Cancelling Headphones",
      price: 129.0,
      category: "electronics",
      description: "Enjoy your music.",
    },
    {
      title: "Coffee Mug",
      price: 12.5,
      category: "home",
      description: "Ceramic mug with logo.",
    },
    {
      title: "Desk Lamp",
      price: 34.99,
      category: "home",
      description: "LED desk lamp.",
    },
    {
      title: "Running Shoes",
      price: 89.99,
      category: "apparel",
      description: "Comfortable running shoes.",
    },
    {
      title: "Bluetooth Speaker",
      price: 49.99,
      category: "electronics",
      description: "Portable speaker.",
    },
    {
      title: "Stainless Steel Water Bottle",
      price: 22.0,
      category: "home",
      description: "Keeps drinks cold.",
    },
  ];

  if (!useExternal) {
    console.log(
      "ℹ️ External product API disabled in this environment — using built-in sample products"
    );
    // Expand local products to reach ~100 items
    const expandedProducts = [];
    for (let i = 0; i < 10; i++) {
      expandedProducts.push(
        ...localProducts.map((p, idx) => ({
          ...p,
          title: `${p.title} (${i * localProducts.length + idx + 1})`,
        }))
      );
    }

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

    console.log(
      `✅ Loaded ${shipments.length} shipments from local sample data`
    );
    return shipments;
  }

  // Otherwise, try the external API with retries and fallback to local products if external fails
  try {
    console.log("📦 Fetching product data from external API...");

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
    console.error("❌ Failed to fetch from external API:", error.message);
    console.log("📦 Falling back to built-in sample data...");

    // Fallback: use localProducts expanded to 100
    const expandedProducts = [];
    for (let i = 0; i < 10; i++) {
      expandedProducts.push(
        ...localProducts.map((p, idx) => ({
          ...p,
          title: `${p.title} (${i * localProducts.length + idx + 1})`,
        }))
      );
    }

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

    console.log(
      `✅ Loaded ${shipments.length} shipments from local sample data (fallback)`
    );
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
