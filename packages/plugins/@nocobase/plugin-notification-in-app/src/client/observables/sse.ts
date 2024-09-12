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
import { fetchChannels } from './channel';

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
