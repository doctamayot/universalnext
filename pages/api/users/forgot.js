import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import jwt from 'jsonwebtoken';
//import { sendEmail } from '../keys/sengrid';
//import { forgotPassword } from '../keys/sengrid';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({
      error: 'User with that email does not exist',
    });
  }

  // generate token and email to user
  const token = await jwt.sign(
    { name: user.firstname },
    process.env.JWT_RESET_PASSWORD,
    {
      expiresIn: '10m',
    }
  );
  //
  // send email

  return await user.updateOne({ resetPasswordLink: token }, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'Password reset failed. Try later.',
      });
    }

    const { email } = req.body;

    //res.send({ message: 'Email Sent', user });

    //forgotPassword(email, token);
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: { email },
      from: 'universalactinginfo@gmail.com',
      subject: 'Reset Password Link',
      html: `<p>Please use the following link to reset your password:</p>
          <p>${process.env.CLIENT_URL}/reset/${token}</p>`,
    };
    try {
      sgMail.send(msg);
      res.status(200).send('Message sent successfully.');
    } catch (error) {
      console.log('ERROR', error);
      res.status(400).send('Message not sent.');
    }
  });
});

export default handler;
