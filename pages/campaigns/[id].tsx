/** @format */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Card, Grid } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

const CampaignPage = ({
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const items = [
    {
      header: manager,
      meta: 'Address of Manager',
      description:
        'The manager is the creator of the campaign and can create transaction requests from the donated amount',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description:
        'You must contribute at least this much wei to become a contributor',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: requestsCount,
      meta: 'Number of Requests',
      description:
        'A request tries to withdraw money from the contract, but before that it has to be approved by the contributors',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: approversCount,
      meta: 'Number of approvers',
      description: 'Number of people who have donated to the campaign',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: web3.utils.fromWei(balance, 'ether'),
      meta: 'Campaign Balance (ether)',
      description:
        'The balance is the amount of money the manager has to spend',
      style: { overflowWrap: 'break-word' },
    },
  ];
  return (
    <Layout>
      <h2>Campaign Details</h2>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={id as string} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${id}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

//this will run in server
export async function getServerSideProps(context) {
  const { id } = context.query;
  const campaign = Campaign(id);
  const summary = await campaign.methods.getSummary().call();

  return {
    props: {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    },
  };
}

export default CampaignPage;
