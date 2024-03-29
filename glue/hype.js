var request = require('request'),
    host = 'http://singlytics-hyperion.herokuapp.com';

var getApp = function (id, callback) {
  var url = host + '/analytics/' + id + '/'
  console.log('calling hyperion: ' + url)
  return request({url: url, timeout: 1000, headers: {'Content-Type': 'application/json'}});
}

var getEventJson = function (appId, eventId, callback) {
  var url = host + '/event/' + appId + '/' + eventId + '/'
  console.log('calling hyperion: ' + url)
  return request({url: url, timeout: 1000, headers: {'Content-Type': 'application/json'}});
}

var hype = {
  getApp: getApp,
  getEventJson: getEventJson
}

exports.hype = hype