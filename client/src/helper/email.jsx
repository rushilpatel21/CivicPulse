import axios from 'axios';

const template_id = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
const service_id = import.meta.env.VITE_EMAIL_SERVICE_ID;
const user_id = import.meta.env.VITE_EMAIL_USER_ID;

export const sendEmail = async ( email, username ) => {
  
    const data = {
      service_id: service_id,
      template_id: template_id,
      user_id: user_id,
      template_params: {
        to_name: 'Rushil Patel',
        from_name: username,
        message: `
        There is a new signup on CivicPulse, wohooo! \n
        Details \n
        Email: ${email}, \n
        username: ${username}
        `,
        reply_to: "rushilpatel210@gmail.com"
      }
    };
  
    axios.post('https://api.emailjs.com/api/v1.0/email/send', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch((error) => {
      console.error('Error sending email:', error.response ? error.response.data : error);
      console.error('Request data:', data);
    });
  };