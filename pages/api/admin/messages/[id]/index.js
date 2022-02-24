import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Message from '../../../../../models/Message';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.delete(async (req, res) => {
  await db.connect();
  const message = await Message.findById(req.query.id);

  if (message) {
    await message.remove();
    await db.disconnect();
    res.send({ message: 'Message Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Message Not Found' });
  }
});

export default handler;
