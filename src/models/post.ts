import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  imageUrl: string;
  content: string;
  creator: Types.ObjectId;
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost, PostModel>('Post', postSchema);

export default Post;
