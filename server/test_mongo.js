require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

// DNS FIX: Force Node to use Google/Cloudflare DNS for SRV lookups on restrictive networks
dns.setServers(['8.8.8.8', '1.1.1.1']);

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@'));

const userSchema = new mongoose.Schema({
    wallet: String,
    xp: Number,
    level: Number
});

const User = mongoose.model('TestUser', userSchema);

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 2000
        });
        console.log('Successfully connected to MongoDB!');

        const userCount = await User.countDocuments({});
        console.log(`Current users in DB: ${userCount}`);

        console.log('Test PASSED.');
        process.exit(0);
    } catch (err) {
        console.error('Test FAILED:', err.message);
        process.exit(1);
    }
}

runTest();
