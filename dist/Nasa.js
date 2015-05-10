/*
 * Nasa.js
 * @author: Eric Youngberg <eric@lmtlss.net>
 *
 * Nasa (1.2.0)
 * The simple JavaScript Module Launcher
 *
 * See README.md
 */

var Nasa = {

  /*
   * Engine
   *
   * @type Array[Function]
   *
   * Holds all processing methods for Nasa.
   */
  Engine: [],


  /*
   * __modules__
   *
   * @type Array[String]
   * 
   * Holds all modules registered with Nasa.
   */
  __modules__: [],


  /*
   * __config__
   *
   * @type Object[String]
   *
   * Registers all configuration settings.
   */
  __config__: {},


  /*
   * __flight__
   *
   * @type Object[String]
   *
   * Keeps track of all current variables.
   */
  __flight__: {}

};

/*
 * engine/location
 * @module Nasa.Engine
 *
 * @return String location
 *
 * Grabs the current location of the website based upon the root path
 * designated in __config__.
 */

Nasa.Engine = (function(__export__) {

  __export__.location = function() {

    var location = window.location.pathname;

    // Replace the retrieved location with any designated root path
    if(Nasa.__config__.root) location = location.replace(Nasa.__config__.root, '');
    
    return location;
  }


  return __export__;

})(Nasa.Engine);

/*
 * engine/route
 * @module Nasa.Engine
 *
 * Defines the methods for parsing and handle routes
 * in houston's flight schedule.
 */

Nasa.Engine = (function(__export__) {

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
    Nasa.__flight__.schedule[route].forEach(function(module) {
      Nasa.__modules__[module](); 
    });
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
    if(_routeBoom[0] === '*') {

      var oldLength = _locationBoom.length;    // Save the current length for comparison later

      for(var f = 0; f < _locationBoom.length; f++) {
        if(_locationBoom[f] === _routeBoom[1]) {
          _locationBoom.splice(0, f); // Remove the beginning segments since the dynamic route handles them
          _routeBoom.splice(0, 1 );   // Remove the * from the route
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
    if(_routeBoom[_routeBoom.length - 1] === '*') {

      var oldLength = _locationBoom.length;   // Save the current length for comparison later

      for(var f = _locationBoom.length - 1; f >= 0; f--) {
        if(_locationBoom[f] === _routeBoom[_routeBoom.length - 2]) {
          _locationBoom.splice(f + 1, _locationBoom.length - (f + 1));  // Remove the ending segments
          _routeBoom.splice(_routeBoom.length - 1, 1);                  // Remove the *
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


  return __export__;

})(Nasa.Engine);

/*
 * interface/config
 * @module Nasa
 *
 * @param Object options
 *
 * Defines the configuration for nasa to follow.
 */

Nasa = (function(__export__) {

  /*
   * _filterNamespace
   *
   * @param String namespace
   * @return String
   */
  function _filterNamespace(namespace) {
    return (namespace.charAt(namespace.length - 1) == '/') ? namespace.substr(0, namespace.length - 2) : namespace;  
  }



  /*
   * export
   */
  __export__.config = function(options) {

    if(options['root']) options['root'] = _filterNamespace(options['root']);

    if(options['cascade'] && typeof options['cascade'] !== 'boolean') return console.error('Nasa: config(): Cascade must be a boolean value.');

    Nasa.__config__ = options; 
  }


  return __export__;

})(Nasa);

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
  }


  return __export__;

})(Nasa);

/*
 * interface/land
 * @module Nasa
 *
 * @param String name
 * @return Module
 * 
 * Fetches a module that is in the repository.
 */

Nasa = (function(__export__) {

  __export__.land = function(name) {

    if(typeof name === 'string') {

      // Find the module from the module repository
      if(Nasa.__modules__[name]){
        return Nasa.__modules__[name](); 
      } else {
        console.error('Nasa.land(' + name + '): ' + name + ' doesn\'t exist.'); 
      }

    } else {
      console.error('Nasa.land(' + name + '): Module name must be a string.');
    }
  }

  return __export__;

})(Nasa);

/*
 * interface/launch
 * @module Nasa
 *
 * @param String name
 * @param Module module
 *
 * Adds a new module to the repository.
 */

Nasa = (function(__export__) {
  
  __export__.launch = function(name, module) {

    if(typeof name === 'string') {

      // If there is already a module with that name, then send an error
      if(!Nasa.__modules__[name]) {

        // Assign this module to its space in the repository
        Nasa.__modules__[name] = module;

      } else {
        console.error('Nasa.launch(' + name + '): ' + name + ' already exists.');  
      }

    } else {
      console.error('Nasa.launch(' + name + '): Module name must be a string.');
    }
  }

  return __export__;

})(Nasa);
