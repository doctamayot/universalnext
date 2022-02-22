import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});
export default handler;

handler.put(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  if (product) {
    product.name = req.body.name;
    product.category = req.body.category;
    product.description = req.body.description;
    product.age = req.body.age;
    product.teacher = req.body.teacher;
    product.shedule = req.body.shedule;
    product.days = req.body.days;
    product.duration = req.body.duration;
    product.price = req.body.price;
    product.subtitle = req.body.subtitle;
    product.countInStock = req.body.countInStock;
    product.image = req.body.image;
    product.imageId = req.body.imageId;
    product.location = req.body.location;
    product.slug = req.body.slug;

    await product.save();
    await db.disconnect();
    res.send({ message: 'Product Updated Successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);

  if (product) {
    await cloudinary.uploader.destroy(product.imageId);
    await product.remove();
    await db.disconnect();
    res.send({ message: 'Product Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});
