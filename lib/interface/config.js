/*
 * @file interface/config
 * @module Nasa
 *
 * @param Object options
 *
 * Defines the configuration for nasa to follow.
 */

Nasa = (function(__export__) {

  /*
   * filterNamespace
   *
   * @param String namespace
   * @return String
   */
  function filterNamespace(namespace) {
    return (namespace.charAt(namespace.length - 1) == '/') ? namespace.substr(0, namespace.length - 2) : namespace;  
  }


  /*
   * export
   */
  __export__.config = function(options) {

    options['namespace'] = filterNamespace(options['namespace']);

    Nasa.__config__ = options; 
  }


  return __export__;

})(Nasa);
