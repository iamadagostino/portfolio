This folder contains a small runtime patch applied to a third-party library to
work around a React 19 / `@react-three/drei` issue where `ScrollControls`
repeatedly calls `ReactDOM.createRoot` on the same DOM container. Repeated
calls cause React to throw an error during dev/hydration:

    You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before.

## What we changed

- File patched (installed package):
  `node_modules/.pnpm/.../node_modules/@react-three/drei/web/ScrollControls.js`

- Change summary: Replaced the one-line call:

      const root = React.useMemo(() => ReactDOM.createRoot(state.fixed), [state.fixed]);

  with a small cached-root implementation that stores the created root on the
  DOM element (`state.fixed.__r3_root`) and reuses it when present. This
  prevents duplicate `createRoot` calls while keeping `ScrollControls` working
  as intended.

## Why this fix

`ScrollControls` creates an element (`state.fixed`) and calls
`ReactDOM.createRoot(state.fixed)` to render HTML content for the scrollable
areas. When the same container is passed to `createRoot` multiple times (for
example across remounts or HMR), React 19 throws. Caching the root on the
element ensures we only create it once and reuse it afterwards.

## Persisting the patch (recommended)

We recommend using `patch-package` so the fix is automatically re-applied on
installs.

1. Install dev deps (if not already):

```bash
pnpm add -D patch-package postinstall-postinstall
```

2. After you have the local change in `node_modules` (this repo already has
   the change), run:

```bash
npx patch-package @react-three/drei
```

3. Commit the generated file under `patches/` (patch-package created it) and
   commit the `postinstall` script in `package.json` if it's not already set.

This project already includes `patches/@react-three+drei+10.7.6.patch` and
the `postinstall`/`prepare` scripts are configured to run `patch-package`.

## Manual apply (editor)

If you prefer to patch manually (editor), follow these steps.

1. Backup the original file (example path - adjust for your installation):

```bash
cp node_modules/.pnpm/@react-three+drei@10.7.6_*/node_modules/@react-three/drei/web/ScrollControls.js \
	node_modules/.pnpm/@react-three+drei@10.7.6_*/node_modules/@react-three/drei/web/ScrollControls.js.bak
```

2. Open the file in your editor and locate the line:

```js
const root = React.useMemo(() => ReactDOM.createRoot(state.fixed), [state.fixed]);
```

3. Replace that single line with the **exact** block below:

```js
// Cache a root instance on the fixed DOM element to avoid calling
// ReactDOM.createRoot multiple times on the same container which
// triggers an error in React 19. We store the created root in a
// non-enumerable property on the element so repeated mounts or
// remounts re-use the same root instance.
const root = React.useMemo(() => {
  try {
    // If a root was previously created on this element, reuse it.
    if (state.fixed && state.fixed.__r3_root) return state.fixed.__r3_root;
    const r = ReactDOM.createRoot(state.fixed);
    try {
      Object.defineProperty(state.fixed, '__r3_root', {
        value: r,
        configurable: true,
        writable: false,
      });
    } catch (e) {
      // ignore if we can't define property (very unlikely)
      state.fixed.__r3_root = r;
    }
    return r;
  } catch (e) {
    // Fallback: if createRoot fails for any reason, rethrow so devs see it.
    throw e;
  }
}, [state.fixed]);
```

4. Save file and restart the dev server.

## Manual apply (command-line)

If you prefer a CLI approach, create a backup first. Because in-place sed/perl
replacements can be brittle (escaping, varying paths), prefer the editor
method. If you must use a one-liner, test on a copy first.

## Notes & caveats

- The patch attaches a property `__r3_root` to the DOM element. This is a
  private key unlikely to conflict with other code. If you want even stronger
  isolation we can switch to using a Symbol on the element.
- The proper long-term fix is to address this in `@react-three/drei` upstream.
  I can prepare a minimal PR that reproduces and proposes this safe caching if
  you'd like.

If you'd like, I can:

- produce a cleaned `patch-package` patch file for commit (if anything missing),
- prepare an upstream PR for `@react-three/drei`, or
- revert this change and try a different runtime workaround.

Thank you — let me know which follow-up you prefer.
