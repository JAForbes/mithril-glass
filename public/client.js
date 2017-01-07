function Main(){
  const { Lens, State } = Glass
  
  /*
    All the state in the app.  We are free to structure this however we want.
  */
  const state = State({ 
    count: 0
    ,tabId: 'Activity'
    ,tabContent: [
      { id: 'Activity', content: 'Me at the start of 2016, Me at the end of 2016', header: 'Activity' }
      ,{ id: 'Profile', content: 'You have 0 followers, but you\'re pretty cool', header: 'Profile' }
      ,{ id: 'Settings', content: 'Mute everyone!', header: 'Settings' }
    ]
  })
  

  // We also don't need to use the single state object pattern.  To prove it
  // we've got a 2nd state object `editedState` with its own lenses.  
  var editedState = State()
  flyd.on(editedState, state)
  
  // will use this builtin json lense to read/write our editedState tree to/from the page
  // a formatting lens for focusing on JSON
  var json = Lens(x => JSON.stringify(x, null, 2), JSON.parse)
  
  
  // Once you have chosen how to structure your state
  // you define special getter/setters functions that 
  // will read and write* to/from the state structure
  // we then pass these lenses into pure function views
  // along with our state stream
  // so our views can update the state stream with whatever the
  // lens returns
  //
  // * lenses don't actualy mutate the state object, they return
  // a copy of the state object with your updates included
  // we then have helper methods for pushing this state into the state stream

  // a lens that can read/write to a `count` property on any object
  var valueLens = Lens.prop('count')
  
  // a lens that converts string's to Number's on write
  var numberLens = Lens(R.identity, Number)

  // a composition of the above lenses
  // we now have a lense that reads/writes from the count property
  // but always transforms inputted values to Number's first
  var count = Lens.compose(valueLens, numberLens)
  
  // access the tabContent property of the state object
  var tabContent = Lens.prop('tabContent')
  // access the tabId property of the state object 
  var tabId = Lens.prop('tabId')
  
  
  // Extremely experimental notion:
  // Use lenses to theme vnodes after the fact!
  // these functions can be used to add these classNames to the vnode
  const blueGrower = tachyons.update(['blue', 'grow-large'])
  const redDimmerChildren = tachyons.updateChildren(['red', 'dim'])
  
  // Its recommended to avoid components in mithril-glass (except the top level)
  // Our entire app should simply use lenses to update state, leaving the views themselves pure
  return function(){
    return [
      // A counter with red text that dims on hover
      redDimmerChildren(counter(count, state))
      
      // a label, just grabs the current count
      ,label(count, state)
      
      // an unstyled tabPane
      ,tabPane(tabContent, tabId, state)
      
      // a button with blue text that grows on hover
      ,blueGrower(m('button', { onclick: () => state( editedState() ) }, 'Save Edits'))
      
      // an editable version of our state object
      ,m('pre[contenteditable]'
        , { oninput: m.withAttr('innerText', editedState.set(json) ) }
        , m.trust( editedState.view( json ) ))
      
    ]
  }
}

m.mount(document.body, G.component(Main) )