import React, { FC } from 'react';
import { NodeNetworkConfigurationPolicyModelGroupVersionKind } from 'src/console-models';
import { ENACTMENT_LABEL_POLICY } from 'src/utils/constants';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { ResourceLink, RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';
import { Button } from '@patternfly/react-core';
import { V1beta1NodeNetworkConfigurationEnactment, V1NodeNetworkConfigurationPolicy } from '@types';

import EnactmentStateColumn from './EnactmentStateColumn';

const PolicyRow: FC<
  RowProps<
    V1NodeNetworkConfigurationPolicy,
    {
      selectPolicy: (policy: V1NodeNetworkConfigurationPolicy) => void;
      enactments: V1beta1NodeNetworkConfigurationEnactment[];
    }
  >
> = ({ obj, activeColumnIDs, rowData: { selectPolicy, enactments } }) => {
  const { t } = useNMStateTranslation();

  const policyEnactments = enactments?.filter(
    (enactment) => enactment?.metadata?.labels?.[ENACTMENT_LABEL_POLICY] === obj?.metadata?.name,
  );
  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs} className="pf-m-width-30">
        <ResourceLink
          groupVersionKind={NodeNetworkConfigurationPolicyModelGroupVersionKind}
          name={obj.metadata.name}
        />
      </TableData>
      <TableData id="nodes" activeColumnIDs={activeColumnIDs} className="pf-m-width-30">
        <Button
          variant="link"
          isInline
          onClick={() => policyEnactments.length !== 0 && selectPolicy(obj)}
        >
          {policyEnactments.length} {t('nodes')}
        </Button>
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs} className="pf-m-width-30">
        <EnactmentStateColumn enactments={policyEnactments} />
      </TableData>
      <TableData
        id=""
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      ></TableData>
    </>
  );
};

export default PolicyRow;
