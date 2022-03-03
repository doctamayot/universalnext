import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  const { resetPasswordLink, password } = req.body;

  if (resetPasswordLink) {
    // check for expiry
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' });
      }
    });

    const user = await User.findOne({ resetPasswordLink });
    user.password = password ? bcrypt.hashSync(password) : user.password;
    user.resetPasswordLink = '';
    await user.save();
    await db.disconnect();
    res.send({
      msg: 'ok',
    });
  }
});
export default handler;
