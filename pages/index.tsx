/** @format */

import { useState, useEffect } from 'react';
import factory from '../ethereum/factory';

const Show = () => {
  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      console.log(campaigns);
    };

    fetchCampaigns();
  }, []);

  return <div>Welcome to the Campaign List Page</div>;
};

export default Show;
