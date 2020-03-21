'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      passwordHash: {
        allowNull: false,
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {}
  );
  User.associate = models => {
    // associations can be defined here
  };
  /**
   * This is a class method, it is not called on an individual
   * user object, but rather the class as a whole.
   * e.g. User.authenticate('user1', 'password1234')
   * @param {string} email user's email
   * @param {string} password user's password
   * @returns {User} the retrieved User object
   * @throws {Error} if the user cannot be found or the password is invalid
   */
  User.authenticate = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    // bcrypt is a one-way hashing algorithm that allows us to
    // store strings on the database rather than the raw
    // passwords. Check out the docs for more detail
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      return user;
    }

    // always throw 'invalid password', even if email doesn't exist
    throw new Error('invalid password');
  };
  return User;
};
