/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

export interface Chat {
  id: string;
  userId: string;
  title: string;
  lastMsgId: string;
  unreadMsgCnt: number;
  avatar: string;
  lastMessage: string | Record<string, any>;
  lastMessageTime: string;
  lastviewTime: string;
}
export interface Channel {
  id: string;
  title: string;
  userId: string;
  unreadMsgCnt: number;
  totalMsgCnt: number;
  latestMsgReceiveTimestamp: number;
  latestMsgTitle: string;
}

export interface Message {
  id: string;
  title: string;
  userId: string;
  chatId: string;
  content: string;
  receiveTimestamp: number;
  status: 'read' | 'unread';
  url: string;
}

export type SSEData = {
  type: 'message:created';
  data: Message;
};
export interface InAppMessageFormValues {
  receivers: string[];
  content: string;
  senderName: string;
  senderId: string;
  url: string;
  title: string;
}

export const InAppMessagesDefinition = {
  name: 'notificationInSiteMessages',
  fieldNameMap: {
    id: 'id',
    chatId: 'chatId',
    userId: 'userId',
    content: 'content',
    status: 'status',
    title: 'title',
    receiveTimestamp: 'receiveTimestamp',
  },
} as const;

export const ChatsDefinition = {
  name: 'notificationInSiteChats',
  fieldNameMap: {
    id: 'id',
    senderId: 'senderId',
    title: 'title',
    lastMsgId: 'lastMsgId',
  },
} as const;

export const inAppTypeName = 'in-site-message';
