// export function transformUnixTimestampToReadableDate(
//   timestamp: string
// ): string {
//   const date = new Date(Number(timestamp));
//   if (!isNaN(date.getTime())) {
//     return date.toLocaleString();
//   }
//   return timestamp;
// }

import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages';

// export function transformUnixTimestampToReadableDate(
//   timestamp: string
// ): string {
//   const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   console.log('userTimezone', userTimezone);
//   const date = new Date(Number(timestamp));

//   if (!isNaN(date.getTime())) {
//     const options: Intl.DateTimeFormatOptions = {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: 'numeric',
//       minute: 'numeric',
//       timeZone: userTimezone,
//     };

//     return date.toLocaleString('', options);
//   }

//   return timestamp;
// }
// export function transformUnixTimestampToReadableDate(
//   timestamp: string,
//   userTimezone: string = 'UTC'
// ): string {
//   const date = new Date(Number(timestamp));

//   if (!isNaN(date.getTime())) {
//     const utcMilliseconds =
//       date.getTime() + date.getTimezoneOffset() * 60 * 1000;
//     const userDate = new Date(
//       utcMilliseconds + getTimezoneOffsetInMilliseconds(userTimezone)
//     );

//     return userDate.toLocaleString();
//   }

//   return timestamp;
// }

function getTimezoneOffsetInMilliseconds(timezone: string): number {
  const now = new Date();
  const januaryOffset = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const julyOffset = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
  const stdTimezoneOffset = Math.max(januaryOffset, julyOffset);
  const isDST = now.getTimezoneOffset() < stdTimezoneOffset;

  const timezoneOffset = isDST ? stdTimezoneOffset - 60 : stdTimezoneOffset;

  return timezoneOffset * 60 * 1000;
}
export function transformUnixTimestampToReadableDate(
  timestamp: string,
  userTimezone: string = 'UTC'
): string {
  const date = new Date(Number(timestamp));

  if (!isNaN(date.getTime())) {
    const utcMilliseconds =
      date.getTime() + date.getTimezoneOffset() * 60 * 1000;
    const userDate = new Date(
      utcMilliseconds + getTimezoneOffsetInMilliseconds(userTimezone)
    );

    const year = userDate.getFullYear();
    const month = String(userDate.getMonth() + 1).padStart(2, '0');
    const day = String(userDate.getDate()).padStart(2, '0');
    const hours = String(userDate.getHours()).padStart(2, '0');
    const minutes = String(userDate.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  return timestamp;
}

export function getLastReceivedTimestamp(
  groupMessages: GroupMessagesResponseBody
): number {
  let maxTimestamp = 0;

  for (const message of groupMessages.Items) {
    const timestamp = Number(message.createdAt.S);
    if (timestamp > maxTimestamp) {
      maxTimestamp = timestamp;
    }
  }

  return maxTimestamp;
}
