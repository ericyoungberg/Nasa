/*
 * @file: Nasa.js
 * @author: Eric Youngberg <eric@lmtlss.net>
 *
 * Defines the Nasa object as a global to be referenced throughout
 * the application structure.
 */

var Nasa = {

  /*
   * Engine
   *
   * @type Array[Function]
   *
   * Holds all processing methods for Nasa.
   */
  Engine: [],


  /*
   * __modules__
   *
   * @type Array[String]
   * 
   * Holds all modules registered with Nasa.
   */
  __modules__: [],


  /*
   * __config__
   *
   * @type Object[String]
   *
   * Registers all configuration settings.
   */
  __config__: {},


  /*
   * __flight__
   *
   * @type Object[String]
   *
   * Keeps track of all current variables.
   */
  __flight__: {}

};
