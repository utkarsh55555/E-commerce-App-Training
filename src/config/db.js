const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
    const dnsServers = (process.env.MONGO_DNS_SERVERS || "")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (dnsServers.length > 0) {
        dns.setServers(dnsServers);
    }

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });

    console.log("Database connection established");
};

module.exports = connectDB;