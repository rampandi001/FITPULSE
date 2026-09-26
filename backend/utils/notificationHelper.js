const Notification = require("../models/Notification");

const createNotification = async ({
  userId,
  title,
  message,
  type = "SYSTEM",
  referenceKey = "",
}) => {
  try {
    if (!userId || !title || !message) {
      return null;
    }

    /*
      PREVENT DUPLICATE NOTIFICATIONS
    */
    if (referenceKey) {
      const existingNotification =
        await Notification.findOne({
          user: userId,
          referenceKey,
        });

      if (existingNotification) {
        return existingNotification;
      }
    }

    const notification =
      await Notification.create({
        user: userId,
        title,
        message,
        type,
        referenceKey,
        read: false,
      });

    return notification;
  } catch (error) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    return null;
  }
};

module.exports = createNotification;