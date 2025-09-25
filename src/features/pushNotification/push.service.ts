import { Expo, ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo();

export async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, any>
) {
  if (!Expo.isExpoPushToken(pushToken)) {
    throw new Error("Invalid Expo push token");
  }

  const messages: ExpoPushMessage[] = [
    {
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
    },
  ];

  // Send to Expo servers
  const ticketChunk = await expo.sendPushNotificationsAsync(messages);
  return ticketChunk;
}
