import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify, normalizeTags } from "../utils/slugify.js";
import { postSchema } from "../utils/schemas.js";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function uniqueSlug(title, excludedId = null) {
  const base = slugify(title) || "article";
  let slug = base;
  let counter = 2;
  while (await Post.exists({ slug, ...(excludedId ? { _id: { $ne: excludedId } } : {}) })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export const listPosts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(20, Math.max(1, Number.parseInt(req.query.limit, 10) || 9));
  const filter = {};
  if (req.query.tag) filter.tags = String(req.query.tag).toLowerCase().slice(0, 24);
  if (req.query.search) {
    const term = escapeRegex(String(req.query.search).trim().slice(0, 80));
    if (term) filter.$or = [
      { title: { $regex: term, $options: "i" } },
      { excerpt: { $regex: term, $options: "i" } },
      { content: { $regex: term, $options: "i" } }
    ];
  }
  const [items, total] = await Promise.all([
    Post.find(filter).populate("author", "username").sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    Post.countDocuments(filter)
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true })
    .populate("author", "username").lean();
  if (!post) return res.status(404).json({ message: "Article not found" });
  const comments = await Comment.find({ post: post._id }).populate("author", "username").sort({ createdAt: -1 }).lean();
  res.json({ post, comments });
});

export const getPostForEdit = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "username");
  if (!post) return res.status(404).json({ message: "Article not found" });
  if (post.author._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only edit your own articles" });
  }
  res.json({ post });
});

export const createPost = asyncHandler(async (req, res) => {
  const data = postSchema.parse(req.body);
  const post = await Post.create({
    ...data, tags: normalizeTags(data.tags),
    slug: await uniqueSlug(data.title), author: req.user._id
  });
  await post.populate("author", "username");
  res.status(201).json({ post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const data = postSchema.parse(req.body);
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Article not found" });
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only edit your own articles" });
  }
  post.title = data.title;
  post.excerpt = data.excerpt;
  post.content = data.content;
  post.tags = normalizeTags(data.tags);
  post.coverImage = data.coverImage;
  post.slug = await uniqueSlug(data.title, post._id);
  await post.save();
  await post.populate("author", "username");
  res.json({ post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Article not found" });
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only delete your own articles" });
  }
  await Promise.all([Post.deleteOne({ _id: post._id }), Comment.deleteMany({ post: post._id })]);
  res.status(204).end();
});

export const popularTags = asyncHandler(async (_req, res) => {
  const tags = await Post.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 12 }
  ]);
  res.json({ items: tags.map(({ _id, count }) => ({ name: _id, count })) });
});
