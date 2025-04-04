const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup EJS with layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views')); // Adjusted: views folder is one level up
app.set('layout', 'layouts/main');

// Serve static assets
app.use(express.static(path.join(__dirname, '../public')));

// Landing page
app.get('/', (req, res) => {
  res.render('index');
});

// Signup page (GET)
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Process signup form (POST)
// After registering, redirect to login with a query parameter for feedback.
app.post('/signup', (req, res) => {
  console.log("Signup data:", req.body);
  // In a real app, store user data and then:
  res.redirect('/login?registered=true');
});

// Login page (GET)
// Pass along the "registered" flag if present.
app.get('/login', (req, res) => {
  res.render('login', { registered: req.query.registered });
});

// Process login form (POST)
// Simulate sending an OTP (here we pass a demo OTP value)
app.post('/login', (req, res) => {
  console.log("Login data:", req.body);
  res.render('otp-verification', { otp: "1234" });
});

// Process OTP verification (POST)
app.post('/verify-otp', (req, res) => {
  console.log("OTP entered:", req.body.otp);
  // Simulate OTP validation and redirect to dashboard.
  res.redirect('/dashboard');
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Browse vendors route
app.get('/browse', (req, res) => {
  // Sample data simulating vendor information
  const vendors = [
    {
      _id: "1",
      businessName: "ApplianceMart",
      category: "Appliances",
      rating: 4.5,
      description: "High quality applainces for your home.",
      logoUrl: "/images/electronics.jpg"
    },
    {
      _id: "2",
      businessName: "Grocery Hub",
      category: "Grocery",
      rating: 4.2,
      description: "Your one-stop shop for fresh produce and daily essentials.",
      logoUrl: "/images/grocery.jpg"
    },
    {
      _id: "3",
      businessName: "Cutlery Corner",
      category: "Cutlery",
      rating: 4.8,
      description: "Premium cutlery for home and commercial kitchens.",
      logoUrl: "/images/cutlery.jpg"
    },
    // Add more vendor objects as needed...
  ];
  res.render('browse', { vendors });
});

// Route to show vendor (ApplianceMart) products
app.get('/vendor/:id', (req, res) => {
  const vendorId = req.params.id;
  // For demo, if vendorId is "1", return ApplianceMart data.
  if (vendorId === "1") {
    const vendor = {
      _id: "1",
      businessName: "ApplianceMart",
      category: "Electronics",
      rating: 4.5,
      description: "High-quality appliances for businesses, offering a range of products to suit every need."
    };

    const products = [
      {
        _id: "101",
        name: "Washing Machine",
        price: 25000,
        minOrderQuantity: 2,
        rating: 4.2,
        description: "High-efficiency washing machine.",
        imageUrl: "/images/washing-machine.jpg"
      },
      {
        _id: "102",
        name: "Oven",
        price: 15000,
        minOrderQuantity: 1,
        rating: 4.0,
        description: "Professional-grade oven for cooking.",
        imageUrl: "/images/oven.jpg"
      },
      {
        _id: "103",
        name: "Induction ",
        price: 5000,
        minOrderQuantity: 3,
        rating: 4.3,
        description: "Energy-efficient induction suitable for kitchens.",
        imageUrl: "/images/induction.jpg"
      },
      {
        _id: "104",
        name: "Refrigerator",
        price: 30000,
        minOrderQuantity: 1,
        rating: 4.6,
        description: "Spacious and energy-efficient refrigerator",
        imageUrl: "/images/fridge.jpg"
      },
      {
        _id: "105",
        name: "Kettle",
        price: 2000,
        minOrderQuantity: 5,
        rating: 4.1,
        description: "Durable and fast boiling kettle.",
        imageUrl: "/images/kettle.jpg"
      }
    ];

    res.render('vendor-products', { vendor, products });
  } else {
    res.send("Vendor not found");
  }
});

// Global orders array for demo purposes
let orders = [];

// Endpoint to handle order placement
app.post('/place-order', (req, res) => {
  const order = req.body;
  order.id = orders.length + 1;
  order.timestamp = new Date();
  orders.push(order);

  if (order.orderType === "Order") {
    res.json({ message: `Order placed successfully!\nTotal: ₹${order.total}\nEstimated Delivery: ${order.deliveryEstimate}.` });
  } else {
    res.json({ message: "Enquiry sent!" });
  }
});

// Endpoint to render Order History
app.get('/orders', (req, res) => {
  res.render('order-history', { orders });
});

// Export the app for serverless deployment
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

