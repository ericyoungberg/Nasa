(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*
 * Nasa.js
 * @author: Eric Youngberg <eric@lmtlss.net>
 *
 * The simple JavaScript Module Launcher
 *
 * See README.md
 */

// Define all of Nasa
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Interface
 */

var _interfaceConfig = require('./interface/config');

var _interfaceConfig2 = _interopRequireDefault(_interfaceConfig);

var _interfaceHouston = require('./interface/houston');

var _interfaceHouston2 = _interopRequireDefault(_interfaceHouston);

var _interfaceLand = require('./interface/land');

var _interfaceLand2 = _interopRequireDefault(_interfaceLand);

var _interfaceLaunch = require('./interface/launch');

var _interfaceLaunch2 = _interopRequireDefault(_interfaceLaunch);

/*
 * Engine
 */

var _engineDbug = require('./engine/dbug');

var _engineDbug2 = _interopRequireDefault(_engineDbug);

var _engineLocation = require('./engine/location');

var _engineLocation2 = _interopRequireDefault(_engineLocation);

var _engineRoute = require('./engine/route');

var route = _interopRequireWildcard(_engineRoute);

var Nasa = {};

Nasa.__modules__ = [];
Nasa.__config__ = {};
Nasa.__flight__ = {};

Nasa.config = _interfaceConfig2['default'];
Nasa.houston = _interfaceHouston2['default'];
Nasa.land = _interfaceLand2['default'];
Nasa.launch = _interfaceLaunch2['default'];

Nasa.Engine = {};

Nasa.Engine.dbug = _engineDbug2['default'];
Nasa.Engine.location = _engineLocation2['default'];
Nasa.Engine.checkDynamic = route.checkDynamic;
Nasa.Engine.check = route.check;

// Expose the Nasa

global.Nasa = Nasa;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./engine/dbug":2,"./engine/location":3,"./engine/route":4,"./interface/config":5,"./interface/houston":6,"./interface/land":7,"./interface/launch":8}],2:[function(require,module,exports){
/*
 * engine/dbug
 * @module Nasa.Engine
 *
 * @param String message || Boolean Header/Footer
 *
 * Creates debug messages based upon whether the debug option is set
 * in the __config__.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (message) {

  if (Nasa.__config__['debug']) {
    if (typeof message === 'boolean') {
      if (message) {
        console.log("DEBUG | Nasa: Beginning debug session for this Houston instance...");
        console.log("DEBUG | Nasa: -------------------------------------------------------");
        console.log("DEBUG | Nasa: CONFIG = " + JSON.stringify(Nasa.__config__));
        console.log("DEBUG |");
      } else {
        console.log("DEBUG |");
        console.log("DEBUG | Nasa: -------------------------------------------------------");
        console.log("DEBUG | Nasa: Ending debug session./");
      }
    } else {
      console.log("DEBUG | Nasa: " + message);
    }
  }
};

module.exports = exports['default'];

},{}],3:[function(require,module,exports){
/*
 * engine/location
 * @module Nasa.Engine
 *
 * Grabs the current location of the website based upon the root path
 * designated in __config__.
 *
 * @return String location
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function () {
  var path = window.location.pathname,
      segments = path.split('/');

  if (segments[segments.length - 1].indexOf('.') === -1) {
    path = path.charAt(path.length - 1) === '/' ? path : path + '/';
  }

  return path;
};

module.exports = exports['default'];

},{}],4:[function(require,module,exports){
/*
 * engine/route
 * @module Nasa.Engine
 *
 * Defines the methods for parsing and handle routes
 * in houston's flight schedule.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.check = check;
exports.checkDynamic = checkDynamic;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dbug = require('./dbug');

var _dbug2 = _interopRequireDefault(_dbug);

var _location = require('./location');

var _location2 = _interopRequireDefault(_location);

/*
 * PRIVATE
 ******************************************************************/

var _routeBoom = []; // Holds all segments of the route
var _locationBoom = []; // Holds all segments of the current location

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
  (0, _dbug2['default'])("Executed the route '" + route + "'\n");

  // Make sure that the route exists
  if (Nasa.__flight__.schedule[route]) {

    Nasa.__flight__.schedule[route].forEach(function (module) {

      // Make sure each module exists
      if (Nasa.__modules__[module]) {
        Nasa.__modules__[module]();
      } else {
        (0, _dbug2['default'])("ERR: '" + module + "' is not a registered module!");
      }
    });
  } else {
    (0, _dbug2['default'])("ERR: Can't find '" + route + "' in the flight schedule!");
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
  if (_routeBoom[0] === '**') {

    (0, _dbug2['default'])('Found dynamic beginning on ' + _routeBoom.join('/'));

    var oldLength = _locationBoom.length; // Save the current length for comparison later

    for (var f = 0; f < _locationBoom.length; f++) {
      if (_locationBoom[f] === _routeBoom[1] || _routeBoom[1] === "*") {
        f = f === 0 ? 1 : 0; // We need to definitely remove at least one thing
        _locationBoom.splice(0, f); // Remove the beginning segments since the dynamic route handles them
        _routeBoom.splice(0, 1); // Remove the ** from the route
        break;
      }
    }

    // If location_boom never gets truncated, then this isn't the right route
    if (oldLength === _locationBoom.length) return false;
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
  if (_routeBoom[_routeBoom.length - 1] === '**') {

    (0, _dbug2['default'])('Found dynamic ending on ' + _routeBoom.join('/'));

    var oldLength = _locationBoom.length; // Save the current length for comparison later

    for (var f = _locationBoom.length - 1; f >= 0; f--) {
      if (_locationBoom[f] === _routeBoom[_routeBoom.length - 2] || _routeBoom[_routeBoom.length - 2] === "*") {
        _locationBoom.splice(f, _locationBoom.length - f); // Remove the ending segments
        _routeBoom.splice(_routeBoom.length - 1, 1); // Remove the **
        break;
      }
    }

    // If location_boom never gets truncated, then this isn't the right route
    if (oldLength === _locationBoom.length) return false;
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

function check(route) {

  // If this is the current location, then execute the modules in this route.
  if ((0, _location2['default'])() === route) {
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

function checkDynamic(route) {

  // Split up the components of both the dynamic route and current location.
  _routeBoom = route.split('/');
  _locationBoom = Nasa.Engine.location().split('/');

  // Since this route is dynamic, it is okay for the route to be shorter
  // than the location, but not the other way around
  if (_routeBoom.length > _locationBoom.length) return false;

  // If there is a dynamic beginning or ending, these functions will try to parse the
  // request. Only if the parsing fails will they return false.
  if (!_dynamicBeginning() || !_dynamicEnding()) return false;

  // Compare the segments iteratively
  for (var i = 0; i < _routeBoom.length; i++) {

    // If this is a dynamic segment, then move forward.
    if (_routeBoom[i] === '*') continue;

    var index; // Allocate an index variable in this scope for use below.

    // If the segment is semi-dynamic, check that the attached part matches
    if ((index = _routeBoom[i].indexOf('*')) !== -1) {

      if (index === 0) {
        //--> Wildcard at beginning

        var end = _routeBoom[i].substr(1, _routeBoom[i].length);

        // If the string after the wildcard isn't at the end of the location,
        // then this isn't the route you are looking for.
        if (_locationBoom[i].indexOf(end) !== _locationBoom[i].length - 1 - (end.length - 1)) return false;
      } else if (index === _routeBoom[i].length - 1) {
        //--> Wildcard at end

        var beginning = _routeBoom[i].substr(0, index);

        // If the string before the wildcard isn't at the beginning of the location,
        // then this isn't the route you are looking for.
        if (_locationBoom[i].substr(0, beginning.length) !== beginning) return false;
      } else {} //--> Wildcard in the middle

      // If we didn't return while checking semi-dynamic above, then we can move on
      // to the next segment.
      continue;
    }

    // If this segment isn't dynamic, do a straight comparison
    if (_routeBoom[i] !== _locationBoom[i]) return false;
  }

  // If we didn't return, then that means we didn't find any reason why this
  // shouldn't be the correct route. So let's execute the modules.
  _execute(route);

  return true;
}

},{"./dbug":2,"./location":3}],5:[function(require,module,exports){
/*
 * interface/config
 * @module Nasa
 *
 * @param Object options
 *
 * Defines the configuration for nasa to follow.
 */

/*
 * _filterNamespace
 *
 * @param String namespace
 * @return String
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function _filterNamespace(namespace) {

  var normalized = '';

  normalized = namespace.charAt(namespace.length - 1) === '/' ? namespace.substr(0, namespace.length - 1) : namespace;
  normalized = normalized.charAt(0) === '/' ? normalized.substr(1, normalized.length - 1) : normalized;

  return '/' + normalized;
}

/*
 * export
 */

exports['default'] = function (options) {

  if (options['root']) options['root'] = _filterNamespace(options['root']);

  if (options['cascade'] && typeof options['cascade'] !== 'boolean') return console.error('Nasa: config(): Cascade must be a boolean value.');

  if (options['debug'] && typeof options['debug'] !== 'boolean') return console.error('Nasa: config(): Debug must be a boolean value.');

  Nasa.__config__ = options;
};

module.exports = exports['default'];

},{}],6:[function(require,module,exports){
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

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _engineDbug = require('../engine/dbug');

var _engineDbug2 = _interopRequireDefault(_engineDbug);

var _engineRoute = require('../engine/route');

exports['default'] = function (schedule, cascade) {

  // Add debug headers
  (0, _engineDbug2['default'])(true);

  // Set the default value for cascading to true
  if (typeof cascade === 'undefined') {
    cascade = typeof Nasa.__config__['cascade'] === 'undefined' ? true : Nasa.__config__['cascade'];
  }

  // Place the schedule in our current flight to reference
  // from other internal modules.
  Nasa.__flight__.schedule = schedule;

  // Iterate through the launch schedule
  Object.keys(schedule).every(function (route) {

    var builtRoute = _buildRoute(route);

    // Replace the route if the name has changed
    if (route !== builtRoute) {
      Nasa.__flight__.schedule[builtRoute] = Nasa.__flight__.schedule[route];
      delete Nasa.__flight__.schedule[route];
    }

    // Check our route based on whether it is dynamic or not
    if (builtRoute.indexOf('*') !== -1) {
      if ((0, _engineRoute.checkDynamic)(builtRoute)) return cascade;
    } else {
      if ((0, _engineRoute.check)(builtRoute)) return cascade;
    }

    return true;
  });

  // Enter debugging footer
  (0, _engineDbug2['default'])(false);
};

/*
 * private  _buildRoute
 * 
 * Builds the route string by normalizing the input from 
 * the houston config.
 *
 * @param String route
 *
 * @return String
 */
function _buildRoute(route) {

  var newRoute = route;

  // Normalize the route string
  newRoute = newRoute.indexOf('/') === 0 ? newRoute.slice(1, newRoute.length) : newRoute;
  newRoute = '/' + newRoute;

  // Prepend the root if the user defined one
  newRoute = Nasa.__config__['root'] ? Nasa.__config__['root'] + newRoute : newRoute;

  return newRoute;
}
module.exports = exports['default'];

},{"../engine/dbug":2,"../engine/route":4}],7:[function(require,module,exports){
/*
 * interface/land
 * @module Nasa
 *
 * @param String name
 * @return Module
 * 
 * Fetches a module that is in the repository.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (name) {

  if (typeof name === 'string') {

    // Find the module from the module repository
    if (Nasa.__modules__[name]) {
      return Nasa.__modules__[name]();
    } else {
      console.error('Nasa.land(' + name + '): ' + name + ' doesn\'t exist.');
    }
  } else {
    console.error('Nasa.land(' + name + '): Module name must be a string.');
  }
};

module.exports = exports['default'];

},{}],8:[function(require,module,exports){
/*
 * interface/launch
 * @module Nasa
 *
 * @param String name
 * @param Module module
 *
 * Adds a new module to the repository.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (name, module) {

  if (typeof name === 'string') {

    // If there is already a module with that name, then send an error
    if (!Nasa.__modules__[name]) {

      // Assign this module to its space in the repository
      Nasa.__modules__[name] = module;
    } else {
      console.error('Nasa.launch(' + name + '): ' + name + ' already exists.');
    }
  } else {
    console.error('Nasa.launch(' + name + '): Module name must be a string.');
  }
};

module.exports = exports['default'];

},{}]},{},[1]);
