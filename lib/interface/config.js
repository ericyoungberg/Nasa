/*
 * interface/config
 * @module Nasa
 *
 * @param Object options
 *
 * Defines the configuration for nasa to follow.
 */

Nasa = (function(__export__) {

  /*
   * _filterNamespace
   *
   * @param String namespace
   * @return String
   */
  function _filterNamespace(namespace) {
    return (namespace.charAt(namespace.length - 1) == '/') ? namespace.substr(0, namespace.length - 2) : namespace;  
  }



  /*
   * export
   */
  __export__.config = function(options) {

    if(options['root']) options['root'] = _filterNamespace(options['root']);

    if(options['cascade'] && typeof options['cascade'] !== 'boolean') return console.error('Nasa: config(): Cascade must be a boolean value.');

    Nasa.__config__ = options; 
  }


  return __export__;

})(Nasa);
