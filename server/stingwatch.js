Meteor.methods({
  'stingwatch/desktop/start': function() {
    console.log('stingwatch/desktop/start');
    runTshark();
    runAirprobe();
  },
});
