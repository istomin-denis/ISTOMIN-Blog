import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, default: "", maxlength: 240 },
  content: { type: String, required: true, maxlength: 30000 },
  tags: [{ type: String, lowercase: true, trim: true }],
  coverImage: { type: String, default: "" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  views: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

postSchema.index({ title: "text", excerpt: "text", content: "text" });
export const Post = mongoose.model("Post", postSchema);
