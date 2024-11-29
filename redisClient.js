const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  url: 'redis://127.0.0.1:6379', // Replace with your Redis server URL if different
});

// Handle connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connection established');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
})();

module.exports = redisClient;
