const mongoose = require("mongoose");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection established");
};

module.exports = connectDB;