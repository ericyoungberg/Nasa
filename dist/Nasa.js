/*
 * @file: Nasa.js
 * @author: Eric Youngberg <eric@lmtlss.net>
 *
 * Nasa (1.0.0)
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
 * @file engine/location
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

/*
 * @file interface/config
 * @module Nasa
 *
 * @param Object options
 *
 * Defines the configuration for nasa to follow.
 */

Nasa = (function(__export__) {

  /*
   * filterNamespace
   *
   * @param String namespace
   * @return String
   */
  function filterNamespace(namespace) {
    return (namespace.charAt(namespace.length - 1) == '/') ? namespace.substr(0, namespace.length - 2) : namespace;  
  }



  /*
   * export
   */
  __export__.config = function(options) {

    options['root'] = filterNamespace(options['root']);

    Nasa.__config__ = options; 
  }


  return __export__;

})(Nasa);

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

/*
 * @file interface/land
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
        console.log('Nasa.land(' + name + '): ' + name + ' doesn\'t exist.'); 
      }

    } else {
      console.error('Nasa.land(' + name + '): Module name must be a string.');
    }
  }

  return __export__;

})(Nasa);

/*
 * @file interface/launch
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
