import PostModel from '../models/Post.js';

class PostController {
  async createPost(req, res) {
    try {
      const doc = new PostModel({ ...req.body, user: req.id });
      const post = await doc.save();
      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: 'Failed to create post',
      });
    }
  }
  async deletePost(req, res) {
    try {
      const id = req.params.id;
      const findPost = await PostModel.findByIdAndDelete(id);
      res.json({ message: true });
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: 'Failed to delete post',
      });
    }
  }
  async updatePost(req, res) {
    try {
      const id = req.params.id;
      const newPost = await PostModel.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { returnDocument: 'after' },
      ).populate('user');
      res.json({ newPost });
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: 'Failed to update post',
      });
    }
  }

  async getAll(req, res) {
    const { sort, tag } = req.query;
    const getSort = sort === 'popular' ? { viewsCount: -1 } : { createdAt: -1 };
    try {
      const posts = await PostModel.find(!!tag ? { tags: tag } : {})
        .sort(getSort)
        .populate('user')
        .exec();
      res.json(posts);
    } catch (err) {
      res.status(404).json({
        message: 'Failed to get posts',
      });
    }
  }

  async getLastTags(req, res) {
    try {
      const doc = await PostModel.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, title: '$_id', count: 1 } },
      ]);

      res.json(doc);
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: 'Failed to get tags',
      });
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const doc = await PostModel.findOneAndUpdate(
        { _id: id },
        { $inc: { viewsCount: 1 } },
        { returnDocument: 'after' },
      ).populate('user');

      if (!doc) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }

      res.json(doc);
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: 'Failed to get post',
      });
    }
  }
}

export default new PostController();
