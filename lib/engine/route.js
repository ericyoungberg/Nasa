/*
 * engine/route
 * @module Nasa.Engine
 *
 * Defines the methods for parsing and handle routes
 * in houston's flight schedule.
 */

import dbug from './dbug';
import location from './location';


/*
 * PRIVATE
 ******************************************************************/

var _routeBoom = [];      // Holds all segments of the route
var _locationBoom = [];   // Holds all segments of the current location



/*
 * _execute
 *
 * @param String route
 *
 * Loads all of the modules associated with that route.
 */
function _execute(route) {

 /* 
  * DEBUG
  */
  dbug("Executed the route '"+ route +"'\n");

  // Make sure that the route exists
  if(Nasa.__flight__.schedule[route]) {

    Nasa.__flight__.schedule[route].forEach(function(module) {

      // Make sure each module exists
      if(Nasa.__modules__[module]) {
        Nasa.__modules__[module](); 
      } else {
        dbug("ERR: '" + module + "' is not a registered module!");
      }

    });

  } else {
    dbug("ERR: Can't find '" + route + "' in the flight schedule!");
  }
}


/*
 * _dynamicBeginning
 *
 * @return Boolean
 *
 * If the route starts with a dynamic segment, this truncates
 * the location accordingly.
 */
function _dynamicBeginning() {

  // If the route starts out as a dynamic segment, then find where
  // the location should start.
  if(_routeBoom[0] === '**') {

    dbug('Found dynamic beginning on ' + _routeBoom.join('/'));

    var oldLength = _locationBoom.length;    // Save the current length for comparison later

    for(var f = 0; f < _locationBoom.length; f++) {
      if(_locationBoom[f] === _routeBoom[1] || _routeBoom[1] === "*") {
        f = (f === 0) ? 1 : 0;      // We need to definitely remove at least one thing
        _locationBoom.splice(0, f); // Remove the beginning segments since the dynamic route handles them
        _routeBoom.splice(0, 1);    // Remove the ** from the route
        break;
      }
    }

    // If location_boom never gets truncated, then this isn't the right route
    if(oldLength === _locationBoom.length) return false; 
  }

  return true;
}


/*
 * _dynamicEnding
 *
 * @return Boolean
 *
 * If the route ends with a dynamic segment, this truncates
 * the location accordingly.
 */
function _dynamicEnding() {

  // If the route ends with a dynamic segment, make sure the earlier
  // segments match.
  if(_routeBoom[_routeBoom.length - 1] === '**') {

    dbug('Found dynamic ending on ' + _routeBoom.join('/'));

    var oldLength = _locationBoom.length;   // Save the current length for comparison later

    for(var f = _locationBoom.length - 1; f >= 0; f--) {
      if(_locationBoom[f] === _routeBoom[_routeBoom.length - 2] || _routeBoom[_routeBoom.length - 2] === "*") {
        _locationBoom.splice(f, _locationBoom.length - f);  // Remove the ending segments
        _routeBoom.splice(_routeBoom.length - 1, 1);        // Remove the **
        break;
      } 
    }

    // If location_boom never gets truncated, then this isn't the right route
    if(oldLength === _locationBoom.length) return false;
  }

  return true; 
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
export function check(route) {

  // If this is the current location, then execute the modules in this route.
  if(location() === route) {
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
export function checkDynamic(route) {

  // Split up the components of both the dynamic route and current location.
  _routeBoom = route.split('/');
  _locationBoom = Nasa.Engine.location().split('/');

  // Since this route is dynamic, it is okay for the route to be shorter
  // than the location, but not the other way around
  if(_routeBoom.length > _locationBoom.length) return false;

  // If there is a dynamic beginning or ending, these functions will try to parse the
  // request. Only if the parsing fails will they return false.
  if(!_dynamicBeginning() || !_dynamicEnding()) return false;


  // Compare the segments iteratively
  for(var i = 0; i < _routeBoom.length; i++) {

    // If this is a dynamic segment, then move forward.
    if(_routeBoom[i] === '*') continue; 

    var index; // Allocate an index variable in this scope for use below.

    // If the segment is semi-dynamic, check that the attached part matches
    if((index = _routeBoom[i].indexOf('*')) !== -1) {

      if(index === 0) {                                 //--> Wildcard at beginning

        var end = _routeBoom[i].substr(1, _routeBoom[i].length);

        // If the string after the wildcard isn't at the end of the location,
        // then this isn't the route you are looking for.
        if(_locationBoom[i].indexOf(end) !== _locationBoom[i].length - 1 - (end.length - 1)) return false;

      } else if(index === _routeBoom[i].length - 1) {   //--> Wildcard at end

        var beginning = _routeBoom[i].substr(0, index);

        // If the string before the wildcard isn't at the beginning of the location,
        // then this isn't the route you are looking for.
        if(_locationBoom[i].substr(0, beginning.length) !== beginning) return false;
      
      } else {                                          //--> Wildcard in the middle
      
      }

      // If we didn't return while checking semi-dynamic above, then we can move on
      // to the next segment.
      continue;
    }


    // If this segment isn't dynamic, do a straight comparison
    if(_routeBoom[i] !== _locationBoom[i]) return false;
  }

  // If we didn't return, then that means we didn't find any reason why this 
  // shouldn't be the correct route. So let's execute the modules.
  _execute(route);

  return true;
}
