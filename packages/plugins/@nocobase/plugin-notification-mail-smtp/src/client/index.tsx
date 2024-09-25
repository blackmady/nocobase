/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/client';
import PluginNotificationManagerClient from '@nocobase/plugin-notification-manager/client';
import { channelType, NAMESPACE } from '../constant';
import { tval } from '@nocobase/utils/client';
import { ChannelConfigForm } from './ConfigForm';
import { MessageConfigForm } from './MessageConfigForm';
export class PluginNotificationMailClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}
  async load() {
    const notification = this.pm.get(PluginNotificationManagerClient);
    notification.manager.registerChannelType({
      title: tval('SMTP mail', { ns: NAMESPACE }),
      name: channelType,
      components: {
        ChannelConfigForm: ChannelConfigForm,
        MessageConfigForm: MessageConfigForm,
      },
    });
  }
}

export default PluginNotificationMailClient;