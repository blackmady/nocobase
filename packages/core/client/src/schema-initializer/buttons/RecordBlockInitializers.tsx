import { Schema, useFieldSchema } from '@formily/react';
import { SchemaInitializerItemOptions, useCollection, useCollectionManager } from '../..';
import { gridRowColWrap } from '../utils';
import { SchemaInitializerV2, useSchemaInitializerV2 } from '../../application';

const recursiveParent = (schema: Schema) => {
  if (!schema) return null;

  if (schema['x-decorator']?.endsWith('BlockProvider')) {
    return schema['x-decorator-props']?.['collection'];
  } else {
    return recursiveParent(schema.parent);
  }
};

const useRelationFields = () => {
  const fieldSchema = useFieldSchema();
  const { getCollectionFields } = useCollectionManager();
  const collection = useCollection();
  let fields = [];

  if (fieldSchema['x-initializer']) {
    fields = collection.fields;
  } else {
    const collection = recursiveParent(fieldSchema.parent);
    if (collection) {
      fields = getCollectionFields(collection);
    }
  }

  const relationFields = fields
    .filter((field) => ['linkTo', 'subTable', 'o2m', 'm2m', 'obo', 'oho', 'o2o', 'm2o'].includes(field.interface))
    .map((field) => {
      if (['hasOne', 'belongsTo'].includes(field.type)) {
        return {
          key: field.name,
          type: 'subMenu',
          title: field?.uiSchema?.title || field.name,
          children: [
            {
              key: `${field.name}_details`,
              type: 'item',
              title: '{{t("Details")}}',
              field,
              Component: 'RecordReadPrettyAssociationFormBlockInitializer',
            },
            // {
            //   key: `${field.name}_form`,
            //   type: 'item',
            //   title: '{{t("Form")}}',
            //   field,
            //   component: 'RecordAssociationFormBlockInitializer',
            // },
          ],
        };
      }

      if (['hasMany', 'belongsToMany'].includes(field.type)) {
        return {
          key: field.name,
          type: 'subMenu',
          title: field?.uiSchema?.title || field.name,
          children: [
            {
              key: `${field.name}_table`,
              type: 'item',
              title: '{{t("Table")}}',
              field,
              Component: 'RecordAssociationBlockInitializer',
            },
            {
              key: `${field.name}_details`,
              type: 'item',
              title: '{{t("Details")}}',
              field,
              Component: 'RecordAssociationDetailsBlockInitializer',
            },
            {
              key: `${field.name}_list`,
              type: 'item',
              title: '{{t("List")}}',
              field,
              Component: 'RecordAssociationListBlockInitializer',
            },
            {
              key: `${field.name}_grid_card`,
              type: 'item',
              title: '{{t("Grid Card")}}',
              field,
              Component: 'RecordAssociationGridCardBlockInitializer',
            },
            {
              key: `${field.name}_form`,
              type: 'item',
              title: '{{t("Form")}}',
              field,
              Component: 'RecordAssociationFormBlockInitializer',
            },
            {
              key: `${field.name}_calendar`,
              type: 'item',
              title: '{{t("Calendar")}}',
              field,
              Component: 'RecordAssociationCalendarBlockInitializer',
            },
          ],
        };
      }

      return {
        key: field.name,
        type: 'item',
        field,
        title: field?.uiSchema?.title || field.name,
        Component: 'RecordAssociationBlockInitializer',
      };
    }) as any;
  return relationFields;
};

const useDetailCollections = (props) => {
  const { actionInitializers, childrenCollections, collection } = props;
  const detailCollections = [
    {
      key: collection.name,
      type: 'item',
      title: collection?.title || collection.name,
      Component: 'RecordReadPrettyFormBlockInitializer',
      icon: false,
      targetCollection: collection,
      actionInitializers,
    },
  ].concat(
    childrenCollections.map((c) => {
      return {
        key: c.name,
        type: 'item',
        title: c?.title || c.name,
        Component: 'RecordReadPrettyFormBlockInitializer',
        icon: false,
        targetCollection: c,
        actionInitializers,
      };
    }),
  ) as SchemaInitializerItemOptions[];
  return detailCollections;
};

const useFormCollections = (props) => {
  const { actionInitializers, childrenCollections, collection } = props;
  const formCollections = [
    {
      key: collection.name,
      type: 'item',
      title: collection?.title || collection.name,
      Component: 'RecordFormBlockInitializer',
      icon: false,
      targetCollection: collection,
      actionInitializers,
    },
  ].concat(
    childrenCollections.map((c) => {
      return {
        key: c.name,
        type: 'item',
        title: c?.title || c.name,
        Component: 'RecordFormBlockInitializer',
        icon: false,
        targetCollection: c,
        actionInitializers,
      };
    }),
  ) as SchemaInitializerItemOptions[];

  return formCollections;
};

function useRecordBlocks() {
  const { options } = useSchemaInitializerV2();
  const { actionInitializers } = options;
  const collection = useCollection();
  const { getChildrenCollections } = useCollectionManager();
  const formChildrenCollections = getChildrenCollections(collection.name);
  const hasFormChildCollection = formChildrenCollections?.length > 0;
  const detailChildrenCollections = getChildrenCollections(collection.name, true);
  const hasDetailChildCollection = detailChildrenCollections?.length > 0;
  const modifyFlag = (collection.template !== 'view' || collection?.writableView) && collection.template !== 'sql';
  const detailChildren = useDetailCollections({
    ...options,
    childrenCollections: detailChildrenCollections,
    collection,
  });
  const formChildren = useFormCollections({
    ...options,
    childrenCollections: formChildrenCollections,
    collection,
  });

  const res = [];
  if (hasDetailChildCollection) {
    res.push({
      name: 'details',
      type: 'subMenu',
      title: '{{t("Details")}}',
      children: detailChildren,
    });
  } else {
    res.push({
      name: 'details',
      title: '{{t("Details")}}',
      Component: 'RecordReadPrettyFormBlockInitializer',
      actionInitializers,
    });
  }

  if (hasFormChildCollection) {
    res.push({
      name: 'form',
      type: 'subMenu',
      title: '{{t("Form")}}',
      children: formChildren,
    });
  } else {
    modifyFlag &&
      res.push({
        name: 'form',
        title: '{{t("Form")}}',
        Component: 'RecordFormBlockInitializer',
      });
  }

  return res;
}

export const recordBlockInitializers = new SchemaInitializerV2({
  name: 'RecordBlockInitializers',
  wrap: gridRowColWrap,
  title: '{{t("Add block")}}',
  icon: 'PlusOutlined',
  items: [
    {
      type: 'itemGroup',
      name: 'current-record-blocks',
      title: '{{t("Current record blocks")}}',
      useChildren: useRecordBlocks,
    },
    {
      type: 'itemGroup',
      name: 'relationship-blocks',
      title: '{{t("Relationship blocks")}}',
      useChildren: useRelationFields,
    },
    {
      type: 'itemGroup',
      name: 'other-blocks',
      title: '{{t("Other blocks")}}',
      children: [
        {
          name: 'markdown',
          title: '{{t("Markdown")}}',
          Component: 'MarkdownBlockInitializer',
        },
        {
          name: 'audit-logs',
          title: '{{t("Audit logs")}}',
          Component: 'AuditLogsBlockInitializer',
        },
      ],
    },
  ],
});
