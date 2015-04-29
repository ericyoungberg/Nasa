(function() {

  Nasa.config({
    'namespace': '/example'
  });

  Nasa.houston({
    "/": [ 'another', 'tester', 'newer' ],
    "/**/*.html": ['tester', 'killer' ],
    '/other/dyn.*': ['tester', 'killerer']
  });

})();
