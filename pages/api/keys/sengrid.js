import sgMail from '@sendgrid/mail';

exports.forgotPassword = async (email, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: { email },
    from: 'universalactinginfo@gmail.com',
    subject: 'Reset Password Link',
    html: `<p>Please use the following link to reset your password:</p>
          <p>${process.env.CLIENT_URL}/reset/${token}</p>`,
  };
  try {
    await sgMail.send(msg);
    //res.status(200).send('Message sent successfully.')
  } catch (error) {
    console.log('ERROR', error);
    //res.status(400).send('Message not sent.')
  }
};
// import fetch from 'node-fetch';

// const SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send';

// const sendEmail = async (email, token) => {
//   console.log(token);
//   await fetch(SENDGRID_API, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
//     },
//     body: JSON.stringify({
//       personalizations: [
//         {
//           to: [
//             {
//               email,
//             },
//           ],
//           subject: 'Reset Password Link :)',
//         },
//       ],
//       from: {
//         email: 'universalactinginfo@gmail.com',
//         name: 'Universal Acting',
//       },
//       content: [
//         {
//           type: 'text/html',
//           value: `<p>Please use the following link to reset your password:</p>
//           <p>${process.env.CLIENT_URL}/reset/${token}</p>`,
//         },
//       ],
//     }),
//   });
// };

// export { sendEmail };
