import mongoose from "mongoose";

import Product from './model/products'; // Assuming Product model is correctly defined

// Load environment variables


// Product data
const product = [
  {
    id: '1',
    name: 'Student Hosting Plan',
    description: 'Affordable web hosting for student projects',
    price: 5.99,
    category: 'hosting',
    image: '/products/hosting.png',
  },
  {
    id: '2',
    name: 'Domain Name (.edu)',
    description: 'Get your own .edu domain name',
    price: 12.99,
    category: 'domain',
    image: '/products/domain.png',
  },
  {
    id: '3',
    name: 'Cloud Storage (100GB)',
    description: 'Secure cloud storage for your assignments and projects',
    price: 4.99,
    category: 'storage',
    image: '/products/storage.png',
  },
  {
    id: '4',
    name: 'Student Developer Pack',
    description: 'Essential software tools for student developers',
    price: 29.99,
    category: 'software',
    image: '/products/devpack.png',
  },
  {
    id: '5',
    name: 'Online Course Subscription',
    description: 'Access to premium online courses',
    price: 19.99,
    category: 'education',
    image: '/products/course.png',
  },
  {
    id: '6',
    name: 'Student VPN Service',
    description: 'Secure VPN service for students',
    price: 3.99,
    category: 'security',
    image: '/products/vpn.png',
  },
];

// Function to connect to the database
const connectDB = async (): Promise<void> => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI not defined in environment variables.");
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit if connection fails
    }
};

// Function to add products to the database
async function addProductsToDb() {
  try {
    console.log('Adding products...');
    // Optional: Clear existing products first if needed
    // await Product.deleteMany({});
    // console.log('Existing products cleared.');

    for (let i = 0; i < product.length; i++) {
      console.log(`Adding product: ${product[i].name}`);
      // Consider using insertMany for better performance with large arrays
      const createdProduct = await Product.create(product[i]);
      console.log(`Added product ID: ${createdProduct._id}`);
    }
    console.log('Finished adding products.');
  } catch (error) {
    console.error('Error adding products:', error);
    // Keep the process running even if some products fail, or exit:
    // process.exit(1);
  }
}

// Main execution function
const runScript = async () => {
    await connectDB(); // Connect to the database first
    await addProductsToDb(); // Then add the products

    // Disconnect after completion
    try {
        await mongoose.disconnect();
        console.log('Database disconnected.');
    } catch (error) {
        console.error('Error disconnecting from database:', error);
    }
};

// Execute the script
runScript();

// Note: The connectDB function is defined here but not exported,
// as this script is intended to be run directly.
// If you need connectDB elsewhere, keep the export.