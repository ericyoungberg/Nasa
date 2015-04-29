/*
 * @file engine/location
 * @module nasa.__engine__
 *
 * @return String location
 *
 * Grabs the current location of the website based upon the namespace
 * designated in __config__.
 */

nasa.__engine__ = (function(__export__) {

  __export__.location = function() {

    var location = window.location.pathname;

    // Replace the retrieved location with any designated namespace
    if(nasa.__config__.namespace) location = location.replace(nasa.__config__.namespace, '');

    console.log(location);
    
    return location;
  }


  return __export__;

})(nasa.__engine__);
