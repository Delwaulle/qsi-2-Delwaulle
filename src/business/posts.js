import _ from 'lodash'; // https://lodash.com/docs/
import { Posts } from '../model';

export function getPublishedPosts() {
  return Posts.findAll({
    where: {
      metadata: {
        published: true,
      },
      deletedAt: null,
    },
    order: [['updatedAt', 'DESC']],
  }).then(posts => posts);
}

export function getPublishedPostById(id) {
  return Posts.findOne({
    where: {
      id,
      metadata: {
        published: true,
      },
    },
  })
    .then(
      post =>
        post && !post.deletedAt
          ? Promise.all([
              _.omit(
                post.get({
                  plain: true,
                }),
                Posts.excludeAttributes
              ),
            ])
          : Promise.reject(new Error('Impossible to find the post'))
    )
    .then(post => post[0]);
}

export function createPost({ title, shortText, fullText }, user) {
  return Posts.create({
    title,
    shortText: shortText || '',
    fullText: fullText || '',
    metadata: {
      published: false,
    },
    UserId: user.id,
  })
    .then(post =>
      _.omit(
        post.get({
          plain: true,
        }),
        Posts.excludeAttributes
      )
    )
    .catch(error => {
      throw error;
    });
}

export function updatePost({ id, title, shortText, fullText, metadata }) {
  return Posts.update(
    {
      title,
      shortText,
      fullText,
      metadata,
    },
    {
      where: {
        id,
      },
      returning: true,
    }
  )
    .then(result => {
      const post = result[1][0];
      return _.omit(
        post.get({
          plain: true,
        }),
        Posts.excludeAttributes
      );
    })
    .catch(error => {
      throw error;
    });
}

export function publishPost(UserId, postId) {
  return Posts.update(
    {
      metadata: {
        published: true,
      },
    },
    {
      where: {
        postId,
      },
      returning: true,
    }
  )
    .then(result => {
      const post = result[1][0];
      return _.omit(
        post.get({
          plain: true,
        }),
        Posts.excludeAttributes
      );
    })
    .catch(error => {
      throw error;
    });
}

export function deletePost(id) {
  return Posts.destroy({
    where: {
      id,
    },
  });
}
