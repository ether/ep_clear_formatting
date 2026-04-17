![Demo](demo.gif) [![Backend Tests Status](https://github.com/ether/ep_clear_formatting/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/ether/ep_clear_formatting/actions/workflows/test-and-release.yml)

File menu plugin to clear authorship

## Installation

Install from the Etherpad admin UI (**Admin → Manage Plugins**,
search for `ep_clear_formatting` and click *Install*), or from the Etherpad
root directory:

```sh
pnpm run plugins install ep_clear_formatting
```

> ⚠️ Don't run `npm i` / `npm install` yourself from the Etherpad
> source tree — Etherpad tracks installed plugins through its own
> plugin-manager, and hand-editing `package.json` can leave the
> server unable to start.

After installing, restart Etherpad.
