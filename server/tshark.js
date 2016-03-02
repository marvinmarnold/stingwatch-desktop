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
