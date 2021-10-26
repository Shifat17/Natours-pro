import axios from 'axios';

export const bookTour = async (tourId) => {
  //    Get the checkout session
  try {
    const res = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    const url = res.data.session.url;
    window.location = url;
  } catch (error) {
    console.log(error.message);
  }
};
