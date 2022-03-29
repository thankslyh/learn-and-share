requirejs.config({
  baseUrl: '',
  paths: {
    say: 'js/say',
  }
})

require(['say'], (say) => {
  say('hello');
});