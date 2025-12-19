import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../lib/db.js';
import User from '../models/User.js';

(async () => {
  try {
    await connectToDatabase();

    const exists = await User.findOne({ email: 'codify2001@gmail.com' });
    if (exists) {
      console.log('⚠️ Admin already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'codify2001@gmail.com',
      password: await bcrypt.hash('Buttamin1556@.', 10),
      role: 'admin',
    });

    console.log('✅ Admin created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
