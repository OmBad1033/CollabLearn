import { TOPIC } from "../../config/kafka.js"
import { kafkaProducer } from "../producer.js"

export const postCreatedEvent= async (post) => {
    const stingValue = JSON.stringify({
        eventType: "POST_CREATED",
        postId: post.id,
        userId: post.userId,
        title: post.title,
        createdAt: post.createdAt
    })
    await kafkaProducer.sendEvent(TOPIC.POST_CREATED, {
        key: post.id,
        value: stingValue
    })

}