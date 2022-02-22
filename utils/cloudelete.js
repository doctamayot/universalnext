import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deletecloud = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.imageId);
  } catch (error) {
    console.log(error);
  }
};
export { deletecloud };
