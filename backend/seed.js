require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Base = require('./models/Base');
const Asset = require('./models/Asset');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Base.deleteMany({});
    await Asset.deleteMany({});

    console.log('Cleared existing data...');

    // Create bases
    const base1 = await Base.create({
      name: 'Base Alpha',
      location: 'Strategic Command Center',
    });

    const base2 = await Base.create({
      name: 'Base Bravo',
      location: 'Eastern Operations',
    });

    const base3 = await Base.create({
      name: 'Base Charlie',
      location: 'Western Logistics',
    });

    console.log('Created bases...');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@military.com',
      password: 'password123',
      role: 'Admin',
    });

    const commander1 = await User.create({
      name: 'Colonel Johnson',
      email: 'commander@military.com',
      password: 'password123',
      role: 'Base Commander',
      base: base1._id,
    });

    const officer = await User.create({
      name: 'Captain Smith',
      email: 'officer@military.com',
      password: 'password123',
      role: 'Logistics Officer',
      base: base1._id,
    });

    console.log('Created users...');

    // Create assets
    const vehicles = await Asset.create({
      name: 'Combat Vehicles',
      type: 'Vehicle',
      base: base1._id,
      openingBalance: 50,
      closingBalance: 50,
      assigned: 10,
      expended: 2,
      unitCost: 500000,
      description: 'Armored combat vehicles',
    });

    const weapons = await Asset.create({
      name: 'Assault Rifles',
      type: 'Weapon',
      base: base1._id,
      openingBalance: 200,
      closingBalance: 200,
      assigned: 50,
      expended: 5,
      unitCost: 1500,
      description: 'Standard issue assault rifles',
    });

    const ammunition = await Asset.create({
      name: 'Ammunition Box',
      type: 'Ammunition',
      base: base1._id,
      openingBalance: 5000,
      closingBalance: 5000,
      assigned: 1000,
      expended: 500,
      unitCost: 50,
      description: 'Standard ammunition box',
    });

    const equipment = await Asset.create({
      name: 'Communication Radios',
      type: 'Equipment',
      base: base2._id,
      openingBalance: 100,
      closingBalance: 100,
      assigned: 25,
      expended: 0,
      unitCost: 5000,
      description: 'Military communication radios',
    });

    console.log('Created assets...');

    console.log('✓ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@military.com / password123');
    console.log('Commander: commander@military.com / password123');
    console.log('Officer: officer@military.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
