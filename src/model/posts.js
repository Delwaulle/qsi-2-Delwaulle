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
        // setter to standardize
        set(val) {
          this.setDataValue(
            'title',
            val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
          );
        },
      },
      shortText: {
        type: DataTypes.STRING,
        comment: 'Short text of the post',
        // setter to standardize
        set() {
          this.setDataValue('shortText');
        },
      },
      fullText: {
        type: DataTypes.STRING,
        // Not null management
        allowNull: false,
        comment: 'Full text of the post',
        // Field validation
        validate: {
          isEmail: true,
        },
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

  return Posts;
};
