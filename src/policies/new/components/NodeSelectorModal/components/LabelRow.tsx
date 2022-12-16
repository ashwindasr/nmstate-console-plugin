import * as React from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { Button, FormGroup, GridItem, TextInput } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';

import { IDLabel } from '../utils/types';

type LabelRowProps = {
  label: IDLabel;
  onChange: (label: IDLabel) => void;
  onDelete: (id: number) => void;
};

const LabelRow: React.FC<LabelRowProps> = ({ label, onChange, onDelete }) => {
  const { t } = useNMStateTranslation();
  const { id, key, value } = label;
  return (
    <>
      <GridItem span={6}>
        <FormGroup label={t('Key')} fieldId={`label-${id}-key-input`}>
          <TextInput
            id={`label-${id}-key-input`}
            placeholder={t('Key')}
            isRequired
            type="text"
            value={key}
            onChange={(newKey) => onChange({ ...label, key: newKey })}
            aria-label={t('selector key')}
          />
        </FormGroup>
      </GridItem>
      <GridItem span={5}>
        <FormGroup label={t('Value')} fieldId={`label-${id}-value-input`}>
          <TextInput
            id={`label-${id}-value-input`}
            placeholder={t('Value')}
            isRequired
            type="text"
            value={value}
            onChange={(newValue) => onChange({ ...label, value: newValue })}
            aria-label={t('selector value')}
          />
        </FormGroup>
      </GridItem>

      <GridItem span={1}>
        <FormGroup label=" " fieldId={`label-${id}-delete-btn`}>
          <Button variant="plain" onClick={() => onDelete(id)}>
            <MinusCircleIcon />
          </Button>
        </FormGroup>
      </GridItem>
    </>
  );
};

export default LabelRow;
