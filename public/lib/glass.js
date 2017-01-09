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
  
  function _Lens(lens){
    lens.view = R.view(lens)
    lens.over = R.over(lens)
    lens.set = R.set(lens)
    return lens
  }
  
  const Lens = R.compose(_Lens, R.lens)
  // lenses to safely access vnode.attrs & vnode.className
  Lens.attrs = 
    R.lens( R.compose( R.or(R.__, {}), R.prop('attrs')), R.assoc('attrs'))
  
  Lens.className = 
    R.lens( R.propOr('', 'className'),  R.assoc('className') )
  
  // a formatting lens that goes from str[] to str
  Lens.classList = 
    R.lens( R.compose(R.reject(R.isEmpty), R.split(' ')), R.join(' '))
    
  
  Lens.setAll = (each, parentLens) =>
    R.converge( 
      parentLens.set
      ,[R.pipe( parentLens.view, R.map( each ))
      , R.identity
      ]
    )
    
  
  // essential lens operators
  Lens.view = R.view
  Lens.over = R.over
  Lens.set = R.set 
  
  // common lens factory functions
  Lens.prop = R.compose(_Lens, R.lensProp)
  Lens.path = R.compose(_Lens, R.lensPath)
  Lens.index = R.compose(_Lens, R.lensIndex)
  Lens.compose = R.compose(_Lens,R.compose)
  Lens.iso = R.compose(_Lens, ramdaLens.iso)
  Lens.iso.from = ramdaLens.from

  return {
    component
    , Lens: Lens
    , State
  }
})()