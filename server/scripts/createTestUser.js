// Add this temporarily to your server.js file, right after MongoDB connection
// Then restart your server once, and it will create the test users

const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createTestUsers() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);

    const testUsers = [
      {
        name: 'Test Admin',
        email: 'admin@test.com',
        passwordHash: hashedPassword,
        role: 'admin',
        roleId: 'ADM001'
      },
      {
        name: 'Test Employer',
        email: 'employer@test.com',
        passwordHash: hashedPassword,
        role: 'employer',
        roleId: 'EMP001'
      }
    ];

    for (const userData of testUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        const user = new User(userData);
        await user.save();
        console.log(`✓ Created test user: ${userData.email} / test123`);
      }
    }
  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

// Call this function after your MongoDB connection is established
// mongoose.connect(...).then(() => {
//   createTestUsers(); // Add this line
//   app.listen(...);
// });