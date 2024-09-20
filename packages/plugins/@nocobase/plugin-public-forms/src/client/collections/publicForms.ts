/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

export const publicFormsCollection = {
  name: 'publicForms',
  filterTargetKey: 'key',
  fields: [
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: "{{t('Title')}}",
        required: true,
        'x-component': 'Input',
      },
    },
    {
      type: 'text',
      name: 'description',
      interface: 'textarea',
      uiSchema: {
        type: 'string',
        title: "{{t('Description')}}",
        'x-component': 'Input.TextArea',
      },
    },
    {
      type: 'string',
      name: 'type',
      interface: 'radioGroup',
      uiSchema: {
        type: 'string',
        title: "{{t('Type')}}",
        'x-component': 'Radio.Group',
      },
    },
    {
      type: 'string',
      name: 'collection',
      interface: 'collection',
      uiSchema: {
        type: 'string',
        title: "{{t('Collection')}}",
        required: true,
        'x-component': 'DataSourceCollectionCascader',
      },
    },
    {
      type: 'boolean',
      name: 'enabledPassword',
      interface: 'checkbox',
      uiSchema: {
        type: 'string',
        title: "{{t('Enable password')}}",
        'x-component': 'Checkbox',
        default: true,
      },
    },
    {
      type: 'password',
      name: 'password',
      interface: 'password',
      uiSchema: {
        type: 'string',
        title: "{{t('Password')}}",
        'x-component': 'Password',
        'x-component-props': {
          autocomplete: 'new-password',
        },
      },
    },
    {
      type: 'boolean',
      name: 'enabled',
      interface: 'checkbox',
      uiSchema: {
        type: 'string',
        title: "{{t('Enable form')}}",
        'x-component': 'Checkbox',
        default: true,
      },
    },
  ],
};