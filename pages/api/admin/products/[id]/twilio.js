import nc from 'next-connect';
//import Product from '../../../models/Product';
import { isAuth, isAdmin } from '../../../../../utils/auth';
import db from '../../../../../utils/db';
import { onError } from '../../../../../utils/error';
import Product from '../../../../../models/Product';

const accountSid = process.env.TWILIO_AS;
const accountToken = process.env.TWILIO_AT;

const twilio = require('twilio')(accountSid, accountToken);

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);
  const students = product.students;

  if (students.length === 0) {
    await db.disconnect();
    res.status(404).send({ message: 'This class dont have students' });
  } else {
    students.forEach(function (cel) {
      twilio.messages
        .create({
          to: `57${cel.celphone}`,
          body: 'Hello, don`t forget that tomorrow you or your son will have a class at Universal Casting',
          from: '3056778471',
        })
        .then((notification) => {
          console.log(notification);
        })
        .catch((err) => {
          console.error(err);
        });

      res.send();
    });
  }
});

// handler.delete(async (req, res) => {
//   await db.connect();
//   const product = await Product.findById(req.query.id);
//   if (product) {
//     await product.remove();
//     await db.disconnect();
//     res.send({ message: 'Product Deleted' });
//   } else {
//     await db.disconnect();
//     res.status(404).send({ message: 'Product Not Found' });
//   }
// });

export default handler;
