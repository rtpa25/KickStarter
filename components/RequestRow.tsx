/** @format */

import { Button, Table } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
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
  const approveHelper = async () => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };
  const finalizeHelper = async () => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    //need to have majority approvals from the contributors
    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0],
    });
    //when get an error message from metamask about hight gas, then it does not mean gas value is low, it's because the function that we want to execute is shit and is probably going to fail
  };
  const readyToFinalized =
    request.approvalCount > request.contributorsCount / 2;
  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalized && !request.complete}
      negative={!readyToFinalized}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{`${request.approvalCount}/${request.contributorsCount}`}</Cell>
      <Cell>
        {request.complete ? null : (
          <Button color='green' basic onClick={approveHelper}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color='teal' basic onClick={finalizeHelper}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
