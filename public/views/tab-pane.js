// A tabbed pane
//
// tabContent is a lens with all the tab metadata
// tabId is a lens of the current id
// state is the state stream we will write to
const tabPane = (tabContent, tabId, state) => {
  
  // Get the latest tabContent
  const tabs = state.view(tabContent)
  
  // use the selected tab, or select the first tab
  // if none are selected
  const currentTab = 
  
    [ state.view( tabId ) ] // get the id
      .map(
        // find the matching tab
        tabId => tabs.find(({id}) => tabId == id )
      )
      // if we found nothing, pick whichever tab
      // to get things started
        .concat( tabs.find(Boolean) )
        .find(Boolean)
      
  
  const tab = (t, i) => {
    return m('li'
      , { tabIndex: i
      // when a tab focuses emit a state object
      // with a new selected tab id
      , onfocus: () => state.set(tabId)(t.id) }
      , t.header
    )
  }

  return m('div'
    ,m('ul'
      ,tabs.map(tab)
      ,m('div', currentTab.content)
    )
  )
}