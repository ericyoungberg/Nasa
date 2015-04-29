/*
 * @file interface/config
 * @module nasa
 *
 * @param Object options
 *
 * Defines the configuration for nasa to follow.
 */

nasa = (function(__export__) {

  /*
   * filterNamespace
   *
   * @param String namespace
   * @return String
   */
  function filterNamespace(namespace) {
    return (namespace.charAt(namespace.length) === '/') ? namespace.substr(0, namespace.length - 1) : namespace;  
  }


  /*
   * export
   */
  return  __export__.config = function(options) {

    options['namespace'] = filterNamespace(options['namespace']);

    nasa.__config__ = options; 
  }

})(nasa);
