var feed = (function(){
  
  function feedItem(){
    
  }
  
  function feed(items, header, fetchList, state){
    var totalHeight = state.view(items)
      .map( () => 0 )
      .reduce( R.add, 0 )
  
    var scrollY = 0
    var offsetTop = 0
    
    return m('div'
      ,{
       onscroll: fetchList
      }
      , state.view(header)
      , m('ul'
        ,state.view(items)
          .map(feedItem)
          .map( v => m('li') )
      )
    
    )
  }
  
  return feed
}())

feed.children = G.Lens.prop('children')
feed.header = G.Lens.compose( 
  feed.children
  ,G.Lens.index(0)
)
feed.ul = G.Lens.compose( 
  feed.children
  ,G.Lens.index(1)
)
feed.li = G.Lens.compose(
  feed.ul
  ,feed.children
)
feed.theme = {}


feed.theme.J2C = function(){
  return function(vnode){
    
    return feed.children.over(
      R.concat([m('style', String(feed.theme.J2C.sheet))])
      , vnode
    )
  }
}

feed.theme.J2C.sheet = j2c.sheet({
  '.header': {
    fontSize: '10em'
  }
})