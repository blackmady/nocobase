/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import React, { createContext, useContext, useMemo } from 'react';
import {
  ActionProps,
  useActionContext,
  useCollection,
  useCollectionRecordData,
  useDataBlockRequest,
  useBlockRequestContext,
  useDataBlockResource,
  usePlugin,
} from '@nocobase/client';
import { uid } from '@formily/shared';
import { App as AntdApp } from 'antd';
import { createForm } from '@formily/core';
import { useForm, Schema } from '@formily/react';
import { NotificationTypeNameContext } from './context';
import { PluginNotificationManagerClient } from '../..';
import { useNotificationTranslation } from '../../locale';
import { ChannelType } from './types';

export const useCreateActionProps = () => {
  const { setVisible, setSubmitted } = useActionContext();
  const { message } = AntdApp.useApp();
  const form = useForm();
  const resource = useDataBlockResource();
  const { service } = useBlockRequestContext();
  const collection = useCollection();
  return {
    type: 'primary',
    async onClick(e?, callBack?) {
      await form.submit();
      const values = form.values;
      await resource.create({
        values,
      });
      const { count = 0, page = 0, pageSize = 0 } = service?.data?.meta || {};
      if (count % pageSize === 1 && page !== 1) {
        service.run({
          ...service?.params?.[0],
          page: page - 1,
        });
      }
      if (callBack) {
        callBack?.();
      }
      setSubmitted?.(true);
      setVisible?.(false);
    },
  };
};

export const useEditActionProps = () => {
  const { setVisible, setSubmitted } = useActionContext();
  const { message } = AntdApp.useApp();
  const form = useForm();
  const resource = useDataBlockResource();
  const { service } = useBlockRequestContext();
  const collection = useCollection();
  return {
    type: 'primary',
    async onClick(e?, callBack?) {
      await form.submit();
      const values = form.values;
      await resource.update({
        values,
        filterByTk: values[collection.filterTargetKey],
      });
      const { count = 0, page = 0, pageSize = 0 } = service?.data?.meta || {};
      if (count % pageSize === 1 && page !== 1) {
        service.run({
          ...service?.params?.[0],
          page: page - 1,
        });
      }
      if (callBack) {
        callBack?.();
      }
      setSubmitted?.(true);
      setVisible?.(false);
    },
  };
};

export const useEditFormProps = () => {
  const recordData = useCollectionRecordData();
  const form = useMemo(
    () =>
      createForm({
        initialValues: recordData,
      }),
    [],
  );

  return {
    form,
  };
};

export const useCreateFormProps = () => {
  const ctx = useActionContext();
  const { name } = useContext(NotificationTypeNameContext);
  const recordData = useCollectionRecordData();
  const form = useMemo(
    () =>
      createForm({
        values: {
          name: `s_${uid()}`,
          notificationType: name,
        },
      }),
    [name],
  );

  return {
    form,
  };
};
export const useCloseActionProps = () => {
  const { setVisible } = useActionContext();
  return {
    type: 'default',
    onClick() {
      setVisible(false);
    },
  };
};

export function useDeleteActionProps(): ActionProps {
  const { t } = useNotificationTranslation();
  const { message } = AntdApp.useApp();
  const record = useCollectionRecordData();
  const resource = useDataBlockResource();
  const { runAsync } = useDataBlockRequest();
  const collection = useCollection();
  return {
    confirm: {
      title: t('Delete'),
      content: t('Are you sure you want to delete it?'),
    },
    async onClick() {
      await resource.destroy({
        filterByTk: record[collection.filterTargetKey],
      });
      await runAsync();
      message.success(t('Deleted successfully!'));
    },
  };
}

export const NotificationVariableContext = createContext([]);

export const useNotificationVariableOptions = () => {
  const scope = useContext(NotificationVariableContext);
  return { scope };
};

export const NotificationVariableProvider = ({ value, children }) => {
  return <NotificationVariableContext.Provider value={value}>{children}</NotificationVariableContext.Provider>;
};

export const useNotificationTypes = () => {
  const { t } = useNotificationTranslation();
  const plugin = usePlugin(PluginNotificationManagerClient);
  const notificationTypes: Array<ChannelType> = [];
  for (const [key, val] of plugin.manager.channelTypes.getEntities()) {
    const title = Schema.compile(val.title, { t }) as string;
    const type = {
      ...val,
      name: val.name,
      key: val.name,
      value: val.name,
      title,
      label: title,
    };
    notificationTypes.push(type);
  }
  return notificationTypes;
};
