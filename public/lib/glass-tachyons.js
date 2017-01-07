/*

  Combine lense updates with existing attributes on vnodes and you get theming.
  
  This is an example of using lenses to update the className field on a vnode
  for combination with atomic css libraries e.g. tachyons.
  
*/


var G = Glass
var children = G.lens.prop('children')
var tachyons = {}
    
    tachyons.lens = 
      R.compose(G.lens.attrs, G.lens.className, G.lens.classList)
    
    tachyons.update =
      G.lens.set(tachyons.lens)
      
    tachyons.updateChildren = 
      list => R.over( children, R.map( R.set( tachyons.lens, list)))
