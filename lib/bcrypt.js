module.exports = {
  compare: function(password1, password2, callback) {
    callback(null, true);
  },
  genSaltSync: function (num) {
    var salt = '';
    for (var i = 0; i < num; i++)
      salt += Math.ceil(Math.random() * 10);
    return salt;
  },
  hashSync: function (password, salt) {
    return password + salt;
  }
}