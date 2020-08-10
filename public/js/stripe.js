/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51HDyhOH0PyO1c3J7nS1Zg272EKViX32rF5VXyN0Nfh7FTsorAtxi1WTFPa3eRAsvNbKDN7srAM2jTwJvpLmVCrK100y7TGzNiY'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'Application/json',
        Authorization: `Bearer sk_test_51HDyhOH0PyO1c3J7djCQwBoHXNecaMbAoYqJmM2XZXGkKqQn7HGqRPlDVRxeD54klyvrkr2mKWFqZgBzAlLsZs9V0091V9Lef8`,
      },
    });
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log(err);
    // console.log(process.env.STRIPE_SECRET_KEY);
    showAlert('error', err);
  }
};
