import('./split.js').then(code => {
  console.log(code)
  import('./split2.js').then(code => console.log(code))
})