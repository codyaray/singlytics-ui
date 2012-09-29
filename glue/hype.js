var request = require('request'),
    host = 'http://singlytics-hyperion.herokuapp.com';

var getApp = function (id, callback) {
  var url = host + '/analytics/' + id
  console.log('calling hyperion: ' + url)
  request(url, function (error, response, body) {
    if (!error) {
      callback(body)
    } else {
      console.log('error' + error)
    }
  })
}

var hype = {
  getApp: getApp
}

exports.hype = hype