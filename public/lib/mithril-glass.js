/*
  Glass is a namespace full of helpers for making stream updates with lens output less cumbersome.
*/

var Glass =
(() => {
  function component(o){
    return {
      oninit (vnode){
        
        vnode.state.view = o()
      }
      ,view (vnode){
        
        return vnode.state.view()
      }
    }
  }
  
  
  const Over = state => lens => f => state(R.over(lens, f, state() ))
  const View = state => lens => R.view(lens, state())
  const Set = state => lens => x => state(R.set(lens, x, state() ))
  
  // Creates a state stream and attaches some bound lens methods to the instance
  function State(...args){
    
    const state = flyd.stream(...args)
    
    state.set = Set(state)
    state.view = View(state)
    state.over = Over(state)
    
    return state
  }
  
  const lens = R.lens
  
  // lenses to safely access vnode.attrs & vnode.className
  lens.attrs = 
    R.lens( R.compose( R.or({}), R.prop('attrs')), R.assoc('attrs'))
  
  lens.className = 
    R.lens( R.propOr('', 'className'),  R.assoc('className') )
  
  // a formatting lens that goes from str[] to str
  lens.classList = 
    R.lens( R.compose( R.tail, R.split(' ')), R.join(' '))
  
  // essential lens operators
  lens.view = R.view
  lens.over = R.over
  lens.set = R.set 
  
  // common lens factory functions
  lens.prop = R.lensProp
  lens.path = R.lensPath
  lens.index = R.lensIndex
  
  // a formatting lens for focusing on JSON
  lens.json = R.lens(x => JSON.stringify(x, null, 2), JSON.parse)
  
  return {
    component
    , lens
    , State
    , compose: R.compose
    , pipe: R.pipe
    , Stream: flyd
  }
})()