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
import { Layout, List, Card, Descriptions, Typography, Badge, Button, Flex, Spin, Tag } from 'antd';
import { css } from '@emotion/css';
import { dayjs } from '@nocobase/utils/client';
import { useNavigate } from 'react-router-dom';
import { useLocalTranslation } from '../../locale';

import {
  fetchChannels,
  selectedChannelIdObs,
  channelListObs,
  isFetchingChannelsObs,
  channelMapObs,
  showChannelLoadingMoreObs,
  fetchMessages,
  isFecthingMessageObs,
  selectedMessageListObs,
  showMsgLoadingMoreObs,
  updateMessage,
  inboxVisible,
} from '../observables';

const InnerInboxContent = () => {
  const { t } = useLocalTranslation();
  const channels = channelListObs.value;
  const messages = selectedMessageListObs.value;
  const selectedChannelId = selectedChannelIdObs.value;

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

  const loadChannelsMore = showChannelLoadingMoreObs.value ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      <Button loading={isFetchingChannelsObs.value} onClick={onLoadChannelsMore}>
        {t('Loading more')}
      </Button>
    </div>
  ) : null;

  const MessageList = observer(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    const isFetchingMessages = isFecthingMessageObs.value;
    const msgStatusDict = {
      read: t('Read'),
      unread: t('Unread'),
    };
    if (!selectedChannelId) return null;
    return (
      <>
        <Typography.Title level={4} style={{ marginTop: 12 }}>
          {channelMapObs.value[selectedChannelId].title}
        </Typography.Title>

        {messages.length === 0 && isFecthingMessageObs.value ? (
          <Spin style={{ width: '100%', marginTop: '80px' }} />
        ) : (
          messages.map((message, index) => (
            <Card
              size={'small'}
              style={{ marginTop: 24, cursor: 'pointer' }}
              title={
                <span style={{ fontWeight: message.status === 'unread' ? 'bold' : 'normal' }}>{message.title}</span>
              }
              onClick={() => {
                updateMessage({
                  filterByTk: message.id,
                  values: {
                    status: 'read',
                  },
                });
              }}
              extra={
                <Button
                  type="link"
                  onClick={() => {
                    updateMessage({
                      filterByTk: message.id,
                      values: {
                        status: 'read',
                      },
                    });
                    navigate('/admin/78pwn4k87xo');
                    inboxVisible.value = false;
                  }}
                >
                  {t('Detail')}
                </Button>
              }
              key={message.id}
            >
              <Descriptions key={index} column={1}>
                <Descriptions.Item label={t('Content')}>{message.content}</Descriptions.Item>
                <Descriptions.Item label={t('Datetime')}>
                  {dayjs(message.receiveTimestamp).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label={t('Status')}>
                  <Tag>{msgStatusDict[message.status]}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))
        )}
        {showMsgLoadingMoreObs.value && (
          <Button style={{ margin: '20px auto 0 auto' }} onClick={onLoadMessagesMore} loading={isFetchingMessages}>
            {t('Loading more')}
          </Button>
        )}
      </>
    );
  });

  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Sider width={300} style={{ height: '100%', overflowY: 'auto', background: '#fff' }}>
        <List
          itemLayout="horizontal"
          dataSource={channels}
          loadMore={loadChannelsMore}
          style={{ paddingBottom: '20px' }}
          loading={channels.length === 0 && isFetchingChannelsObs.value}
          renderItem={(item) => (
            <List.Item
              className={css`
                &:hover {
                  background-color: #e4e5e6};
                }
              `}
              style={{
                padding: '10px 15px',
                ...(selectedChannelId === item.id ? { backgroundColor: 'rgb(230, 244, 255)' } : {}),
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
