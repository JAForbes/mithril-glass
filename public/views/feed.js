(() => {
  function feedHeader(){
  
  }
  function feedItem(){
    
  }
  
  function feed(items, itemHeight, state){
    var totalHeight = state.view(items)
      .map( itemHeight.view )
      .reduce( R.add, 0 )
  
    var scrollY = 0
    var offsetTop = 0
    
    return m('div'
      ,{ offsetTop
      , scrollY
      , onscroll: (e) => {}
      }
      , state.view(items)
        .map(
          item => feedItem()  
        )
    
    )
  }
  
  return feed
}())