/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Layout, List, Card, Descriptions, Typography, Badge, Button, Flex } from 'antd';
import type { Group as MsgGroup } from './hooks/useChat';
import { css } from '@emotion/css';
import { dayjs } from '@nocobase/utils/client';
import { useAPIClient } from '@nocobase/client';
import { InAppMessagesDefinition } from '../../types';

export const InboxContent = ({
  groups,
  groupMap,
  onGroupClick,
  fetchChats,
  fetchMessages,
}: {
  groups: Array<MsgGroup>;
  groupMap: Record<string, MsgGroup>;
  onGroupClick: (groupId: string) => any;
  fetchChats: (params: any) => any;
  fetchMessages: (params: any) => any;
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(null);
  const selectedGroup = groupMap[selectedGroupId];
  const apiClient = useAPIClient();
  const readMessage = useCallback(async (params: Record<string, any>) => {
    apiClient.request({
      resource: 'messages',
    });
  }, []);
  const messages = useMemo(() => {
    if (!selectedGroupId) {
      return [];
    }
    const msgMap = groups.find((group) => group.id === selectedGroupId).msgMap;
    return Object.values(msgMap).sort((a, b) => (a.receiveTimestamp > b.receiveTimestamp ? -1 : 1));
  }, [groups, selectedGroupId]);

  const onLoadChannelsMore = () => {
    const filter: Record<string, any> = {};
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.latestMsgReceiveTimestamp) {
      filter.latestMsgReceiveTimestamp = {
        $lt: lastGroup.latestMsgReceiveTimestamp,
      };
    }
    fetchChats({ filter });
  };

  const onLoadMessagesMore = useCallback(() => {
    const filter: Record<string, any> = {};
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      filter.receiveTimestamp = {
        $lt: lastMessage.receiveTimestamp,
      };
    }
    if (selectedGroupId) {
      filter.chatId = selectedGroupId;
    }
    fetchMessages({ filter });
  }, [fetchMessages, messages, selectedGroupId]);

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

  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
      fetchMessages({ filter: { chatId: groups[0].id } });
    }
  }, [selectedGroupId, groups, fetchMessages]);

  const MessageList = () => {
    return (
      <>
        <Typography.Title level={4} style={{ marginTop: 12 }}>
          {selectedGroup.title}
        </Typography.Title>

        {messages.map((message, index) => (
          <Card
            size={'small'}
            style={{ marginTop: 24 }}
            title={<span style={{ fontWeight: message.status === 'unread' ? 'bold' : 'normal' }}>{message.title}</span>}
            extra={
              <Button
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
        <Button style={{ margin: '20px auto 0 auto', display: 'block' }} onClick={onLoadMessagesMore}>
          Load more
        </Button>
      </>
    );
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Sider width={300} style={{ height: '100%', overflowY: 'auto', background: '#fff' }}>
        <List
          itemLayout="horizontal"
          dataSource={groups}
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
                backgroundColor: selectedGroupId === item.id ? '#e4e5e6' : null,
                height: '80px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onClick={() => {
                setSelectedGroupId(item.id);
                fetchMessages({ filter: { chatId: item.id } });
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
        {selectedGroupId ? <MessageList /> : null}
      </Layout.Content>
    </Layout>
  );
};
