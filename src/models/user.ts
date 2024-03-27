import mongoose, { Schema, Model, Types } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  status: string;
  posts: Types.ObjectId[];
}

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>({
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
    default: 'I am new!',
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;
