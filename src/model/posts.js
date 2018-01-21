export default (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    'Posts',
    {
      id: {
        // Avoid usage of auto-increment numbers, UUID is a better choice
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Post ID',
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING,
        comment: 'Title of the post',
      },
      shortText: {
        type: DataTypes.STRING,
        comment: 'Short text of the post',
      },
      fullText: {
        type: DataTypes.STRING,
        comment: 'Full text of the post',
      },
      metadata: {
        type: DataTypes.JSON,
        comment: 'metatadata of the post',
      },
    },
    {
      // logical delete over physical delete
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['id'],
        },
      ],
    }
  );

  Posts.associate = models => {
    Posts.belongsTo(models.Users);
  };

  return Posts;
};
