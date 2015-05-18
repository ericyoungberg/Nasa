/*
 * engine/dbug
 * @module Nasa.Engine
 *
 * @param String message || Boolean Header/Footer
 *
 * Creates debug messages based upon whether the debug option is set
 * in the __config__.
 */

Nasa.Engine = (function(__export__) {

  __export__.dbug = function(message) {

    if(Nasa.__config__['debug']) {
      if(typeof message === 'boolean') {
        if(message) {
          console.log("DEBUG | Nasa: Beginning debug session for this Houston instance...");
          console.log("DEBUG | Nasa: -------------------------------------------------------");
          console.log("DEBUG | Nasa: CONFIG = " + JSON.stringify(Nasa.__config__));
          console.log("DEBUG |");
        } else {
          console.log("DEBUG |");
          console.log("DEBUG | Nasa: -------------------------------------------------------");
          console.log("DEBUG | Nasa: Ending debug session./") 
        } 
      } else {
        console.log("DEBUG | Nasa: " + message);
      }
    }
  }


  return __export__;

})(Nasa.Engine);
