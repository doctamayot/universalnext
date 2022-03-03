import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../keys/sengrid';

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
  const token = jwt.sign(
    { name: user.firstname },
    process.env.JWT_RESET_PASSWORD,
    {
      expiresIn: '10m',
    }
  );
  //
  // send email

  const { email } = req.body;

  sendEmail(email, token);
  user.resetPasswordLink = token;

  user.save();

  await db.disconnect();
  res.send({ message: 'Email Sent', user });
  await db.disconnect();
});

export default handler;
