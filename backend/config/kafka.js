import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-collabLearn",
  brokers: ["kafka:9093"],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "collab-learn-consumer" });

export const TOPIC = {
  POST_CREATED: "post_created",
};
