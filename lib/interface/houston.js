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

import dbug from '../engine/dbug';
import { check, checkDynamic } from '../engine/route';


export default function(schedule, cascade) {

  // Add debug headers
  dbug(true);


  // Set the default value for cascading to true
  if (typeof cascade === 'undefined') {
    cascade = (typeof Nasa.__config__['cascade'] === 'undefined') ? true : Nasa.__config__['cascade'];
  }

  // Place the schedule in our current flight to reference
  // from other internal modules.
  Nasa.__flight__.schedule = schedule;
  

  // Iterate through the launch schedule
  Object.keys(schedule).every(function(route) {

    let builtRoute = _buildRoute(route);
    Nasa.__flight__.schedule[builtRoute] = Nasa.__flight__.schedule[route];
    delete Nasa.__flight__.schedule[route];

    // Check our route based on whether it is dynamic or not
    if(builtRoute.indexOf('*') !== -1) {
      if(checkDynamic(builtRoute)) return cascade;
    } else {
      if(check(builtRoute)) return cascade;
    }

    return true;
  });

  // Enter debugging footer
  dbug(false);
}



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

  let newRoute = route;

  // Normalize the route string
  newRoute = (newRoute.indexOf('/') === 0) ? newRoute.slice(1, newRoute.length) : newRoute;
  newRoute = '/' + newRoute;

  // Prepend the root if the user defined one
  newRoute = (Nasa.__config__['root']) ? Nasa.__config__['root'] + newRoute : newRoute;

  return newRoute;
}
