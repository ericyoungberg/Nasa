/*
 * @file interface/houston
 * @module nasa.houston
 *
 * @param Object schedule
 */

nasa = (function(__export__) {

  __export__.houston = function(schedule) {
    
    // Iterate through the launch schedule
    Object.keys(schedule).forEach(function(route) {

      // If this is the current location, then execute the modules in this route
      if(nasa.__engine__.location() === route) {

        // Execute each one of the modules associated with that route
        schedule[route].forEach(function(module) {
          __export__.__modules__[module]();
        });

      }

    });

  }

  return __export__;

})(nasa);
