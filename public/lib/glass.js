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
  
  function Lens(get,set){
    const lens = R.lens(get, set)
    lens.view = R.view(lens)
    lens.over = R.over(lens)
    lens.set = R.set(lens)
    return lens
  }
  
  function LensProp(property){
    return Lens( R.prop(property), R.assoc(property))
  }
  
  function LensPath(path){
    return Lens( R.path(property), R.assocPath(property))
  }
  
  function LensIndex(n){
    return Lens(R.nth(n), R.update(n))
  }
  
  function LensCompose(...lenses){
    const lens = R.compose(...lenses)
    lens.view = R.view(lens)
    lens.over = R.over(lens)
    lens.set = R.set(lens)
    return lens
  }
  
  // lenses to safely access vnode.attrs & vnode.className
  Lens.attrs = 
    R.lens( R.compose( R.or(R.__, {}), R.prop('attrs')), R.assoc('attrs'))
  
  Lens.className = 
    R.lens( R.propOr('', 'className'),  R.assoc('className') )
  
  // a formatting lens that goes from str[] to str
  Lens.classList = 
    R.lens( R.compose( R.tail, R.split(' ')), R.join(' '))
  
  // essential lens operators
  Lens.view = R.view
  Lens.over = R.over
  Lens.set = R.set 
  
  // common lens factory functions
  Lens.prop = LensProp
  Lens.path = LensPath
  Lens.index = LensIndex
  Lens.compose = LensCompose

  return {
    component
    , Lens: Lens
    , State
    , compose: R.compose
    , pipe: R.pipe
    , Stream: flyd
  }
})()