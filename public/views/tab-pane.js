const tabPane = (tabContent, tabId, state) => {
  
  const tabs = state.view(tabContent)
  
  const currentTab = 
    [ state.view( tabId ) ]
      .map(
        tabId => tabs.find(({id}) => tabId == id )
      )
      .concat( tabs.find(Boolean) )
      .find(Boolean)
      
  
  const tab = (t, i) => {
    const attrs = { tabIndex: i, onfocus: () => state.set(tabId)(t.id) }
    return m('li', attrs, t.header)
  }

  return m('div'
      ,m('ul'
        ,tabs.map(tab)
        ,m('div'
          ,currentTab.content
        )
      )
      
  )
}