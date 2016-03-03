runTshark = function() {
  var spawn = Npm.require('child_process').spawn
  var options = {
    tsharkCMD: Meteor.settings.tsharkCMD
  }

  var tshark = spawn(options.tsharkCMD, [
    "-i", "lo",
    '-l',
    '-f', 'udp dst port 4729',
    "-T", "fields",
    '-E', 'separator=,',
    '-e', 'gsm_a.bssmap.cell_ci',
    "-e", "e212.mnc",
    '-e', 'e212.mcc',
    '-e', 'gsm_a.lac',
    '-e', 'gsmtap.signal_dbm',
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

var tsharkParser = function(data) {
  console.log('tshark');
  // console.log(data.toString());
  var config = {
    delimiter: ",",
    newline: "\n",
    skipEmptyLines: true,
    dynamicTyping: true,
  }

  var readings = Papa.parse(data.toString(), config).data;

  if(readings) {
    readings.forEach(function(reading) {
      if(reading.length === 5) {
        // console.log(reading);
        reading = sanitizeReading(reading)
        var defaultVal = -999999
        var cid = reading[0] || defaultVal
        // console.log(cid);
        if(cid > 0) {
          // console.log(reading);
          var discovered = {
            commonReading: {
              deviceId: "stingwatch-desktop",
              deviceScannerId: 1,
              readingType: Catcher.READING_TYPES.ANDROID_V1_SIM
            },
            cid:                      cid,
            mnc:                      reading[1] || defaultVal,
            mcc:                      reading[2] || defaultVal,
            lac:                      reading[3] || defaultVal,
            signalStrengthDBM:        reading[4] || defaultVal,
          }

          console.log(discovered);
          Catcher.TelephonyReadings.insert(discovered, function(error, readingId) {
            console.log(error);
            console.log(readingId);
          });
        }
      }
    })
  }
}

var sanitizeReading = function(val) {
  var pat = /^0x.*/
  var hexRegex = new RegExp(pat)

  return reading = _.map(val, function(v) {
    if(hexRegex.test(v)) {
      return parseInt(v)
    }
    return parseFloat(v)
  })
}
