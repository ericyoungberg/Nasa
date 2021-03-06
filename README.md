# Nasa
The simple JavaScript Module Launcher

##What is Nasa?
Nasa is a JavaScript Module Launcher that loads the modules you create based upon your application's current route. 
Since server-rendered applications have no way of determining how to react whenever the user interacts without re-rendering, 
we use JavaScript for that purpose. The problem with large concatenated JavaScript files is that there is no way to specify which 
parts are needed throughout your application's lifecycle unless you manually load each module as its own separate .js file. This 
causes a whole mess of issues. AMD, CommonJS, and ES6 never addressed this issue; only providing methods for loading modules, 
not catering them to your app state. 

This is where Nasa comes in.

## Installation
With NPM: `npm install nasa-launcher`
With Bower: `bower install nasa`

##Houston
Houston handles what we call your flight schedule. You pass houston an object that specifies which modules need to be launched at which route.

```JavaScript
Nasa.houston({
    '/': ['module1', 'module2'],
    '/*/edit': ['module1', 'module3'],
    '/admin/**': ['module4']
});
```
You should place your houston and config method calls at the end of all of your JavaScript. 
If `houston` and `config` are placed in a launchfile, the basic order that you should concatenate is:

```JavaScript
<script src="nasa.min.js"></script>
<script src="app.js"></script>
<script src="launchfile.js"></script>
```

##Modules
The way we create and use modules is through our `launch` and `land` methods. Each module is named by a __string__ with a second argument as a callback.

```JavaScript
Nasa.launch('module1', function() {
    return {
        greet: function(name) {
            console.log('Hello ' + name + ' from module1.');
        }
    }
});

Nasa.launch('module2', function() {
    var otherModule = Nasa.land('module1');
    otherModule.greet('Eric');
});
```

##Configuration
So say Nasa is at _http://www.yoursite.com/blog/_ in your app or site...

```JavaScript
Nasa.config({
    root: '/blog',  // Root folder of Nasa
    cascade: true,  // Whether houston will execute all of the routes
    debug: false    // Whether the Nasa will log its activity
});
```

_The default values for cascade and debug are shown above._

##Questions?
Contact me at _eric@lmtlss.net_ or submit a PR.
