import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages-model';
import { PeopleMessagesResponseBody } from 'src/app/shared/models/people-messages-model';
import {
  PeopleConversationItem,
  PeopleItem,
} from 'src/app/shared/models/people-model';

export function transformUnixTimestampToReadableDate(
  timestamp: string,
  userTimezone: string = 'UTC'
): string {
  const date = new Date(Number(timestamp));

  if (!isNaN(date.getTime())) {
    const serverDate = new Date(
      date.toLocaleString('en-US', { timeZone: 'UTC' })
    );

    const userTimezoneOffset = new Date(
      serverDate.toLocaleString('en-US', { timeZone: userTimezone })
    ).getTimezoneOffset();

    const userDate = new Date(
      serverDate.getTime() - userTimezoneOffset * 60 * 1000
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
export function getLastReceivedTimestampPeople(
  peopleMessages: PeopleMessagesResponseBody
): number {
  let maxTimestamp = 0;

  for (const message of peopleMessages.Items) {
    const timestamp = Number(message.createdAt.S);
    if (timestamp > maxTimestamp) {
      maxTimestamp = timestamp;
    }
  }

  return maxTimestamp;
}

export function mergePeopleAndConversationsData(
  peopleData: PeopleItem[],
  conversationsData: PeopleConversationItem[]
): PeopleItem[] {
  return peopleData.map((person) => ({
    ...person,
    hasConversation: conversationsData.some(
      (conversation) => conversation.companionID.S === person.uid.S
    ),
  }));
}
