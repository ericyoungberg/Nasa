/*
 * @file interface/houston
 * @module Nasa.houston
 *
 * @param Object schedule
 */

Nasa = (function(__export__) {

  __export__.houston = function(schedule) {

    // Place the schedule in our current flight to reference
    // from other internal modules.
    Nasa.__flight__.schedule = schedule;
    
    // Iterate through the launch schedule
    Object.keys(schedule).every(function(route) {

      // Check our route based on whether it is dynamic or not
      if(route.indexOf('**') !== -1 || route.indexOf('*') !== -1) {
        if(Nasa.Engine.checkDynamic(route)) return false;
      } else {
        if(Nasa.Engine.check(route)) return false;
      }

      // .every requires that we return either true or false which
      // indicates whether we will continue with the array iteration.
      return true;
    });

  }


  return __export__;

})(Nasa);
