(function() {

  Nasa.config({
    'root': '/example'
  });

  Nasa.houston({
    "/": [ 'another', 'tester', 'newer' ],
    "/**/*.html": ['tester', 'killer' ],
    '/other/dyn.html': ['tester', 'killerer']
  });

})();
