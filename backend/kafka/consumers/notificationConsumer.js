
export const notifyPostCreation= (event) => {
    console.log("🐝EVENT", event)
    const {eventType, title, userId} = JSON.parse(event.decodedMessage);
    console.log(`🦐 EVENT TYPE ${eventType}`)
    console.log(`🦄NEw post (${title}) Is created by:${userId}`)
}