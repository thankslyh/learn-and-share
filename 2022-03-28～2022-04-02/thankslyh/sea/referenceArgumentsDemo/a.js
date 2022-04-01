var myModule = {
  exports: {}
}

function define(factory) {
  factory(myModule);
}