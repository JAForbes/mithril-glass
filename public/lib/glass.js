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
  
  
  const Over = (get,set) => lens => f => set(R.over(lens, f, get() ))
  const View = (get,set) => lens => R.view(lens, get())
  const Set = (get,set) => lens => x => set(R.set(lens, x, get() ))
  
  
  function State(state, get, set){
  
    state.set = Set(get,set)
    state.view = View(get,set)
    state.over = Over(get,set)
    
    return state
  }
  
  function _Lens(lens){
    lens.view = R.view(lens)
    lens.over = R.over(lens)
    lens.set = R.set(lens)
    return lens
  }
  
  
  function item( equality){
    return Lens( 
      R.compose( R.find(equality) )
    ,function(demo, list){
      var i = R.findIndex(equality, list) 
      return Lens.index(i).set( demo, list )
    })
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
  Lens.item = item

  return {
    component
    , Lens: Lens
    , State
  }
})()