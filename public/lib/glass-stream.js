// Creates a state stream and attaches some bound lens methods to the instance
function StateStream(...args){
  const state = flyd.stream(...args)
  
  return Glass.State(
    state
    ,() => state()
    ,(o) => state(o)
  )
}