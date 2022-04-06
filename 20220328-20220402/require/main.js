requirejs.config({
  baseUrl: '',
  paths: {
    say: 'js/say',
  }
})

require(['say'], (say) => {
  say('hello');
});

// var modles = {}
// modles['say'] = say
// function difine(fatory) {
//   const say = fatory()
// }

// function require(name, fatory) {
//   if (modules[name]) {
//     fatory(modules[name])
//   }
// }