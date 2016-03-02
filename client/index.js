Template.stingwatch.events({
  "click #start-stingwatch-desktop": function(event, template) {
    Meteor.call("stingwatch/desktop/start", function(error, result) {
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });
  }
});
