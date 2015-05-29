/*
 * Nasa.js
 * @author: Eric Youngberg <eric@lmtlss.net>
 *
 * The simple JavaScript Module Launcher
 *
 * See README.md
 */


// Define all of Nasa
var Nasa = {};

Nasa.__modules__ = [];
Nasa.__config__  = {};
Nasa.__flight__  = {};


/*
 * Interface
 */

import config from './interface/config';
import houston from './interface/houston';
import land from './interface/land';
import launch from './interface/launch';

Nasa.config = config;
Nasa.houston = houston;
Nasa.land = land;
Nasa.launch = launch;


/*
 * Engine
 */

import dbug from './engine/dbug';
import location from './engine/location';
import * as route from './engine/route';

Nasa.Engine = {};

Nasa.Engine.dbug = dbug;
Nasa.Engine.location = location;
Nasa.Engine.checkDynamic = route.checkDynamic;
Nasa.Engine.check = route.check;



// Expose the Nasa

global.Nasa = Nasa;
