const counter = (count, state) => {
  
  // map over the count lens, passing a new state object into the stream
  const over = state.over(count)
  
  // Emit different state objects depending on which button is clicked.
  return m('div'
    ,m('button', { onclick: () => over( v => v + 1)  }, '+')
    ,m('button', { onclick: () => over( v => v - 1) }, '-')
  )
}