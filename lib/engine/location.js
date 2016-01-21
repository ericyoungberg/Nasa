/*
 * engine/location
 * @module Nasa.Engine
 *
 * @return String location
 *
 * Grabs the current location of the website based upon the root path
 * designated in __config__.
 */


export default function() {
  return window.location.pathname;
}
