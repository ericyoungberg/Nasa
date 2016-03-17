/*
 * engine/location
 * @module Nasa.Engine
 *
 * Grabs the current location of the website based upon the root path
 * designated in __config__.
 *
 * @return String location
 */


export default function() {
  let path     = window.location.pathname,
      segments = path.split('/');

  if (segments[segments.length - 1].indexOf('.') === -1) {
    path = (path.charAt(path.length - 1) === '/') ? path : path + '/'; 
  }

  return path;
}
