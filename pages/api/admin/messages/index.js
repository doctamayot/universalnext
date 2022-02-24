import nc from 'next-connect';

import Message from '../../../../models/Message';
import db from '../../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const messages = await Message.find({}).sort({ createdAt: -1 });
  await db.disconnect();
  res.send(messages);
});

handler.post(async (req, res) => {
  await db.connect();
  console.log(req.body);

  const newMessage = new Message({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    desc: req.body.desc,
  });

  const mess = await newMessage.save();
  await db.disconnect();
  res.send({ message: 'Class Created', mess });
});

export default handler;
