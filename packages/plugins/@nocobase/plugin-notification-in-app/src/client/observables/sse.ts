/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { observable, autorun } from '@formily/reactive';
import { notification } from 'antd';
import { SSEData } from '../../types';
import { messageMapObs, updateUnreadMsgsCount } from './message';
import { channelMapObs, fetchChannels } from './channel';
import { getAPIClient } from '../utils';

export const liveSSEObs = observable<{ value: SSEData | null }>({ value: null });

autorun(() => {
  if (!liveSSEObs.value) return;
  const sseData = liveSSEObs.value;
  if (sseData.type === 'message:created') {
    const { data } = sseData;
    messageMapObs.value[data.id] = data;
    notification.info({ message: data.title, description: data.content });
    fetchChannels({ filter: { id: data.chatId } });
    updateUnreadMsgsCount();
  }
});

export const createMsgSSEConnection = async () => {
  const apiClient = getAPIClient();
  const res = await apiClient.request({
    url: 'myInSiteMessages:sse',
    method: 'get',
    headers: {
      Accept: 'text/event-stream',
    },
    params: {
      id: crypto.randomUUID(),
    },
    responseType: 'stream',
    adapter: 'fetch',
  });
  const stream = res.data;
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const { value, done } = await reader.read();
      if (done) break;
      const sseData: SSEData = JSON.parse(value.replace(/^data:\s*/, '').trim());
      liveSSEObs.value = sseData;
      if (sseData.type === 'message:created') {
        const msgId = sseData.data.id;
        fetchChannels({ id: sseData.data.chatId });
        messageMapObs.value[msgId] = sseData.data;
      }
    } catch (error) {
      console.error(error);
      break;
    }
  }
};
