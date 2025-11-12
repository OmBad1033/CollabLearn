import { consumer } from "../config/kafka.js";

const startConsumer = async () => {
  console.log("✅ Consumer trying to connect");
  async function connectWithRetry() {
    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        console.log(`Attempt ${attempt}: connecting to Kafka.`);
        await consumer.connect();
        console.log("✅ Connected to Kafka");
        await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
        console.log("✅ Subscribed to Kafka Topic");
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            console.log("👅 New Post is created", message.value.toString());
          },
        });
        console.log("RUN ADDED");
        return;
      } catch (err) {
        console.warn(`⚠️  Kafka not ready, retrying in 5s.`, err.message);
        await new Promise((res) => setTimeout(res, 5000));
      }
    }
    throw new Error("Kafka not ready after multiple attempts");
  }

  connectWithRetry();
};

startConsumer().catch((err) => {
  console.error("Failed to start consumer", err);
  process.exit(1);
});
