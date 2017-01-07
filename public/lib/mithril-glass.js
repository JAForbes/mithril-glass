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
  
  
  var attrs = R.lensProp('attrs')
  var className = R.lens( R.propOr([], 'className'),  R.assoc('className') )
  var classList = R.compose(attrs, className, R.lens(R.split(' '), R.join(' ')) )
  
  function State(...args){
    
    const state = flyd.stream(...args)
    
    state.set = Set(state)
    state.view = View(state)
    state.over = Over(state)
    
    return state
  }
  
  const lens = R.lens
  
  lens.Over = Over
  lens.View = View
  lens.Set = Set
  lens.attrs = attrs
  lens.className = className
  lens.classList = classList
  lens.view = R.view
  lens.over = R.over
  lens.set = R.set 
  lens.prop = R.lensProp
  lens.path = R.lensPath
  lens.index = R.lensIndex
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