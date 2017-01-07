const counter = (count, state) => {
  
  
  const over = state.over(count)
  
  return m('div'
    ,m('button', { onclick: () => over( v => v + 1) }, '+')
    ,m('button', { onclick: () => over( v => v - 1) }, '-')
  )
}