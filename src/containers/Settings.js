import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { onError } from '../libs/errorLib';
import config from '../config';
import BillingForm from '../components/BillingForm';

import './Settings.css';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);
  const history = useHistory();

  function billUser(details) {
    return API.post('notes', '/billing', {
      body: details,
    });
  }

  async function handleFormSubmit(storage, { token, error }) {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert('Your card has been charged successfully!');
      history.push('/');
    } catch (err) {
      onError(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);

  return (
    <div className='Settings'>
      <StripeProvider stripe={stripe}>
        <Elements
          fonts={[
            {
              cssSrc:
                'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800',
            },
          ]}
        >
          <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
        </Elements>
      </StripeProvider>
    </div>
  );
}
