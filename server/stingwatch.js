Meteor.methods({
  'stingwatch/desktop/start': function() {
     runTshark();
     runAirprobe();
  },
});
