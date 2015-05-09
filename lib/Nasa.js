/*
 * @file: Nasa.js
 * @author: Eric Youngberg <eric@lmtlss.net>
 *
 * Nasa (1.1.0)
 * The simple JavaScript Module Launcher
 *
 * See README.md
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
