/*
 * @file interface/export
 * @module nasa.export
 *
 * @param String name
 * @param Module module
 *
 * Adds a new module to the repository.
 */

nasa = (function(__export__) {
  
  __export__.launch = function(name, module) {

    if(typeof name === 'string') {

      // If there is already a module with that name, then send an error
      if(!__export__.__modules__[name]) {

        // Assign this module to its space in the repository
        __export__.__modules__[name] = module;

      } else {
        console.error('NASA: export(' + name + '): ' + name + ' already exists.');  
      }

    } else {
      console.error('NASA: export(' + name + '): Name must be a string.');
    }
  }

  return __export__;

})(nasa);
