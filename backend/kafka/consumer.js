import { consumer, TOPIC } from "../config/kafka.js";

class KafkaConsumer {
  constructor() {
    this.consumer = consumer;
    this.handlers = new Map();
  }

  registerHandler(topic, handler) {
    this.handlers.set(topic, handler);
  }

  async start() {
    const startConsumer = async () => {
      for (let attempt = 1; attempt <= 10; attempt++) {
        try {
          console.log(`Attempt ${attempt}: connecting to Kafka.`);
          await this.consumer.connect();
          console.log("✅ Connected to Kafka");
          return;
        } catch (err) {
          console.warn(`⚠️ Kafka not ready, retrying in 5s.`, err.message);
          await new Promise(res => setTimeout(res, 5000));
        }
      }
      throw new Error("Kafka not ready after multiple attempts");
    };

    const topics = Array.from(this.handlers.keys());
    console.log("TOPICS the consumer is subscribed to:", topics);

    await startConsumer();

    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
    }
    console.log("✅ Subscribed to Kafka topics");

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const decodedMessage = JSON.parse(message.value.toString());
        const handler = this.handlers.get(topic);
        if (handler) {
          await handler({ topic, partition, decodedMessage });
        } else {
          console.log(`📩 [${topic}] Message: ${message.value.toString()}`);
        }
      },
    });

    console.log("🎧 Kafka consumers running..");
  }

  async stop() {
    await this.consumer.disconnect();
    console.log("🛑 Kafka Consumer disconnected");
  }
}

export const kafkaConsumer = new KafkaConsumer();
