require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await User.updateMany(
    {},
    { $set: { role: 'producer' } }
  );
  console.log('Updated users:', result.modifiedCount);
  process.exit(0);
});
