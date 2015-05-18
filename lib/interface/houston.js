/*
 * interface/houston
 * @module Nasa
 *
 * @param Object schedule
 * @param Boolean cascade
 *
 * Analyzes the flight schedule and passes each route to the Engine.route module
 * for parsing.
 */

Nasa = (function(__export__) {

  __export__.houston = function(schedule, cascade) {

    // Add debug headers
    Nasa.Engine.dbug(true);


    // Set the default value for cascading to true
    if (typeof cascade === 'undefined') {
      cascade = (typeof Nasa.__config__['cascade'] === 'undefined') ? true : Nasa.__config__['cascade'];
    }

    // Place the schedule in our current flight to reference
    // from other internal modules.
    Nasa.__flight__.schedule = schedule;
    
    // Iterate through the launch schedule
    Object.keys(schedule).every(function(route) {

      // Check our route based on whether it is dynamic or not
      if(route.indexOf('*') !== -1) {
        if(Nasa.Engine.checkDynamic(route)) return cascade;
      } else {
        if(Nasa.Engine.check(route)) return cascade;
      }

      // .every requires that we return either true or false which
      // indicates whether we will continue with the array iteration.
      return true;
    });

    // Enter debugging footer
    Nasa.Engine.dbug(false);
  }


  return __export__;

})(Nasa);
