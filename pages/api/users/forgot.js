import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import jwt from 'jsonwebtoken';
import { forgotPassword } from '../keys/sengrid';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({
      error: 'User with that email does not exist',
    });
  }
  await db.disconnect();
  // generate token and email to user
  const token = jwt.sign(
    { name: user.firstname },
    process.env.JWT_RESET_PASSWORD,
    {
      expiresIn: '10m',
    }
  );
  res.send({ message: 'Email Sent', user });
  // send email
  const { email } = req.body;
  forgotPassword(email, token);
  return user.updateOne({ resetPasswordLink: token });
});

export default handler;
