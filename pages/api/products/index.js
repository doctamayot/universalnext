//import nc from "next-connect";
import Product from "../../../models/Product";
import db from "../../../utils/db";

// const handler = nc();

// handler.get(async (req, res) => {
//   await db.connect();
//   const products = await Product.find({});
//   await db.disconnect();

//   console.log(products);
//   res.send(products);
// });

// export default handler;

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    default:
      res.status(400).json({ message: "Bad Request" });
  }
}

async function getProducts(req, res) {
  await db.connect();
  const products = await Product.find();
  await db.disconnect();

  return res.status(200).json(products);
}
