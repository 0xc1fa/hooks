# 🪝 hooks

[![codecov](https://codecov.io/gh/chanyatfu/hooks/graph/badge.svg?token=LXVFPBBP76)](https://codecov.io/gh/chanyatfu/hooks)

This repository contains a curated selection of React hooks that I personally used for enhanced project functionality. It is regularly updated with new tools.

## Available Hooks

- `useActivePointerState`: Tracks the active state of a pointer interaction within a specific DOM element, toggling between active and inactive based on pointer down, pointer up, and pointer cancel events.
- `useAudioSourceLoader`: Manages the setting and reloading of audio sources in a `HTMLAudioElement`.
- `useBoolean`: Manages a boolean state with initialization options and provides methods to set it to true, set it to false, or toggle its value.
- `useEventListener`: Adds event listeners to the window or any DOM element.
- `useIsomorphicLayoutEffect`: Uses useEffect server-side and useLayoutEffect client-side for optimal rendering.
- `useObjectURL`: Creates object URLs from a Blob or MediaSource and manages their lifecycle.
- `useSmoothTimeUpdate`: Ensures smooth and continuous dispatch of `timeupdate` events in an `HTMLAudioElement` or `HTMLVideoElement` by utilizing animation frames.
- `useStateHistory`: Manages a state value with a history, allowing the value to be updated, and provides methods to undo, redo, and navigate through the history of values.
