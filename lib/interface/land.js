/*
 * @file interface/import
 * @module nasa.import
 *
 * @param String name
 * @return Module
 * 
 * Fetches a module that is in the repository.
 */

nasa = (function(__export__) {

  __export__.land = function(name) {

    var module;   // The module that is returned from the repository

    if(typeof name === 'string') {

      // Find the module from the module repository
      if(nasa.__modules__[name]) module = nasa.__modules__[name]; 

    } else {
      console.error('NASA: land(' + name + '): must be a string.');
    }

    return module;
  }

  return __export__;

})(nasa);
