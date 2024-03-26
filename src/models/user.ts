import mongoose, { Schema, Model, ObjectId } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  status: string;
  posts: ObjectId[];
}

type UserModal = Model<IUser>;

const userSchema = new Schema<IUser, UserModal>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

const User = mongoose.model<IUser, UserModal>('User', userSchema);
export default User;
