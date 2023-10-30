import { Schema, models, model, Document, Types } from "mongoose";
export interface ITag extends Document {
  name: String;
  description: String;
  questions: Types.ObjectId[];
  followers: Types.ObjectId[];
  createdAt: Date;
}
const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{ type: Types.ObjectId, ref: "Question" }],
  followers: [{ type: Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Tag = models.Tag || model("Tag", TagSchema);
export default Tag;
