/** @format */

import { Table } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { Request } from '../pages/campaigns/[id]/requests';

const RequestRow = ({
  request,
  address,
  id,
}: {
  request: Request;
  address: string;
  id: number;
}) => {
  const { Row, Cell } = Table;
  return (
    <Row>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{`${request.approvalCount}/${request.contributorsCount}`}</Cell>
    </Row>
  );
};

export default RequestRow;
