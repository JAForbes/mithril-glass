function Main(){
  const { Lens } = Glass
  
  // we can't stringify functions so we keep them outside the store
  // we're only supporting JSON.stringify so we can edit the state tree in the demo live
  // the architecture itself has no problem with functions in trees
  const views = {
    counterDemo
    ,tabPaneDemo
    ,stateTreeDemo
    ,feedDemo
  }
  
  // for defining read only lenses
  const K = (_, s) => s
  
  // This lens transforms the tree so the table view can get some static content
  // And so we can stringify our tree.
  var demos = 
    G.Lens.compose( 
      Lens.prop('demos') // grab .demos from a state tree
      
      // For each content key, replace it with views[key]()
      ,Lens(
        R.map( (d) => R.merge(d, { content: views[d.content]() }))
        ,K
      )
    )
    
  // grabs a demoId property from a state object
  var demoId = Lens.prop('demoId')
  
  
  /*
    All the state in the app.  We are free to structure this however we want.
    
    We create lenses to query this structure, and we pass those lenses around the app
    so views can read and produce new states.
  */
  
  const state = StateStream({ 
    count: 0
    ,tabId: 'Activity'
    ,tabContent: [
      { id: 'Activity', content: 'Me at the start of 2016, Me at the end of 2016', header: 'Activity' }
      ,{ id: 'Profile', content: 'You have 0 followers, but you\'re pretty cool', header: 'Profile' }
      ,{ id: 'Settings', content: 'Mute everyone!', header: 'Settings' }
    ]
    ,demoId: 'Feed'
    ,demos: [
      { id: 'Feed', content: 'feedDemo', header: 'Feed' }
      ,{ id: 'Counter', content: 'counterDemo', header: 'Counter' }
      ,{ id: 'Tab Pane', content: 'tabPaneDemo', header: 'Tab Pane' }
      ,{ id: 'State Tree', content: 'stateTreeDemo', header: 'State Tree' }
    ]
    ,feed: {
      items: []
      ,header: 'Popular Sub Reddits'
    }
  })
  
  var feedLens = G.Lens.prop('feed')
  var feedItems = G.Lens.compose(feedLens, G.Lens.prop('items'))
  var feedHeader = G.Lens.compose(feedLens, G.Lens.prop('header'))
  
  // We also don't need to use the single state object pattern.  To prove it
  // we've got a 2nd state object `editedState` with its own lenses.
  // We'll edit this live in the demo page as a content editable JSON element
  var editedState = StateStream()
  flyd.on(editedState, state)
  
  // we'll use this json lense to read/write our editedState tree to/from the page
  // a formatting lens for focusing on JSON
  // an iso is a Lens that can losslessly transform data in 2 directions
  // Techincally this isn't isomorphic because stringify is lossy (e.g. functions)
  var json = Lens.iso(x => JSON.stringify(x, null, 2), JSON.parse)
  
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

  var count = Lens.prop('count')
  
  // access the tabContent property of the state object
  var tabContent = Lens.prop('tabContent')
  // access the tabId property of the state object 
  var tabId = Lens.prop('tabId')
  
  var tabPaneTacyhons = R.compose(tabPane.theme.Default(), tabPane)
  var tabPaneInline = R.compose(tabPane.theme.Inline(), tabPane)
  
  // Use lenses to theme vnodes after the fact!
  // these functions can be used to add these classNames to the vnode
  const blueGrower = tachyons.lens.set(['blue', 'grow-large'])
  
  const feedJ2C = R.compose(feed.theme.J2C(), feed)
  
  function feedDemo(){
    return feedJ2C(feedItems, feedHeader, function(){
      console.log('scroll')
    }, state)  
  }
  
  function counterDemo(){
    return [ counter(count, state)
    , label(count, state)
    ]
  }
  
  function tabPaneDemo(){
    return tabPaneTacyhons(tabContent, tabId, 7, state)
  }
  
  function stateTreeDemo(){
    return [
      // a button with blue text that grows on hover
      blueGrower(m('button', { onclick: () => state( R.merge( state(), editedState() )) }, 'Save Edits'))
      
      // an editable version of our state object
      ,m('pre[contenteditable]'
        , { oninput: m.withAttr('innerText', editedState.set(json) ) }
        , m.trust( editedState.view( json ) ))
    ]
  }
  
  // Its recommended to avoid components in mithril-glass (except the top level)
  // Our entire app should simply use lenses to update state, leaving the views themselves pure
  return function(){
    return tabPaneInline(demos, demoId, 0, state)
  }
}

m.mount(document.body, G.component(Main) )