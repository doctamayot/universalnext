import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    desc: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
