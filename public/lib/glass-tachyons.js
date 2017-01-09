/*

  Combine lens updates with existing attributes on vnodes and you get theming!
  
  This is an example of using lenses to update the className field on a vnode
  for combination with atomic css libraries e.g. tachyons.
  
*/


var G = Glass
var children = G.Lens.prop('children')
var tachyons = {}
    
    tachyons.lens = 
      G.Lens.compose(G.Lens.attrs, G.Lens.className, G.Lens.classList)
    
    tachyons.update =
      tachyons.lens.set
      
    tachyons.updateChildren = 
      classList => children => children.over( R.map( tachyons.lens.set(classList) ) )
