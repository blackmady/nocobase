/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { BaseColumnFieldOptions, Field } from './field';
import { DataTypes } from 'sequelize';

export class DatetimeNoTzField extends Field {
  get dataType() {
    if (this.database.inDialect('postgres')) {
      return DataTypes.STRING;
    }

    return DataTypes.DATE(3);
  }

  additionalSequelizeOptions(): {} {
    const { name } = this.options;
    return {
      get() {
        return this.getDataValue(name);
      },

      set(val) {
        return this.setDataValue(name, val);
      },
    };
  }
}

export interface DatetimeNoTzFieldOptions extends BaseColumnFieldOptions {
  type: 'datetimeNoTz';
}
