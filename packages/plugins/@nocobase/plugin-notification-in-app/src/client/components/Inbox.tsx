/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please rwefer to: https://www.nocobase.com/agreement.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Button, ConfigProvider, notification, Drawer } from 'antd';
import { createStyles } from 'antd-style';
import { Icon } from '@nocobase/client';
import { useAPIClient } from '@nocobase/client';
import { InboxContent } from './InboxContent';
import { useLocalTranslation } from '../../locale';
import { SSEData } from '../../types/sse';
import { fetchChannels } from '../observables';
import { observer } from '@formily/reactive-react';
import { updateUnreadMsgsCount, unreadMsgsCountObs, liveSSEObs } from '../observables';
const useStyles = createStyles(({ token }) => {
  return {
    button: {
      // @ts-ignore
      color: token.colorTextHeaderMenu + ' !important',
    },
  };
});

const InnerInbox = (props) => {
  const apiClient = useAPIClient();
  const { t } = useLocalTranslation();
  const [visible, setVisible] = useState(false);
  const { styles } = useStyles();

  useEffect(() => {
    updateUnreadMsgsCount();
  }, []);

  const onIconClick = useCallback(() => {
    setVisible(true);
    fetchChannels({});
  }, []);

  useEffect(() => {
    const request = async () => {
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
        } catch (error) {
          console.error(error);
          break;
        }
      }
    };
    request();
  }, [apiClient]);

  return (
    <ConfigProvider
      theme={{
        components: { Drawer: { paddingLG: 0 } },
      }}
    >
      <Button className={styles.button} title={'Apps'} icon={<Icon type={'MailOutlined'} />} onClick={onIconClick} />
      {unreadMsgsCountObs.value && <Badge count={unreadMsgsCountObs.value} size="small" offset={[-18, -16]}></Badge>}
      <Drawer title={t('Inbox')} open={visible} closeIcon={true} width={800} onClose={() => setVisible(false)}>
        <InboxContent />
      </Drawer>
    </ConfigProvider>
  );
};
export const Inbox = observer(InnerInbox);
