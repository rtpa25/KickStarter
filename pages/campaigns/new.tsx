/** @format */

import { FormEvent, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { useRouter } from 'next/router';

const CampaignNew = () => {
  const router = useRouter();

  const [minimumContribution, setMinimumContribution] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      router.push('/');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
    setIsLoading(false);
    setMinimumContribution('');
  };

  return (
    <Layout>
      <h3>Create A Campaign</h3>
      <Form onSubmit={submitHandler} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            labelPosition='right'
            label='wei'
            value={minimumContribution}
            onChange={(e) => {
              setMinimumContribution(e.target.value);
            }}
          />
        </Form.Field>
        <Message error header='Oops!' content={errorMessage} />
        <Button loading={isLoading} primary={true}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
