import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import { commentSchema } from "../utils/schemas.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createComment = asyncHandler(async (req, res) => {
  const { text } = commentSchema.parse(req.body);
  const post = await Post.findById(req.params.postId).select("_id");
  if (!post) return res.status(404).json({ message: "Article not found" });
  const comment = await Comment.create({ text, post: post._id, author: req.user._id });
  await comment.populate("author", "username");
  res.status(201).json({ comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only delete your own comments" });
  }
  await comment.deleteOne();
  res.status(204).end();
});
