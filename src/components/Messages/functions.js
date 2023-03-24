function groupMessagesByDate(messages) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const groups = {};

  messages.forEach((message) => {
    const timestamp = message.date.toMillis();
    const date = new Date(timestamp);
    const dateStr = formatDate(date);

    if (isSameDay(date, today)) {
      if (!groups["today"]) groups["today"] = [];
      groups["today"].push(message);
    } else if (isSameDay(date, yesterday)) {
      if (!groups["yesterday"]) groups["yesterday"] = [];
      groups["yesterday"].push(message);
    } else {
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(message);
    }
  });

  // Convert object to array, sort by date, and convert back to object
  const sortedGroups = Object.entries(groups)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return sortedGroups;
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export { groupMessagesByDate };
