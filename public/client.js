function Main(){
  const G = Glass
  
  const state = G.State({ 
    count: 0
    ,tabId: 'Activity'
    ,tabContent: [
      { id: 'Activity', content: 'Me at the start of 2016, Me at the end of 2016', header: 'Activity' }
      ,{ id: 'Profile', content: 'You have 0 followers, but you\'re pretty cool', header: 'Profile' }
      ,{ id: 'Settings', content: 'Mute everyone!', header: 'Settings' }
    ]
  })
  
  
  var valueLens =  G.lens.prop('count')
  var numberLens = G.lens(R.identity, Number)

  var count = G.compose(valueLens, numberLens)
  var tabContent = G.lens.prop('tabContent')
  var tabId = G.lens.prop('tabId')
  
  var json = G.lens.json
  
  var editedState = G.State()
  flyd.on(editedState, state)
  
  return function(){
    return [
      counter(count, state)
      ,label(count, state)
      ,tabPane(tabContent, tabId, state)
      ,m('button', { onclick: () => state( editedState() ) }, 'Save Edits')
      ,m('pre[contenteditable]'
        , { oninput: m.withAttr('innerText', editedState.set(json) ) }
        , m.trust( editedState.view( json) ))
      
    ]
  }
}

m.mount(document.body, Glass.component(Main) )