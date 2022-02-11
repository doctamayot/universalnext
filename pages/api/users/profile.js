import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken, isAuth } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id);
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.email = req.body.email;
  user.password = req.body.password
    ? bcrypt.hashSync(req.body.password)
    : user.password;
  user.celphone = req.body.celphone;

  await user.save();
  await db.disconnect();

  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    isAdmin: user.isAdmin,
    celphone: user.celphone,
  });
});

export default handler;
