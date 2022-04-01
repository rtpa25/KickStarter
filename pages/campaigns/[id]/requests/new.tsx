/** @format */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

const NewRequest = () => {
  const router = useRouter();
  const campaignId = router.asPath.split('/')[2];
  const [description, setDescription] = useState('');
  const [valueInEther, setValueInEther] = useState('');
  const [recipient, setRecipient] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    const campaign = Campaign(campaignId);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(valueInEther, 'ether'),
          recipient
        )
        .send({
          from: accounts[0],
        });
    } catch (err: any) {
      setErrorMessage(err.message);
    }
    setIsLoading(false);
    setDescription('');
    setRecipient('');
    setValueInEther('');
  };

  return (
    <Layout>
      <h3>Create Request</h3>
      <Form onSubmit={submitHandler} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={valueInEther}
            onChange={(e) => {
              setValueInEther(e.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
            }}
          />
        </Form.Field>
        <Message error header='Oops!' content={errorMessage} />
        <Button loading={isLoading} primary>
          Create!
        </Button>
        <Link href={`/campaigns/${campaignId}/requests`}>
          <a>
            <Button>Back</Button>
          </a>
        </Link>
      </Form>
    </Layout>
  );
};

export default NewRequest;
