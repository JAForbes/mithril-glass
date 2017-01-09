// A tabbed pane
//
// tabContent is a lens with all the tab metadata
// tabId is a lens of the current id
// state is the state stream we will write to
const tabPane = (tabContent, tabId, initialTabIndex, state) => {
  
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
      , { tabIndex: initialTabIndex+i
      // when a tab focuses emit a state object
      // with a new selected tab id
      , onfocus: () => state.set(tabId)(t.id)
      , selected: currentTab == t
      }
      , t.header

    )
  }

  return m('div'
    ,m('ul'
      ,tabs.map(tab)
    )
    ,m('div', currentTab.content)
  )
}


tabPane.ul = 
  G.Lens.compose( G.Lens.prop('children'), G.Lens.index(0) )
tabPane.li =
  G.Lens.compose( tabPane.ul, G.Lens.prop('children') ) 
tabPane.div = 
  G.Lens.compose( G.Lens.prop('children'), G.Lens.index(1) )
  
tabPane.selected =
  G.Lens.compose( 
    tabPane.li
    , G.Lens(
      R.find(R.path(['attrs', 'selected']))
      ,(v, list) => {
        var i = R.findIndex(R.path(['attrs', 'selected']), list)
        return G.Lens.index(i).set( v, list )
      }
    ) 
  )
  
tabPane.theme = {}

tabPane.theme.Default = function(){
  
  
  var t = tachyons.lens
  var ul = tabPane.ul
  var li = tabPane.li
  var x = tabPane.selected
  var c = G.Lens.compose
  var div = tabPane.div
  
  var selected = c(x, t).over(
    R.concat(['ba', 'bb-0', 'br2', 'br--top', 'outline-0'])
  )
  
  var listReset = c(ul, t).set(['list', 'di', 'pl0'])
  var container = t.set(['measure', 'pa1'])
  var content = c(div, t).set(['ba', 'h4', 'pa2'])
  
  tabListItems = G.Lens.setAll(t.set(['di', 'ph2']),li)
    
  var theme = R.compose(
    content
    ,container
    ,listReset
    ,selected
    ,tabListItems
  )
  
  return theme
  
}