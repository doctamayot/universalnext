const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'doctamayot@hotmail.com', // Change to your recipient
//   from: 'universalactinginfo@gmail.com', // Change to your verified sender
//   subject: 'Reset Password Link',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: `<p>Please use the following link to reset your password:</p>
//   <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>`,
// };
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent');
//   })
//   .catch((error) => {
//     console.error(error);
//   });

exports.forgotPassword = (email, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: { email },
    from: 'universalactinginfo@gmail.com',
    subject: 'Reset Password Link',
    html: `<p>Please use the following link to reset your password:</p>
          <p>${process.env.CLIENT_URL}/reset/${token}</p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};
