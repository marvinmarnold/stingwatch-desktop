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
