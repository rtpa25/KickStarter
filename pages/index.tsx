/** @format */

import { Button, Card } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import Link from 'next/link';

const Show = ({ campaigns }: { campaigns: string[] }) => {
  const items = campaigns.map((address: string) => {
    return {
      header: address,
      description: (
        <Link href={`/campaigns/${address}`}>
          <a>Go to campaign address</a>
        </Link>
      ),
      fluid: true,
    };
  });

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link href={'/campaigns/new'}>
          <Button
            content={'Create Campaign'}
            icon={'add circle'}
            primary={true}
            floated={'right'}
          />
        </Link>

        <Card.Group items={items} />
      </div>
    </Layout>
  );
};

//this the network request that will happen on the next server and not on the client side
export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
}

export default Show;
