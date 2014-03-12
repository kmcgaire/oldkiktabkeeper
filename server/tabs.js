/**
 * Created by kevinmcgaire on 3/11/2014.
 */

var Tabs = require('./db').collection('tabs');
var Summary = require('./db').collection('summary');

exports.createTab = function (to, from, description, amount, callback) {
  if (amount < 0) {
    var temp = to;
    to = from;
    from = temp;
  }
  var newTab = {
    to: to,
    from: from,
    description: description,
    amount: amount,
    date: new Date().getTime(),
    verified: false
  };
  Tabs.insert(newTab);
  Summary.findOne({
    $or: [
      {
        user1: newTab.to,
        user2: newTab.from
      },
      {
        user1: newTab.from,
        user2: newTab.to
      }
    ]
  }, function (err, doc) {
    if (!doc) {
      Summary.insert({
        user1: from,
        user2: to,
        balance: amount
      });
    } else if (doc.user1 === from) {
      Summary.update({
          user1: from,
          user2: to
        }, {
          user1: from,
          user2: to,
          balance: doc.balance + amount
        }
      );
    } else {
      Summary.update({
        user1: to,
        user2: from
      }, {
        user1: to,
        user2: from,
        balance: doc.balance - amount
      });
    }
  });
  callback(newTab);
};


exports.getTabs = function (user1, user2, limit, callback) {
  Tabs.find({
    $or: [
      {
        to: user1,
        from: user2
      },
      {
        to: user2,
        from: user1
      }
    ]
  }).limit(limit, function (err, docs) {
      callback(docs)
    })
};