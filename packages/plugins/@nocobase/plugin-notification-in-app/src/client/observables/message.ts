/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { observable, autorun } from '@formily/reactive';
import { Message } from '../../types';
import { getAPIClient } from '../utils';
import { channelMapObs, selectedChannelIdObs } from './channel';
import { InAppMessagesDefinition } from '../../types';

export const messageMapObs = observable<{ value: Record<string, Message> }>({ value: {} });
export const isFecthingMessageObs = observable<{ value: boolean }>({ value: false });
export const messageListObs = observable.computed(() => {
  return Object.values(messageMapObs.value).sort((a, b) => (a.receiveTimestamp > b.receiveTimestamp ? -1 : 1));
}) as { value: Message[] };

export const selectedMessageListObs = observable.computed(() => {
  if (selectedChannelIdObs.value) {
    const filteredMessages = messageListObs.value.filter((message) => message.chatId === selectedChannelIdObs.value);
    return filteredMessages;
  } else {
    return [];
  }
}) as { value: Message[] };

export const fetchMessages = async (params: any = { limit: 30 }) => {
  isFecthingMessageObs.value = true;
  const apiClient = getAPIClient();
  const res = await apiClient.request({
    url: 'myInSiteMessages:list',
    method: 'get',
    params,
  });
  const messages = res?.data?.data.messages;
  if (Array.isArray(messages)) {
    messages.forEach((message: Message) => {
      messageMapObs.value[message.id] = message;
    });
  }
  isFecthingMessageObs.value = false;
};

export const updateMessage = async (params: any) => {
  const apiClient = getAPIClient();
  await apiClient.request({
    resource: InAppMessagesDefinition.name,
    action: 'update',
    method: 'post',
    params,
  });
  messageMapObs.value[params.filterByTk] = { ...messageMapObs.value[params.filterByTk], ...params.values };
};

autorun(() => {
  if (selectedChannelIdObs.value) {
    fetchMessages({ filter: { chatId: selectedChannelIdObs.value } });
  }
});

export const unreadMsgsCountObs = observable<{ value: number | null }>({ value: null });
export const updateUnreadMsgsCount = async () => {
  const apiClient = getAPIClient();
  const res = await apiClient.request({
    url: 'myInSiteMessages:count',
    method: 'get',
    params: { filter: { status: 'unread' } },
  });
  unreadMsgsCountObs.value = res?.data?.data.count;
};

export const showMsgLoadingMoreObs = observable.computed(() => {
  const selectedChannelId = selectedChannelIdObs.value;
  const selectedChannel = channelMapObs.value[selectedChannelIdObs.value];
  const selectedMessageList = selectedMessageListObs.value;
  const isMoreMessage = selectedChannel.totalMsgCnt > selectedMessageList.length;
  if (selectedChannelId && isMoreMessage && selectedMessageList.length > 0) {
    return true;
  } else {
    return false;
  }
}) as { value: boolean };
