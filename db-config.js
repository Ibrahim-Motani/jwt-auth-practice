const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE);
    console.log(`DB running`, connection.connection.name);
  } catch (error) {
    throw new Error("DB Connection failed");
  }
};

module.exports = connectDB;
