import bcrypt from 'bcrypt'; // https://github.com/kelektiv/node.bcrypt.js

export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        // Avoid usage of auto-increment numbers, UUID is a better choice
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'User ID',
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        comment: 'User first name',
        // setter to standardize
        set(val) {
          this.setDataValue(
            'firstName',
            val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
          );
        },
      },
      lastName: {
        type: DataTypes.STRING,
        comment: 'User last name',
        // setter to standardize
        set(val) {
          this.setDataValue(
            'lastName',
            val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
          );
        },
      },
      email: {
        type: DataTypes.STRING,
        // Not null management
        allowNull: false,
        comment: 'User email',
        // Field validation
        validate: {
          isEmail: true,
        },
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Hash for the user password',
        // setter to hash the password
        set(val) {
          const hash = bcrypt.hashSync(val, 12);
          this.setDataValue('hash', hash);
        },
      },
    },
    {
      // logical delete over physical delete
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  );

  Users.associate = models => {
    Users.hasMany(models.Posts);
  };

  // we don't want to send password even if crypted
  Users.excludeAttributes = ['hash'];

  // anonymous function mandatody to access this in instance method
  /* eslint func-names:off */
  Users.prototype.comparePassword = function(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.hash, (err, res) => {
        if (err || !res) {
          return reject(new Error('INVALID CREDENTIALS'));
        }
        return resolve();
      });
    });
  };

  return Users;
};
