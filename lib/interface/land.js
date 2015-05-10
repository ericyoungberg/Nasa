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
