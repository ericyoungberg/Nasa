/*
 * @file engine/route
 * @module Nasa.Engine
 *
 * Defines the methods for parsing and handle routes
 * in houston's flight schedule.
 */

Nasa.Engine = (function(__export__) {

  /*
   * _execute
   *
   * @param String route
   *
   * Loads all of the modules associated with that route.
   */
  function _execute(route) {
    Nasa.__flight__.schedule[route].forEach(function(module) {
      Nasa.__modules__[module](); 
    });
  }



  /*
   * EXPORTS
   ***************************************************************/

  /*
   * check
   *
   * @param String route
   * @return Boolean
   *
   * Compares the current location to this static route.
   */
  __export__.check = function(route) {

    // If this is the current location, then execute the modules in this route.
    if(Nasa.Engine.location() === route) {
      _execute(route);
      return true;
    }

    return false;
  }


  /*
   * checkDynamic
   * 
   * @param String route
   * @return Boolean
   *
   * Compares the current location to this dynamic route
   * after breaking up the dynamic route's wildcards.
   */
  __export__.checkDynamic = function(route) {

    // Split up the components of both the dynamic route and current location.
    var route_boom = route.split('/');
    var location_boom = Nasa.Engine.location().split('/');

    if(route_boom.length !== location_boom.length) return false;

    // Iteratively compare the two arrays together, bailing as soon as something doesn't match.
    for(var i = 0; i < route_boom.length; i++) {

      if(route_boom[i] === '**') continue; // If we found a dynamic component, then we can skip ahead.

      var index; // Allocate an index variable in this scope for use below.

      // If the segment is semi-dynamic, check that the attached part matches
      if((index = route_boom[i].indexOf('*')) !== -1) {

        if(index === 0) {                                 //--> Wildcard at beginning

          var end = route_boom[i].substr(1, route_boom[i].length);

          // If the string after the wildcard isn't at the end of the location,
          // then this isn't the route you are looking for.
          if(location_boom[i].indexOf(end) !== location_boom[i].length - 1 - (end.length - 1)) return false;

        } else if(index === route_boom[i].length - 1) {   //--> Wildcard at end

          var beginning = route_boom[i].substr(0, index);

          // If the string before the wildcard isn't at the beginning of the location,
          // then this isn't the route you are looking for.
          if(location_boom[i].substr(0, beginning.length) !== beginning) return false;
        
        } else {                                          //--> Wildcard in the middle
        
        }


        // If we didn't return while checking semi-dynamic above, then we can move on
        // to the next segment.
        continue;
      }

      // If a segment doesn't match up then leave. 
      //
      // **Hand waving motion** This isn't the route you are looking for. 
      if(route_boom[i] !== location_boom[i]) return false;
    }

    // If we didn't return, then that means we didn't find any reason why this 
    // shouldn't be the correct route. So let's execute the modules.
    _execute(route);

    return true;
  }


  return __export__;

})(Nasa.Engine);
