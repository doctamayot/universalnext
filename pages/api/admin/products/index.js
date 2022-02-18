import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();

  const newProduct = new Product({
    name: 'ACTING FOR RUGRATS',
    slug: Math.random(),
    category: 'Kids',
    description: 'descripcion',
    age: '4-5-6',
    teacher: 'Elena Maria Garcia',
    shedule: 'Saturday mornings 9:00 - 9:45 am',
    days: '1/15, 1/22, 1/29, 2/5, 2/1, 2/19',
    duration: '6 weeks',
    price: 150,
    subtitle: 'Acting Classes for Kids & Adults that deliver results!',
    countInStock: 5,
    location: '',
    image: '/img/kids2.jpg',
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Class Created', product });
});

export default handler;
