import nc from 'next-connect';
//import { isAuth } from '../../../../../utils/auth';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';

const handler = nc();
//handler.use(isAuth);

handler.get(async (req, res) => {
  db.connect();
  console.log(req);
  const product = await Product.findById(req.query.id);
  db.disconnect();
  if (product) {
    res.send(product.students);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

handler.put(async (req, res) => {
  await db.connect();
  console.log(req.body);
  const product = await Product.findById(req.query.id);
  if (product) {
    const student = {
      user: req.body.shippingAddress.student,
      celphone: req.body.userInfo.celphone,
      desc: req.body.shippingAddress.desc,
      orderid: req.body.data._id,
    };

    await product.updateOne({ $push: { students: { $each: [student] } } });

    product.countInStock = product.countInStock - Number(req.body.cantidad);

    await product.save();
    await db.disconnect();
    res.send({ message: 'order delivered' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'order not found' });
  }
});

export default handler;
