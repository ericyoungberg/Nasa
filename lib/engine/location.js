/*
 * @file engine/location
 * @module Nasa.Engine
 *
 * @return String location
 *
 * Grabs the current location of the website based upon the namespace
 * designated in __config__.
 */

Nasa.Engine = (function(__export__) {

  __export__.location = function() {

    var location = window.location.pathname;

    // Replace the retrieved location with any designated namespace
    if(Nasa.__config__.namespace) location = location.replace(Nasa.__config__.namespace, '');
    
    return location;
  }


  return __export__;

})(Nasa.Engine);
