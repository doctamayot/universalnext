import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      student: { type: String, required: true },
      age: { type: String, required: true },
      desc: { type: String, required: true },
    },

    userInfo: {
      email: { type: String, required: true },
      celphone: { type: String, required: true },
      firstname: { type: String, required: true },
    },

    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email_address: String },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
