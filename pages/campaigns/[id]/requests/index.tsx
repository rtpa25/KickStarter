/** @format */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';
import RequestRow from '../../../../components/RequestRow';
import Campaign from '../../../../ethereum/campaign';

const Requests = ({ data }: { data: Request[] }) => {
  const router = useRouter();
  const campaignId = router.asPath.split('/')[2];
  const { Header, Row, HeaderCell, Body, Cell } = Table;
  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${campaignId}/requests/new`}>
        <a>
          <Button primary>Create Reuqest</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount[eth]</HeaderCell>
            <HeaderCell>Recepient</HeaderCell>
            <HeaderCell>Approval</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {data.map((request, index) => {
            return (
              <RequestRow
                id={index}
                key={index}
                request={request}
                address={campaignId}
              />
            );
          })}
        </Body>
      </Table>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const campaign = Campaign(id);
  const requestCount = await campaign.methods.getRequestCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill('')
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  const data: Request[] = [];

  for (let i = 0; i < requests.length; i++) {
    const res: Request = {
      description: '',
      approvalCount: 0,
      complete: false,
      recipient: '',
      value: '',
    };
    res.description = requests[i].description;
    res.approvalCount = requests[i].approvalCount;
    res.complete = requests[i].complete;
    res.recipient = requests[i].recipient;
    res.value = requests[i].value;
    data.push(res);
  }

  return {
    props: {
      data,
    },
  };
}

export interface Request {
  description: string;
  value: string;
  recipient: string;
  complete: boolean;
  approvalCount: number;
}

export default Requests;
