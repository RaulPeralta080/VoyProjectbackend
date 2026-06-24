require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const adminUsers = await User.find({ nombre: { $regex: /admin/i } }).sort({_id: -1}).limit(5);
  console.log('Admin users found:', adminUsers.length);
  for (let u of adminUsers) {
    if (u.role !== 'admin') {
      u.role = 'admin';
      await u.save();
      console.log('Updated', u.email, 'to admin');
    }
  }
  process.exit(0);
});
