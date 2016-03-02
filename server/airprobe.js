runAirprobe = function() {
  var spawn = Npm.require('child_process').spawn
  var options = {
    airprobeCMD: Meteor.settings.airprobeCMD,
    airprobeFreq: Meteor.settings.airprobeFreq
  }

  airprobe = spawn(options.airprobeCMD, [
    '-f', options.airprobeFreq + 'M'
  ]);

  airprobe.stdout.on('data',  data => {});
  airprobe.stderr.on('data', data => {});

  airprobe.on('exit', Meteor.bindEnvironment(
    function (code, signal) {
      if(signal == "SIGTERM") {}
    }, function () {}
  ));
};

var tsharkParser = function(csv) {
  var config = {
    delimiter: "",
    newline: "",
    dynamicTyping: true,
  }

  var readings = Papa.parse(data.toString(), config).data;

  if(readings) {
    readings.forEach(function(reading) {
      if(reading.length > 0) {
        reading = sanitizeReading(reading)
        var defaultVal = -999999
        var cid = reading[0] || defaultVal

        if(cid > 0) {
          var now = new Date()
          Catcher.TelephonyReadings.insert({
            cid:                      cid,
            mnc:                      reading[1] || defaultVal,
            mcc:                      reading[2] || defaultVal,
            lac:                      reading[3] || defaultVal,
            signalStrengthDBM:        reading[4] || defaultVal,
          });
        }
      }
    })
  }
}

var sanitizeReading = function(val) {
  var pat = /^0x.*/
  var hexRegex = new RegExp(pat)

  return reading = _.map(reading, function(v) {
    if(hexRegex.test(v)) {
      return parseInt(v)
    }
    return parseFloat(v)
  })
}
