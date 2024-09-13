/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import React, { useCallback } from 'react';
import { observer } from '@formily/reactive-react';
import { Layout, List, Card, Descriptions, Typography, Badge, Button, Flex } from 'antd';
import { css } from '@emotion/css';
import { dayjs } from '@nocobase/utils/client';
import { useAPIClient } from '@nocobase/client';
import { InAppMessagesDefinition } from '../../types';
import {
  fetchChannels,
  selectedChannelIdObs,
  channelListObs,
  channelMapObs,
  fetchMessages,
  selectedMessageListObs,
  showMsgLoadingMoreObs,
} from '../observables';

const InnerInboxContent = () => {
  const apiClient = useAPIClient();
  const channels = channelListObs.value;
  const messages = selectedMessageListObs.value;
  const selectedChannelId = selectedChannelIdObs.value;
  const readMessage = useCallback(async (params: Record<string, any>) => {
    apiClient.request({
      resource: 'messages',
    });
  }, []);

  const onLoadChannelsMore = () => {
    const filter: Record<string, any> = {};
    const lastChannel = channels[channels.length - 1];
    if (lastChannel?.latestMsgReceiveTimestamp) {
      filter.latestMsgReceiveTimestamp = {
        $lt: lastChannel.latestMsgReceiveTimestamp,
      };
    }
    fetchChannels({ filter, limit: 30 });
  };

  const onLoadMessagesMore = useCallback(() => {
    const filter: Record<string, any> = {};
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      filter.receiveTimestamp = {
        $lt: lastMessage.receiveTimestamp,
      };
    }
    if (selectedChannelId) {
      filter.chatId = selectedChannelId;
    }
    fetchMessages({ filter, limit: 30 });
  }, [messages, selectedChannelId]);

  const loadChannelsMore = (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button onClick={onLoadChannelsMore}>Loading more</Button>
    </div>
  );

  const MessageList = () => {
    return (
      <>
        <Typography.Title level={4} style={{ marginTop: 12 }}>
          {channelMapObs.value[selectedChannelId].title}
        </Typography.Title>

        {messages.map((message, index) => (
          <Card
            size={'small'}
            style={{ marginTop: 24 }}
            title={<span style={{ fontWeight: message.status === 'unread' ? 'bold' : 'normal' }}>{message.title}</span>}
            extra={
              <Button
                type="link"
                onClick={() => {
                  apiClient.request({
                    resource: InAppMessagesDefinition.name,
                    action: 'update',
                    method: 'post',
                    params: {
                      filterByTk: message.id,
                      values: {
                        status: 'read',
                      },
                    },
                  });
                }}
              >
                Detail
              </Button>
            }
            key={message.id}
          >
            <Descriptions key={index} column={1}>
              <Descriptions.Item label="内容">{message.content}</Descriptions.Item>
              <Descriptions.Item label="时间">
                {dayjs(message.receiveTimestamp).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ))}
        {showMsgLoadingMoreObs.value && (
          <Button style={{ margin: '20px auto 0 auto', display: 'block' }} onClick={onLoadMessagesMore}>
            Loading more
          </Button>
        )}
      </>
    );
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Sider width={300} style={{ height: '100%', overflowY: 'auto', background: '#fff' }}>
        <List
          itemLayout="horizontal"
          dataSource={channels}
          loadMore={loadChannelsMore}
          style={{ paddingBottom: '20px' }}
          renderItem={(item) => (
            <List.Item
              className={css`
                &:hover {
                  background-color: #e4e5e6};
                }
              `}
              style={{
                padding: '10px 15px',
                backgroundColor: selectedChannelId === item.id ? '#e4e5e6' : null,
                height: '80px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onClick={() => {
                selectedChannelIdObs.value = item.id;
              }}
            >
              <Flex justify="space-between" style={{ width: '100%' }}>
                <div
                  style={{
                    width: '150px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    width: '80px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.45)',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                  }}
                >
                  {dayjs(item.latestMsgReceiveTimestamp).format('MM-DD')}
                </div>
              </Flex>
              <Flex justify="space-between" style={{ width: '100%' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}> {item.latestMsgTitle}</div>
                <Badge count={item.unreadMsgCnt}></Badge>
              </Flex>
            </List.Item>
          )}
        />
      </Layout.Sider>
      <Layout.Content style={{ padding: '0 24px 30px 24px', height: '100%', overflowY: 'auto' }}>
        {selectedChannelId ? <MessageList /> : null}
      </Layout.Content>
    </Layout>
  );
};

export const InboxContent = observer(InnerInboxContent);
