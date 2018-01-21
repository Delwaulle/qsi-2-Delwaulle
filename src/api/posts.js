import express from 'express';
import logger from '../logger';
import {
  createPost,
  updatePost,
  deletePost,
  getPublishedPosts,
  getPublishedPostById,
  publishPost,
} from '../business/posts';

export const apiPosts = express.Router();

/**
 * @api {get} /posts/published Get all the published posts
 * @apiVersion 1.0.0
 * @apiName getPublishedPosts
 * @apiGroup Posts
 *
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} posts details of the retrieved published posts.
 */
apiPosts.get('/published', (req, res) =>
  getPublishedPosts()
    .then(publishedPosts =>
      res.status(200).send({
        success: true,
        posts: publishedPosts,
        message: 'All the published posts are successfully retrieved',
      })
    )
    .catch(err => {
      logger.error(`💥 Failed to get the published posts : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    })
);

/**
 * @api {get} /posts/published/:id Get the published post corresponding to the id
 * @apiVersion 1.0.0
 * @apiName getPublishedPostById
 * @apiGroup Posts
 *
 * @apiParam {String} id Id of the post
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} post details of the post.
 */
apiPosts.get('/published/:id', (req, res) =>
  getPublishedPostById(req.params.id)
    .then(post =>
      res.status(200).send({
        success: true,
        post,
        message: 'Details of the published post are successfully retrieved',
      })
    )
    .catch(err => {
      logger.error(`💥 Failed to get post : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    })
);

export const apiPostsProtected = express.Router();

/**
 * @api {post} /posts Create a new post
 * @apiVersion 1.0.0
 * @apiName createPost
 * @apiGroup Posts
 *
 * @apiParam {STRING} title Title of the post.
 * @apiParam {STRING} shortText  ShortText of the post.
 * @apiParam {STRING} fullText  FullText of the post.
 * @apiParam {STRING} metadata  Metadata of the post.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} post informations of the new Post.
 */
apiPostsProtected.post('/', (req, res) => {
  if (!req.body.title || !req.body.fullText)
    res.status(400).send({
      success: false,
      message: 'The title and the fullText are required',
    });
  else {
    createPost(req.body, req.user)
      .then(post =>
        res.status(200).send({
          success: true,
          post,
          message: 'The post is successfully created',
        })
      )
      .catch(err => {
        logger.error(`💥 Failed to create the post : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`,
        });
      });
  }
});

/**
 * @api {put} /posts Update an existing post
 * @apiVersion 1.0.0
 * @apiName updatePost
 * @apiGroup Posts
 *
 * @apiParam {STRING} id Id of the post.
 * @apiParam {STRING} title Title of the post.
 * @apiParam {STRING} shortText  ShortText of the post.
 * @apiParam {STRING} fullText  FullText of the post.
 * @apiParam {STRING} metadata  Metadata of the post.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} post informations of the updated post.
 */
apiPostsProtected.put('/', (req, res) => {
  if (!req.body.id)
    res.status(400).send({
      success: false,
      message: 'The ID of the post is required',
    });
  else {
    updatePost(req.body)
      .then(() =>
        res.status(200).send({
          success: true,
          message: 'The post is successfully updated',
        })
      )
      .catch(err => {
        logger.error(`💥 Failed to update the post : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`,
        });
      });
  }
});

/**
 * @api {delete} /posts Delete a post
 * @apiVersion 1.0.0
 * @apiName deletePost
 * @apiGroup Posts
 *
 * @apiParam {STRING} id Id of the post.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 */
apiPostsProtected.delete('/', (req, res) => {
  if (!req.body.id)
    res.status(400).send({
      success: false,
      message: 'The ID of the post is required',
    });
  else {
    deletePost(req.body.id)
      .then(() =>
        res.status(200).send({
          success: true,
          message: 'The post is successfully deleted',
        })
      )
      .catch(err => {
        logger.error(`💥 Failed to delete the post : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`,
        });
      });
  }
});

/**
 * @api {put} /:id/publish Publish a post
 * @apiVersion 1.0.0
 * @apiName publishPost
 * @apiGroup Posts
 *
 * @apiParam {STRING} id Id of the post.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} post Post informations.
 */
apiPostsProtected.put('/:id/publish', (req, res) =>
  publishPost(req.user.id, req.params.id)
    .then(post => {
      res.status(200).send({
        success: true,
        post,
        message: 'The post is successfully published',
      });
    })
    .catch(err => {
      logger.error(`💥 Failed to publish the post : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    })
);
