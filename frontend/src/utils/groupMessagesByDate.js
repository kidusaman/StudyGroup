// src/utils/groupMessagesByDate.js
import { format, isToday, parseISO } from 'date-fns';

export function groupMessagesByDate(messages) {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const groups = [];
  let currentDate = null;
  let currentGroup = null;

  sorted.forEach((msg) => {
    const dateObj = parseISO(msg.created_at);
    let dateLabel = format(dateObj, 'MMM d, yyyy');
    if (isToday(dateObj)) {
      dateLabel = 'Today';
    }

    if (dateLabel !== currentDate) {
      currentDate = dateLabel;
      currentGroup = { date: dateLabel, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(msg);
  });

  return groups;
}
