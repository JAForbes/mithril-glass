// Simply extract a message from the state object
// note, this view doesn't know anything about the state object
// its completely decoupled
const label = (message, state) =>
  m('p', state.view(message) )