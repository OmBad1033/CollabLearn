import { producer, TOPIC } from "../config/kafka.js";

class KafkaProducer {
  constructor() {
    this.producer = producer;
    this.isConnected = false;
  }

  async connect() {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      console.log("✅ Kafka Producer connected");
    }
  }

  async disconnect() {
    await this.producer.disconnect();
    this.isConnected = false;
  }

  async sendEvent(topic, message) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: message.key,
            value: JSON.stringify(message.value),
            timestamp: Date.now().toString(),
          },
        ],
      });
      console.log(`📤 Event sent to ${topic}:`, message.key);
    } catch (err) {
      console.error("❌ Failed to send event:", error);
      throw error;
    }
  }
}

export const kafkaProducer = new KafkaProducer()
