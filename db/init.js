var asyncjs = require('asyncjs');
var mongoose = require('mongoose');

module.exports = function (app, callback) {
  var db = mongoose.createConnection(app.config.mongoUrl);

  db.on('open', function () {
    db.db.dropDatabase(function () {
      var User = app.Schema.User;
      var Book = app.Schema.Book;
      var Tag = app.Schema.Tag;
      var Instance = app.Schema.Instance;

      var users = [];
      var books = [];
      var tags = [];

      asyncjs.list([
        //create users
        function (callback) {
          var user = new User({
            firstname: "Mostafa",
            lastname: "Eweda",
            email: "eweda@wazapi.com",
            password: "123456",
          });
          users.push(user);
          user.save(callback);
        },
        function (callback) {
          var user = new User({
            firstname: "Yahya",
            lastname: "Moweina",
            email: "yahya@wazapi.com",
            password: "123456",
          });
          users.push(user);
          user.save(callback);
        },
        function (callback) {
          var user = new User({
            firstname: "Ahmed",
            lastname: "ElMorsy",
            email: "morsy@wazapi.com",
            password: "123456",
          });
          users.push(user);
          user.save(callback);
        },
        function (callback) {
          var user = new User({
            firstname: "Ahmed",
            lastname: "ElBayaa",
            email: "elbayaa@wazapi.com",
            password: "123456",
          });
          users.push(user);
          user.save(callback);
        },
        // Create tags
        function (callback) {
          var tagFreqs = [150, 100, 120, 7, 15, 12];
          var tagNames = ["Sports", "Economics", "Computer Science",
              "Technical", "Cooking", "Socializm"];
          var i = 0;
          asyncjs.list(tagNames)
            .each(function(name, next) {
              var tag = new Tag({
                name: name,
                frequency: tagFreqs[i],
              });
              i++;
              tags.push(tag);
              tag.save(next);
            }).end(function(err, result) {
              callback(err);
            });
        },
        // create books
        function (callback) {
          var book = new Book({
            ISBN: "F2FA",
            title: "Kayf takoon Ba3boo3",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Ahmed El-Bayaa",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[0]],
            owner: users[0]._id,
            instancesNum: 3,
            borrowedNum: 2,
            rentalHits: 5,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FB",
            title: "Introduction to Eweda",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Mostafa Eweda",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[1]],
            owner: users[0]._id,
            instancesNum: 2,
            borrowedNum: 1,
            rentalHits: 4,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FC",
            title: "Kayf takoon Yahyooh",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Yahya Moweina",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[0]],
            owner: users[0]._id,
            instancesNum: 3,
            borrowedNum: 2,
            rentalHits: 5,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FD",
            title: "Introduction to Agile web development",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Mostafa Eweda",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[2]],
            owner: users[1]._id,
            instancesNum: 2,
            borrowedNum: 1,
            rentalHits: 4,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FE",
            title: "as7a w asteba7 d el far5a b tetdbe7",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Ahmed El-Bayaa",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[0]],
            owner: users[1]._id,
            instancesNum: 3,
            borrowedNum: 2,
            rentalHits: 5,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FF",
            title: "Introduction to life",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Mostafa Eweda",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[1]],
            owner: users[1]._id,
            instancesNum: 2,
            borrowedNum: 1,
            rentalHits: 4,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FG",
            title: "Introduction to FaceBook",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Ahmed El-Bayaa",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[0]],
            owner: users[2]._id,
            instancesNum: 3,
            borrowedNum: 2,
            rentalHits: 5,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FH",
            title: "Introduction to twitter",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Mostafa Eweda",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[2]],
            owner: users[2]._id,
            instancesNum: 2,
            borrowedNum: 1,
            rentalHits: 4,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FI",
            title: "Eweda how to program",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Ahmed El-Bayaa",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[4]],
            owner: users[2]._id,
            instancesNum: 3,
            borrowedNum: 2,
            rentalHits: 5,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FJ",
            title: "Introduction to Eweda",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Mostafa Eweda",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[1]],
            owner: users[3]._id,
            instancesNum: 2,
            borrowedNum: 1,
            rentalHits: 4,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FK",
            title: "Introduction to yahya",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Ahmed El-Bayaa",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[0]],
            owner: users[3]._id,
            instancesNum: 3,
            borrowedNum: 2,
            rentalHits: 5,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        function (callback) {
          var book = new Book({
            ISBN: "F2FL",
            title: "Introduction to Morsy",
            coverUrl: app.config.uri + "/images/cover.bmp",
            author: "Mostafa Eweda",
            publisher: "Wazapi",
            publishDate: new Date(),
            tags: [tags[1]],
            owner: users[3]._id,
            instancesNum: 2,
            borrowedNum: 1,
            rentalHits: 4,
            marketPrice: 15,
            rentalPrice: 2
          });
          books.push(book);
          book.save(callback);
        },
        // Create appropriate instances
        function (callback) {

          var now = new Date();
          var farFuture = new Date(2013, 0, 1);

          asyncjs.list(books)
            .each(function(book, next) {

              var instIdxs = [];
              for (var i = 0; i < book.instancesNum; i++)
                instIdxs.push(i);

              var borrowedNum = 0;

              asyncjs.list(instIdxs)
                .each(function(idx, next2) {
                  var instance = new Instance({
                    owner: users[0],
                    book: book,
                    freeOn: borrowedNum < book.borrowedNum ? farFuture : now,
                    isPrivate : false
                  });
                  borrowedNum++;
                  instance.save(next2);
                }).end(function(err, result) {
                  next(err);
                });
            }).end(function(err, result) {
              callback(err);
            });
        }
      ]).call().end(function(err, result) {
        callback(err);
      });
    });
  });
};