import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth, isAdmin } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  let orders = await Order.find({})
    .populate('user', 'firstname lastname')
    // .populate({ path: 'user', select: 'firstname' })
    // .populate({ path: 'user', select: 'lastname' })
    .sort({ createdAt: -1 });
  await db.disconnect();
  res.send(orders);
});

export default handler;
