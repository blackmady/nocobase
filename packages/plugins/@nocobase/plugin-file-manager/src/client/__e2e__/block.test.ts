import { expect, test } from '@nocobase/test/e2e';

test.describe('file collection block', () => {
  test('What blocks are supported', async ({ page, mockPage }) => {
    await mockPage({
      collections: [
        {
          name: 'files',
          template: 'file',
        },
      ],
    }).goto();

    const supportedBlocks = async (blockNameList: string[]) => {
      for (const blockName of blockNameList) {
        await page.getByLabel('schema-initializer-Grid-page:').hover();
        await page.getByRole('menuitem', { name: ` ${blockName} right` }).hover();
        await expect(page.getByRole('menuitem', { name: 'files' })).toBeVisible();
        await page.mouse.move(300, 0);
      }
    };
    const unsupportedBlocks = async (blockNameList: string[]) => {
      for (const blockName of blockNameList) {
        await page.getByLabel('schema-initializer-Grid-page:').hover();
        if (blockName === 'Filter form') {
          await page.getByRole('menuitem', { name: ` Form right` }).nth(1).hover();
        } else {
          await page
            .getByRole('menuitem', { name: ` ${blockName} right` })
            .first()
            .hover();
        }
        await expect(page.getByRole('menuitem', { name: 'files' })).not.toBeVisible();
        await page.mouse.move(300, 0);
      }
    };

    await supportedBlocks(['Table', 'List', 'Details', 'Grid Card', 'Map', 'Gantt']);
    await unsupportedBlocks(['Form', 'Calendar', 'Kanban', 'Filter form']);
  });

  test('correctly size', async ({ page, mockPage, mockRecord }) => {
    const nocoPage = await mockPage({
      collections: [
        {
          name: 'files',
          template: 'file',
        },
      ],
      pageSchema: {
        _isJSONSchemaObject: true,
        version: '2.0',
        type: 'void',
        'x-component': 'Page',
        'x-app-version': '0.21.0-alpha.15',
        properties: {
          wwro4dlw5z4: {
            _isJSONSchemaObject: true,
            version: '2.0',
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'page:addBlock',
            'x-app-version': '0.21.0-alpha.15',
            properties: {
              rmicwcxvg20: {
                _isJSONSchemaObject: true,
                version: '2.0',
                type: 'void',
                'x-component': 'Grid.Row',
                'x-app-version': '0.21.0-alpha.15',
                properties: {
                  q1zio1glrlv: {
                    _isJSONSchemaObject: true,
                    version: '2.0',
                    type: 'void',
                    'x-component': 'Grid.Col',
                    'x-app-version': '0.21.0-alpha.15',
                    properties: {
                      s81y458aw3z: {
                        _isJSONSchemaObject: true,
                        version: '2.0',
                        type: 'void',
                        'x-decorator': 'TableBlockProvider',
                        'x-acl-action': 'files:list',
                        'x-use-decorator-props': 'useTableBlockDecoratorProps',
                        'x-decorator-props': {
                          collection: 'files',
                          dataSource: 'main',
                          action: 'list',
                          params: {
                            pageSize: 20,
                          },
                          rowKey: 'id',
                          showIndex: true,
                          dragSort: false,
                        },
                        'x-toolbar': 'BlockSchemaToolbar',
                        'x-settings': 'blockSettings:table',
                        'x-component': 'CardItem',
                        'x-filter-targets': [],
                        'x-app-version': '0.21.0-alpha.15',
                        properties: {
                          actions: {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            'x-initializer': 'table:configureActions',
                            'x-component': 'ActionBar',
                            'x-component-props': {
                              style: {
                                marginBottom: 'var(--nb-spacing)',
                              },
                            },
                            'x-app-version': '0.21.0-alpha.15',
                            properties: {
                              '5jd25vufv4c': {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                type: 'void',
                                'x-action': 'create',
                                title: "{{t('Upload')}}",
                                'x-designer': 'Action.Designer',
                                'x-component': 'Action',
                                'x-decorator': 'ACLActionProvider',
                                'x-component-props': {
                                  openMode: 'drawer',
                                  type: 'primary',
                                  icon: 'UploadOutlined',
                                },
                                'x-align': 'right',
                                'x-acl-action-props': {
                                  skipScopeCheck: true,
                                },
                                'x-app-version': '0.21.0-alpha.15',
                                properties: {
                                  drawer: {
                                    _isJSONSchemaObject: true,
                                    version: '2.0',
                                    type: 'void',
                                    title: '{{ t("Upload files") }}',
                                    'x-component': 'Action.Container',
                                    'x-app-version': '0.21.0-alpha.15',
                                    properties: {
                                      upload: {
                                        _isJSONSchemaObject: true,
                                        version: '2.0',
                                        type: 'void',
                                        title: '{{ t("Upload files") }}',
                                        'x-component': 'Upload.DraggerV2',
                                        'x-use-component-props': 'useUploadFiles',
                                        'x-component-props': {
                                          height: '50vh',
                                          multiple: true,
                                          listType: 'picture',
                                        },
                                        'x-app-version': '0.21.0-alpha.15',
                                        'x-uid': '78szpjgvsdd',
                                        'x-async': false,
                                        'x-index': 1,
                                      },
                                    },
                                    'x-uid': 'ukcboyk7lvd',
                                    'x-async': false,
                                    'x-index': 1,
                                  },
                                },
                                'x-uid': '0ztmt5lqupg',
                                'x-async': false,
                                'x-index': 1,
                              },
                              fxdalnlkfu2: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                title: '{{ t("Refresh") }}',
                                'x-action': 'refresh',
                                'x-component': 'Action',
                                'x-use-component-props': 'useRefreshActionProps',
                                'x-toolbar': 'ActionSchemaToolbar',
                                'x-settings': 'actionSettings:refresh',
                                'x-component-props': {
                                  icon: 'ReloadOutlined',
                                },
                                'x-align': 'right',
                                type: 'void',
                                'x-app-version': '0.21.0-alpha.15',
                                'x-uid': 'n4wj5dah2q5',
                                'x-async': false,
                                'x-index': 2,
                              },
                            },
                            'x-uid': 'mv96b9p9evn',
                            'x-async': false,
                            'x-index': 1,
                          },
                          udpxydv6won: {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'array',
                            'x-initializer': 'table:configureColumns',
                            'x-component': 'TableV2',
                            'x-use-component-props': 'useTableBlockProps',
                            'x-component-props': {
                              rowKey: 'id',
                              rowSelection: {
                                type: 'checkbox',
                              },
                            },
                            'x-app-version': '0.21.0-alpha.15',
                            properties: {
                              actions: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                type: 'void',
                                title: '{{ t("Actions") }}',
                                'x-action-column': 'actions',
                                'x-decorator': 'TableV2.Column.ActionBar',
                                'x-component': 'TableV2.Column',
                                'x-designer': 'TableV2.ActionColumnDesigner',
                                'x-initializer': 'table:configureItemActions',
                                'x-app-version': '0.21.0-alpha.15',
                                properties: {
                                  e2tsz0ma2tu: {
                                    _isJSONSchemaObject: true,
                                    version: '2.0',
                                    type: 'void',
                                    'x-decorator': 'DndContext',
                                    'x-component': 'Space',
                                    'x-component-props': {
                                      split: '|',
                                    },
                                    'x-app-version': '0.21.0-alpha.15',
                                    properties: {
                                      pfqfjnvom21: {
                                        'x-uid': '5nm9q24py65',
                                        _isJSONSchemaObject: true,
                                        version: '2.0',
                                        type: 'void',
                                        title: 'View record',
                                        'x-action': 'view',
                                        'x-toolbar': 'ActionSchemaToolbar',
                                        'x-settings': 'actionSettings:view',
                                        'x-component': 'Action.Link',
                                        'x-component-props': {
                                          openMode: 'drawer',
                                          danger: false,
                                        },
                                        'x-decorator': 'ACLActionProvider',
                                        'x-designer-props': {
                                          linkageAction: true,
                                        },
                                        properties: {
                                          drawer: {
                                            _isJSONSchemaObject: true,
                                            version: '2.0',
                                            type: 'void',
                                            title: '{{ t("View record") }}',
                                            'x-component': 'Action.Container',
                                            'x-component-props': {
                                              className: 'nb-action-popup',
                                            },
                                            properties: {
                                              tabs: {
                                                _isJSONSchemaObject: true,
                                                version: '2.0',
                                                type: 'void',
                                                'x-component': 'Tabs',
                                                'x-component-props': {},
                                                'x-initializer': 'popup:addTab',
                                                properties: {
                                                  tab1: {
                                                    _isJSONSchemaObject: true,
                                                    version: '2.0',
                                                    type: 'void',
                                                    title: '{{t("Details")}}',
                                                    'x-component': 'Tabs.TabPane',
                                                    'x-designer': 'Tabs.Designer',
                                                    'x-component-props': {},
                                                    properties: {
                                                      grid: {
                                                        _isJSONSchemaObject: true,
                                                        version: '2.0',
                                                        type: 'void',
                                                        'x-component': 'Grid',
                                                        'x-initializer': 'popup:common:addBlock',
                                                        properties: {
                                                          zfx6jwsh2px: {
                                                            _isJSONSchemaObject: true,
                                                            version: '2.0',
                                                            type: 'void',
                                                            'x-component': 'Grid.Row',
                                                            'x-app-version': '0.21.0-alpha.15',
                                                            properties: {
                                                              ctt6x9ye302: {
                                                                _isJSONSchemaObject: true,
                                                                version: '2.0',
                                                                type: 'void',
                                                                'x-component': 'Grid.Col',
                                                                'x-app-version': '0.21.0-alpha.15',
                                                                properties: {
                                                                  lk6ha5ivn6a: {
                                                                    _isJSONSchemaObject: true,
                                                                    version: '2.0',
                                                                    type: 'void',
                                                                    'x-acl-action': 'files:get',
                                                                    'x-decorator': 'DetailsBlockProvider',
                                                                    'x-use-decorator-props': 'useDetailsDecoratorProps',
                                                                    'x-decorator-props': {
                                                                      dataSource: 'main',
                                                                      collection: 'files',
                                                                      readPretty: true,
                                                                      action: 'get',
                                                                    },
                                                                    'x-toolbar': 'BlockSchemaToolbar',
                                                                    'x-settings': 'blockSettings:details',
                                                                    'x-component': 'CardItem',
                                                                    'x-app-version': '0.21.0-alpha.15',
                                                                    properties: {
                                                                      oqj95jew00z: {
                                                                        _isJSONSchemaObject: true,
                                                                        version: '2.0',
                                                                        type: 'void',
                                                                        'x-component': 'Details',
                                                                        'x-read-pretty': true,
                                                                        'x-use-component-props': 'useDetailsProps',
                                                                        'x-app-version': '0.21.0-alpha.15',
                                                                        properties: {
                                                                          rmh89kta0hf: {
                                                                            _isJSONSchemaObject: true,
                                                                            version: '2.0',
                                                                            type: 'void',
                                                                            'x-initializer': 'details:configureActions',
                                                                            'x-component': 'ActionBar',
                                                                            'x-component-props': {
                                                                              style: {
                                                                                marginBottom: 24,
                                                                              },
                                                                            },
                                                                            'x-app-version': '0.21.0-alpha.15',
                                                                            'x-uid': 'tkbp2h8w1cb',
                                                                            'x-async': false,
                                                                            'x-index': 1,
                                                                          },
                                                                          grid: {
                                                                            _isJSONSchemaObject: true,
                                                                            version: '2.0',
                                                                            type: 'void',
                                                                            'x-component': 'Grid',
                                                                            'x-initializer': 'details:configureFields',
                                                                            'x-app-version': '0.21.0-alpha.15',
                                                                            properties: {
                                                                              s3f1ea1t2u2: {
                                                                                _isJSONSchemaObject: true,
                                                                                version: '2.0',
                                                                                type: 'void',
                                                                                'x-component': 'Grid.Row',
                                                                                'x-app-version': '0.21.0-alpha.15',
                                                                                properties: {
                                                                                  '7toegj7j80s': {
                                                                                    _isJSONSchemaObject: true,
                                                                                    version: '2.0',
                                                                                    type: 'void',
                                                                                    'x-component': 'Grid.Col',
                                                                                    'x-app-version': '0.21.0-alpha.15',
                                                                                    properties: {
                                                                                      url: {
                                                                                        _isJSONSchemaObject: true,
                                                                                        version: '2.0',
                                                                                        type: 'string',
                                                                                        'x-toolbar':
                                                                                          'FormItemSchemaToolbar',
                                                                                        'x-settings':
                                                                                          'fieldSettings:FormItem',
                                                                                        'x-component':
                                                                                          'CollectionField',
                                                                                        'x-decorator': 'FormItem',
                                                                                        'x-collection-field':
                                                                                          'files.url',
                                                                                        'x-component-props': {},
                                                                                        'x-read-pretty': true,
                                                                                        'x-app-version':
                                                                                          '0.21.0-alpha.15',
                                                                                        'x-uid': 'gw6ycf9v9ck',
                                                                                        'x-async': false,
                                                                                        'x-index': 1,
                                                                                      },
                                                                                    },
                                                                                    'x-uid': 'ez3kik8rxh5',
                                                                                    'x-async': false,
                                                                                    'x-index': 1,
                                                                                  },
                                                                                },
                                                                                'x-uid': 'bwlyo0c4lws',
                                                                                'x-async': false,
                                                                                'x-index': 1,
                                                                              },
                                                                              '70iulv6ohmn': {
                                                                                _isJSONSchemaObject: true,
                                                                                version: '2.0',
                                                                                type: 'void',
                                                                                'x-component': 'Grid.Row',
                                                                                'x-app-version': '0.21.0-alpha.15',
                                                                                properties: {
                                                                                  jbfkqnfdn2t: {
                                                                                    _isJSONSchemaObject: true,
                                                                                    version: '2.0',
                                                                                    type: 'void',
                                                                                    'x-component': 'Grid.Col',
                                                                                    'x-app-version': '0.21.0-alpha.15',
                                                                                    properties: {
                                                                                      preview: {
                                                                                        _isJSONSchemaObject: true,
                                                                                        version: '2.0',
                                                                                        type: 'string',
                                                                                        'x-toolbar':
                                                                                          'FormItemSchemaToolbar',
                                                                                        'x-settings':
                                                                                          'fieldSettings:FormItem',
                                                                                        'x-component':
                                                                                          'CollectionField',
                                                                                        'x-decorator': 'FormItem',
                                                                                        'x-collection-field':
                                                                                          'files.preview',
                                                                                        'x-component-props': {},
                                                                                        'x-read-pretty': true,
                                                                                        'x-app-version':
                                                                                          '0.21.0-alpha.15',
                                                                                        'x-uid': 'banact1d7ul',
                                                                                        'x-async': false,
                                                                                        'x-index': 1,
                                                                                      },
                                                                                    },
                                                                                    'x-uid': 'j0vyqltznqj',
                                                                                    'x-async': false,
                                                                                    'x-index': 1,
                                                                                  },
                                                                                },
                                                                                'x-uid': '1qxmx7wh972',
                                                                                'x-async': false,
                                                                                'x-index': 2,
                                                                              },
                                                                              ezht5tlzcyo: {
                                                                                _isJSONSchemaObject: true,
                                                                                version: '2.0',
                                                                                type: 'void',
                                                                                'x-component': 'Grid.Row',
                                                                                'x-app-version': '0.21.0-alpha.15',
                                                                                properties: {
                                                                                  ehtzpty1p3n: {
                                                                                    _isJSONSchemaObject: true,
                                                                                    version: '2.0',
                                                                                    type: 'void',
                                                                                    'x-component': 'Grid.Col',
                                                                                    'x-app-version': '0.21.0-alpha.15',
                                                                                    properties: {
                                                                                      title: {
                                                                                        _isJSONSchemaObject: true,
                                                                                        version: '2.0',
                                                                                        type: 'string',
                                                                                        'x-toolbar':
                                                                                          'FormItemSchemaToolbar',
                                                                                        'x-settings':
                                                                                          'fieldSettings:FormItem',
                                                                                        'x-component':
                                                                                          'CollectionField',
                                                                                        'x-decorator': 'FormItem',
                                                                                        'x-collection-field':
                                                                                          'files.title',
                                                                                        'x-component-props': {},
                                                                                        'x-app-version':
                                                                                          '0.21.0-alpha.15',
                                                                                        'x-uid': 'sfx8flbjouu',
                                                                                        'x-async': false,
                                                                                        'x-index': 1,
                                                                                      },
                                                                                    },
                                                                                    'x-uid': 'woyeu6p657c',
                                                                                    'x-async': false,
                                                                                    'x-index': 1,
                                                                                  },
                                                                                },
                                                                                'x-uid': '1t97xmqbmmc',
                                                                                'x-async': false,
                                                                                'x-index': 3,
                                                                              },
                                                                              cous2frggb8: {
                                                                                _isJSONSchemaObject: true,
                                                                                version: '2.0',
                                                                                type: 'void',
                                                                                'x-component': 'Grid.Row',
                                                                                'x-app-version': '0.21.0-alpha.15',
                                                                                properties: {
                                                                                  ujbv7ewhh02: {
                                                                                    _isJSONSchemaObject: true,
                                                                                    version: '2.0',
                                                                                    type: 'void',
                                                                                    'x-component': 'Grid.Col',
                                                                                    'x-app-version': '0.21.0-alpha.15',
                                                                                    properties: {
                                                                                      filename: {
                                                                                        _isJSONSchemaObject: true,
                                                                                        version: '2.0',
                                                                                        type: 'string',
                                                                                        'x-toolbar':
                                                                                          'FormItemSchemaToolbar',
                                                                                        'x-settings':
                                                                                          'fieldSettings:FormItem',
                                                                                        'x-component':
                                                                                          'CollectionField',
                                                                                        'x-decorator': 'FormItem',
                                                                                        'x-collection-field':
                                                                                          'files.filename',
                                                                                        'x-component-props': {},
                                                                                        'x-read-pretty': true,
                                                                                        'x-app-version':
                                                                                          '0.21.0-alpha.15',
                                                                                        'x-uid': 'igx2cic3z3s',
                                                                                        'x-async': false,
                                                                                        'x-index': 1,
                                                                                      },
                                                                                    },
                                                                                    'x-uid': 'v2262zi9s0y',
                                                                                    'x-async': false,
                                                                                    'x-index': 1,
                                                                                  },
                                                                                },
                                                                                'x-uid': 'mtsr0vhvhev',
                                                                                'x-async': false,
                                                                                'x-index': 4,
                                                                              },
                                                                            },
                                                                            'x-uid': 'h9wowg4qxn9',
                                                                            'x-async': false,
                                                                            'x-index': 2,
                                                                          },
                                                                        },
                                                                        'x-uid': 'abgy70jw6bh',
                                                                        'x-async': false,
                                                                        'x-index': 1,
                                                                      },
                                                                    },
                                                                    'x-uid': 'd6tclnc3x23',
                                                                    'x-async': false,
                                                                    'x-index': 1,
                                                                  },
                                                                },
                                                                'x-uid': '0mdhu8myu0t',
                                                                'x-async': false,
                                                                'x-index': 1,
                                                              },
                                                            },
                                                            'x-uid': 'tj8uc5x6zpo',
                                                            'x-async': false,
                                                            'x-index': 1,
                                                          },
                                                        },
                                                        'x-uid': 'pg8y0y4tfec',
                                                        'x-async': false,
                                                        'x-index': 1,
                                                      },
                                                    },
                                                    'x-uid': '41f7jmnvqfr',
                                                    'x-async': false,
                                                    'x-index': 1,
                                                  },
                                                },
                                                'x-uid': '9vfhihve2qu',
                                                'x-async': false,
                                                'x-index': 1,
                                              },
                                            },
                                            'x-uid': 'u877bdnvwkd',
                                            'x-async': false,
                                            'x-index': 1,
                                          },
                                        },
                                        'x-async': false,
                                        'x-index': 1,
                                      },
                                    },
                                    'x-uid': 'z4ivtq1l8eu',
                                    'x-async': false,
                                    'x-index': 1,
                                  },
                                },
                                'x-uid': 'o1jn2s0q214',
                                'x-async': false,
                                'x-index': 1,
                              },
                              l0n1yivozlj: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                type: 'void',
                                'x-decorator': 'TableV2.Column.Decorator',
                                'x-toolbar': 'TableColumnSchemaToolbar',
                                'x-settings': 'fieldSettings:TableColumn',
                                'x-component': 'TableV2.Column',
                                'x-app-version': '0.21.0-alpha.15',
                                properties: {
                                  preview: {
                                    _isJSONSchemaObject: true,
                                    version: '2.0',
                                    'x-collection-field': 'files.preview',
                                    'x-component': 'CollectionField',
                                    'x-component-props': {
                                      size: 'small',
                                    },
                                    'x-read-pretty': true,
                                    'x-decorator': null,
                                    'x-decorator-props': {
                                      labelStyle: {
                                        display: 'none',
                                      },
                                    },
                                    'x-app-version': '0.21.0-alpha.15',
                                    'x-uid': 'qfdgjele52k',
                                    'x-async': false,
                                    'x-index': 1,
                                  },
                                },
                                'x-uid': 'xupdn9xh709',
                                'x-async': false,
                                'x-index': 2,
                              },
                            },
                            'x-uid': '1y8n3yv9ldo',
                            'x-async': false,
                            'x-index': 2,
                          },
                        },
                        'x-uid': 'l6g95h45jvn',
                        'x-async': false,
                        'x-index': 1,
                      },
                    },
                    'x-uid': 'vmavmabildh',
                    'x-async': false,
                    'x-index': 1,
                  },
                },
                'x-uid': '4tbjevh15ob',
                'x-async': false,
                'x-index': 1,
              },
            },
            'x-uid': 'wa1dmifukx3',
            'x-async': false,
            'x-index': 1,
          },
        },
        'x-uid': 'wj7bzobpx0q',
        'x-async': true,
        'x-index': 1,
      },
    }).waitForInit();
    await mockRecord('files');
    await nocoPage.goto();

    // 1. Table 中没有 size 选项，并且应该显示小尺寸的图片
    await page.getByRole('button', { name: 'Preview' }).hover();
    await page.getByLabel('designer-schema-settings-TableV2.Column-fieldSettings:TableColumn-files').hover();
    await expect(page.getByRole('menuitem', { name: 'Custom column title' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Column width' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Size' })).not.toBeVisible();

    const imgBox = await page.getByLabel('block-item-CardItem-').locator('.ant-upload-list-item-image').boundingBox();
    expect(imgBox.width).toBeLessThanOrEqual(24);

    // 2. 弹窗中应该可以配置图片尺寸
    await page.getByLabel('action-Action.Link-View').click();
    await page.getByLabel('block-item-CollectionField-files-details-files.preview-Preview').hover();
    await page
      .getByLabel('designer-schema-settings-CollectionField-fieldSettings:FormItem-files-files.preview', {
        exact: true,
      })
      .hover();
    await expect(page.getByRole('menuitem', { name: 'Size' })).toBeVisible();
  });
});