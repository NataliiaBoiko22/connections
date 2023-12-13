import { select, Store } from '@ngrx/store';
import { GroupMessagesResponseBody } from 'src/app/shared/models/group-messages-model';
import { PeopleMessagesResponseBody } from 'src/app/shared/models/people-messages-model';
import {
  PeopleConversationItem,
  PeopleItem,
} from 'src/app/shared/models/people-model';
import {
  selectGroupMessagesById,
  selectPeopleMessagesById,
} from '../selectors/selectors';

export function createHeaders(): Record<string, string> {
  const userId = localStorage.getItem('uid') as string;
  const userEmail = localStorage.getItem('email') as string;
  const authToken = localStorage.getItem('token') as string;

  return {
    'rs-uid': userId,
    'rs-email': userEmail,
    Authorization: `Bearer ${authToken}`,
  };
}
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

export function getLastReceivedTimestampGroup(
  groupMessages: GroupMessagesResponseBody,
  groupID: string,
  store: Store
): number {
  let maxTimestampRequest = 0;
  let maxTimestampStore = 0;

  for (const message of groupMessages.Items) {
    const timestamp = Number(message.createdAt.S);
    if (timestamp > maxTimestampRequest) {
      maxTimestampRequest = timestamp;
    }
  }

  store
    .pipe(select(selectGroupMessagesById(groupID)))
    .subscribe((peopleSms) => {
      if (peopleSms && peopleSms.lastTimestampInGroup !== undefined) {
        if (peopleSms.lastTimestampInGroup > maxTimestampStore) {
          maxTimestampStore = peopleSms.lastTimestampInGroup;
        }
      }
    });
  let maxTimestamp = Math.max(maxTimestampRequest, maxTimestampStore);
  return maxTimestamp;
}

export function getLastReceivedTimestampPeople(
  peopleMessages: PeopleMessagesResponseBody,
  conversationID: string,
  store: Store
): number {
  let maxTimestampRequest = 0;
  let maxTimestampStore = 0;

  for (const message of peopleMessages.Items) {
    const timestamp = Number(message.createdAt.S);
    if (timestamp > maxTimestampRequest) {
      maxTimestampRequest = timestamp;
    }
  }

  store
    .pipe(select(selectPeopleMessagesById(conversationID)))
    .subscribe((peopleSms) => {
      if (peopleSms && peopleSms.lastTimestampInPeople !== undefined) {
        if (peopleSms.lastTimestampInPeople > maxTimestampStore) {
          maxTimestampStore = peopleSms.lastTimestampInPeople;
        }
      }
    });

  let maxTimestamp = Math.max(maxTimestampRequest, maxTimestampStore);
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
