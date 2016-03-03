Template.stingwatch.events({
  "click #start-stingwatch-desktop": function(event, template) {
    console.log('client click');
    Meteor.call("stingwatch/desktop/start", function(error, result) {
      console.log('client response');
      if(error){
        console.log("error", error);
      }
      if(result){

      }
    });
  }
});
