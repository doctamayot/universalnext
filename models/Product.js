import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    category: { type: String },
    location: { type: String },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    age: { type: String, required: true },
    image: { type: String, required: true },
    teacher: { type: String, required: true },
    shedule: { type: String, required: true },
    days: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    subtitle: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    //direccion: [{ type: String, required: true }],
    students: [
      {
        user: { type: String },
        celphone: { type: String },
        desc: { type: String },
        orderid: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
