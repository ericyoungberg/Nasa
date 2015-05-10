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
