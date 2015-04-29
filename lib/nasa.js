/*
 * @file: nasa.js
 * @author: Eric Youngberg <eric@lmtlss.net>
 *
 * Defines the nasa object as a global to be referenced throughout
 * the application structure.
 */

var nasa = {

  /*
   * __modules__
   *
   * @type Array[String]
   * 
   * Holds all modules registered with nasa.
   */
  __modules__: [],


  /*
   * __engine__
   *
   * @type Array[Function]
   *
   * Holds all processing methods for nasa.
   */
  __engine__: [],


  /*
   * __config__
   *
   * @type Object[String]
   *
   * Registers all configuration settings.
   */
  __config__: {}

};
