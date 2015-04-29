/*
 * @file interface/import
 * @module Nasa.import
 *
 * @param String name
 * @return Module
 * 
 * Fetches a module that is in the repository.
 */

Nasa = (function(__export__) {

  __export__.land = function(name) {

    var module;   // The module that is returned from the repository

    if(typeof name === 'string') {

      // Find the module from the module repository
      if(Nasa.__modules__[name]) module = Nasa.__modules__[name]; 

    } else {
      console.error('Nasa: land(' + name + '): must be a string.');
    }

    return module;
  }

  return __export__;

})(Nasa);
