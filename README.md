Glass
=====

Exploring using Lenses for data flow and theming.

What
----

- Zero components, everything is pure functions, no instance state
- Explicit data flow

Why
---

- [ ] Stale data problem - 0 component architecture
- [ ] Separation of concerns
- [ ] Redux/Elm Action naming problem
- [ ] Ref problem
- [ ] Unnecessary verbosity due to move from view -> instance based component

Architecture
------------

- Top level route holds state, either as a single state object or not
- Top level generates lenses for focusing on particular pieces of data
- Pass lenses and state store into views
- Views access state, modifications emit new states down a state stream
- Views do not know anything about the state object, complete SOC
- Plugins for theming by transforming vnode tree via lenses
  - tachyons
  - inline styles
  - j2c
  - whatever

Todo
----

- [X] views/tab-pane
- [X] views/counter
- [ ] views/filtered-list
- [ ] views/text-input
- [ ] views/slider
- [ ] views/pane
- [ ] views/rgb-slider
- [X] Lens query theming
- [X] Tachyons theming lens
- [ ] jquery inspired style lens generator for generating themes 
  (but not for userland)