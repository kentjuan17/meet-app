function getSentAt(timestamp) {
  // Get the current timestamp and date from firestore
  const currentTimestamp = new Date().getTime();
  const date = new Date(timestamp);

  const timeDifference = currentTimestamp - timestamp;
  const minutes = Math.floor(timeDifference / 1000 / 60);

  let sentAt = "";

  if (minutes >= 180) {
    // after 3 hours, time should be posted. less than a day.
    sentAt = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else if (minutes >= 60) {
    // hours
    const hours = Math.floor(minutes / 60);
    sentAt = hours === 1 ? "an hour ago" : `${hours} hours ago`;
  } else if (minutes >= 2) {
    // minutes
    sentAt = minutes < 5 ? "a while ago" : `${minutes} minutes ago`;
  } else if (minutes < 2) {
    // just now ~ 2 minutes
    sentAt = "just now";
  }

  return sentAt;
}

export { getSentAt };
