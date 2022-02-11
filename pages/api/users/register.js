import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    celphone: req.body.celphone,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });
  const user = await newUser.save();
  await db.disconnect();

  const token = signToken(user);

  res.send({
    token,
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    celphone: user.celphone,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
