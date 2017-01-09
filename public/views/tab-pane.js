/**
 * Lens State TabContent ->  Lens State String -> Number -> GlassState State -> VNode
 * 
 * A tabbed pane
 * =============
 * tabContent is a lens with all the tab metadata
 * tabId is a lens of the current id
 * tabIndex is 
 * state is the state stream we will write to
*/

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

/**
 * Expose some lens for querying key parts of the virtual dom
 * of this view.
 * 
 * By exposing these queries, users can avoid breaking their styles
 * when the internal dom structure changes, and developers can
 * freely modify their dom structure as long as these queries stay in sync.
 * 
 * Separating themes and the specific vnode struture also opens up the
 * possibility of supporting multiple hyperscript structures.
*/

tabPane.ul = 
  G.Lens.compose( G.Lens.prop('children'), G.Lens.index(0) )
tabPane.li =
  G.Lens.compose( tabPane.ul, G.Lens.prop('children') ) 
tabPane.div = 
  G.Lens.compose( G.Lens.prop('children'), G.Lens.index(1) )
  
/**
 * Finds the currently selected tab
 * Allows you to pass in a new selected tab and it will
 * update in place.
*/
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


/**
 * A theme is a function that takes a vnode and returns a new vnode
 * 
 * By using lenss we can query parts of the vnode and modify it purely.
 * Because each query returns a new vnode we can chain them together via
 * compose.
 * 
 * You don't need to theme components this way.  In essence all lenses do
 * is theme data in one way or another, so their a perfect match.
 * 
 */
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

tabPane.theme.Inline = function(){
  
  var ul = tabPane.ul
  var li = tabPane.li
  var x = tabPane.selected
  var c = G.Lens.compose
  var div = tabPane.div
  
  var style = G.Lens(R.propOr({}, 'style'), R.assoc('style'))
  var css = c( G.Lens.attrs, style)
  
  var inlineTabs = G.Lens.setAll(
    css.over(R.merge({ 
      paddingLeft: '0.2em'
      ,paddingRight: '0.2em'
      ,display: 'inline'
    }))
    ,li
  )
  
  var listReset = c( ul, css ).over(
    R.merge({ 
      listStyle: 'none' 
      ,paddingLeft: '0em'
      ,paddingBottom: '0.5em'
    })
  )
  
  var containerPadding = css.over(
    R.merge({ padding: '1em' })  
  )
  
  var selectedIndicator = c(x, css).over(
    R.merge({
      display: 'inline'
      ,outline: '0px'
      ,borderBottom: 'solid 1px black'
    })
  )
  
  var theme = R.compose(
    listReset
    ,inlineTabs
    ,selectedIndicator
    ,containerPadding
  )
  
  return theme
}