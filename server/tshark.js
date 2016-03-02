runTshark = function() {
  var spawn = Npm.require('child_process').spawn
  var options = {
    tsharkCMD: Meteor.settings.tsharkCMD
  }

  var tshark = spawn(options.tsharkCMD, [
    "-i lo",
    '-f udp dst port 4729',
    "-T fields",
    '-E separator=,',
    '-e gsm_a.bssmap.cell_ci',
    "-e e212.mnc",
    '-e e212.mcc',
    '-e gsm_a.lac',
    '-e gsmtap.signal_dbm',
  ]);

  tshark.stdout.on('data', Meteor.bindEnvironment(
    tsharkParser,
    function () { console.log('stdout: failed to bind'); }
  ));

  tshark.stderr.on('data', Meteor.bindEnvironment(
    function (data) {


  }, function () { console.log('stderr: failed to bind'); }));

  tshark.on('exit', Meteor.bindEnvironment(
    function (code) {
        console.log('tshark exited with ' + code);

  }, function () { console.log('onexit: failed to bind'); }));
}

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
