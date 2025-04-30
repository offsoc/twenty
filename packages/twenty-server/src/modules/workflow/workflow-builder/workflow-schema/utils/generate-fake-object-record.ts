import { FieldMetadataType } from 'twenty-shared/types';

import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  Leaf,
  Node,
  RecordOutputSchema,
} from 'src/modules/workflow/workflow-builder/workflow-schema/types/output-schema.type';
import { generateFakeField } from 'src/modules/workflow/workflow-builder/workflow-schema/utils/generate-fake-field';
import { shouldGenerateFieldFakeValue } from 'src/modules/workflow/workflow-builder/workflow-schema/utils/should-generate-field-fake-value';

const generateObjectRecordFields = (
  objectMetadataEntity: ObjectMetadataEntity,
  depth = 0,
) => {
  return objectMetadataEntity.fields.reduce(
    (acc: Record<string, Leaf | Node>, field) => {
      if (!shouldGenerateFieldFakeValue(field)) {
        return acc;
      }

      if (field.type === FieldMetadataType.RELATION && depth === 0) {
        acc[field.name] = {
          isLeaf: false,
          icon: field.icon,
          label: field.label,
          value: generateObjectRecordFields(
            field.relationTargetObjectMetadata,
            1,
          ),
        };

        return acc;
      }
      acc[field.name] = generateFakeField({
        type: field.type,
        label: field.label,
        icon: field.icon,
      });

      return acc;
    },
    {},
  );
};

export const generateFakeObjectRecord = (
  objectMetadataEntity: ObjectMetadataEntity,
): RecordOutputSchema => ({
  object: {
    isLeaf: true,
    icon: objectMetadataEntity.icon,
    label: objectMetadataEntity.labelSingular,
    value: objectMetadataEntity.description,
    nameSingular: objectMetadataEntity.nameSingular,
    fieldIdName: 'id',
  },
  fields: generateObjectRecordFields(objectMetadataEntity),
  _outputSchemaType: 'RECORD',
});
