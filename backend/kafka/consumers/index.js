import { TOPIC } from "../../config/kafka.js";
import { notifyPostCreation } from "./notificationConsumer.js";

export const registerConsumers = (kafkaConsumer) => {
    kafkaConsumer.registerHandler(
        TOPIC.POST_CREATED,
        notifyPostCreation
    )
    console.log('✅ All consumers registered');
}


