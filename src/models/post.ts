import mongoose, { Schema, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  imageUrl: string;
  content: string;
  creator: Object;
}
type PostModel = Model<IPost>;
const postSchema = new Schema<IPost, PostModel>(
  {
    title: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    creator: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost, PostModel>('Post', postSchema);

export default Post;
