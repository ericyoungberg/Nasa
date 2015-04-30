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
