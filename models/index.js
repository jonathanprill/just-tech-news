const User = require('./User');
const Post = require('./Post');




//create associations
//A user can make many posts. But a post only belongs to a single user
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
});



module.exports = { User, Post };