/*
 * interface/config
 * @module Nasa
 *
 * @param Object options
 *
 * Defines the configuration for nasa to follow.
 */


/*
 * _filterNamespace
 *
 * @param String namespace
 * @return String
 */
function _filterNamespace(namespace) {

  let normalized = '';

  normalized = (namespace.charAt(namespace.length - 1) === '/') ? namespace.substr(0, namespace.length - 1) : namespace;  
  normalized = (normalized.charAt(0) === '/') ? normalized.substr(1, normalized.length - 1) : normalized;

  return '/' + normalized;
}



/*
 * export
 */
export default function(options) {

  if(options['root']) options['root'] = _filterNamespace(options['root']);

  if(options['cascade'] && typeof options['cascade'] !== 'boolean') return console.error('Nasa: config(): Cascade must be a boolean value.');
  
  if(options['debug'] && typeof options['debug'] !== 'boolean') return console.error('Nasa: config(): Debug must be a boolean value.');

  Nasa.__config__ = options; 
}
