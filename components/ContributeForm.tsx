/** @format */

import { useRouter } from 'next/router';
import { FC, FormEvent, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const ContributeForm: FC<{ address: string }> = ({ address }) => {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const campaign = Campaign(address);
    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether'),
      });

      router.replace(`/campaigns/${address}`); //sort of refreshing the page
    } catch (error: any) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
    setValue('');
  };

  return (
    <div>
      <Form onSubmit={submitHandler} error={!!errorMessage}>
        <Form.Field>
          <label htmlFor=''>Amount to Contribute</label>
          <Input
            label='ether'
            labelPosition='right'
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </Form.Field>
        <Message error header='Oops!' content={errorMessage} />
        <Button loading={isLoading} primary>
          Contribute!
        </Button>
      </Form>
    </div>
  );
};

export default ContributeForm;
