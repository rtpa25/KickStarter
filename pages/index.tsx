/** @format */

import { Button, Card } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

const Show = ({ campaigns }: { campaigns: string[] }) => {
  const items = campaigns.map((address: string) => {
    return {
      header: address,
      description: <a>View Campaign</a>,
      fluid: true,
    };
  });

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Button
          content={'Create Campaign'}
          icon={'add circle'}
          primary={true}
          floated={'right'}
        />
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
