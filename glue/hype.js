var request = require('request'),
    host = 'http://singlytics-hyperion.herokuapp.com';

var getApp = function (id, callback) {
  var url = host + '/analytics/' + id + '/'
  console.log('calling hyperion: ' + url)
  return request(url);
}

var hype = {
  getApp: getApp
}

exports.hype = hype