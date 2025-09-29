const db = require('./models');

async function main() {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models (optional - migrations handle schema)
    // await db.sequelize.sync({ force: false });
    // console.log('✅ Database synced successfully.');

    // CRUD Operations Examples

    // 1. Create a new user
    console.log('\n📝 Creating a new user...');
    const newUser = await db.User.create({
      firstName: 'Alice',
      lastName: 'Wonderland',
      email: 'alice@example.com',
      age: 28,
      isActive: true
    });
    console.log('✅ New user created:', newUser.toJSON());

    // 2. Find all users
    console.log('\n👥 Finding all users...');
    const allUsers = await db.User.findAll();
    console.log('✅ All users:', JSON.stringify(allUsers.map(user => user.toJSON()), null, 2));

    // 3. Find active users
    console.log('\n🔍 Finding active users...');
    const activeUsers = await db.User.findAll({
      where: { isActive: true },
      attributes: ['id', 'firstName', 'lastName', 'email']
    });
    console.log('✅ Active users:', JSON.stringify(activeUsers, null, 2));

    // 4. Update a user
    console.log('\n✏️ Updating user...');
    const updatedUser = await db.User.update(
      { age: 29 },
      { where: { email: 'alice@example.com' } }
    );
    console.log('✅ User updated:', updatedUser);

    // 5. Find user by email
    console.log('\n🔎 Finding user by email...');
    const user = await db.User.findOne({
      where: { email: 'alice@example.com' }
    });
    console.log('✅ Found user:', user.toJSON());

    // 6. Delete a user
    console.log('\n🗑️ Deleting user...');
    const deleted = await db.User.destroy({
      where: { email: 'alice@example.com' }
    });
    console.log('✅ User deleted:', deleted);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close database connection
    await db.sequelize.close();
    console.log('\n🔚 Database connection closed.');
  }
}

// Run the application
main();