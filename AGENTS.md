# AGENTS.md

`react-native-pdf-renderer` is a pure-native, zero-third-party-dependency React Native PDF renderer (Android + iOS). Public API: `<PdfRendererView />` component and `PdfRendererViewPropsType` type, plus a Jest mock at `src/mock.tsx` (`dist/mock` when published). It is a Fabric component (New Architecture) with an old-architecture fallback. Usage, prop tables, and limitations live in `README.md`; do not duplicate them here.

## Prerequisites

- Node >= 22.11 (`engines`), Yarn **1.x** (both lockfiles are `yarn.lock` v1).
- **Yarn 1 only:** both `package.json` files pin `"packageManager": "yarn@1.22.22"`, so Corepack selects Yarn 1 automatically. Check `yarn -v` prints `1.22.22` before installing; a Yarn 4 install silently migrates `yarn.lock` to Berry/PnP. Revert any unintended `yarn.lock` / `.pnp.cjs` / `.yarnrc.yml` / `.yarn/` changes.
- iOS (Sample): Ruby >= 2.6.10 (see `Sample/Gemfile`; works on 3.4), Bundler, CocoaPods >= 1.13 (not 1.15.0/1.15.1), Xcode. Library pod targets iOS 11.0 (`ReactNativePdfRenderer.podspec`); `Sample/` targets iOS 16.4 (required by Expo SDK 58).
- Android (Sample): JDK 17+ and Android SDK (library `minSdkVersion` default 24, `compileSdk` default 35; Sample uses compileSdk 37, Gradle 9.4.1, Expo SDK 58). `android/build.gradle` includes an AGP 9 built-in Kotlin guard.
- `peerDependencies.react-native` is `>=0.80` because `src/specs/RNPdfRendererViewNativeComponent.ts` imports `CodegenTypes` and `codegenNativeComponent` from `'react-native'`.

## Commands

Run from the repo root unless noted.

```sh
yarn install                       # root deps (Yarn 1)
node_modules/.bin/tsc              # build to dist/ (same as `yarn build`); delete compiled files in dist/ afterwards (keep dist/.gitkeep), never commit them
node_modules/.bin/tsc --noEmit     # typecheck only
node_modules/.bin/eslint src       # lint library (config: @react-native)

cd Sample
yarn install                       # Sample deps; installs the lib as a COPY from ../
node_modules/.bin/tsc --noEmit
node_modules/.bin/eslint .
node_modules/.bin/jest             # __tests__/App.test.tsx
yarn start                         # Metro
yarn android                       # builds Android (native build, slow)
bundle install && cd ios && bundle exec pod install && cd ..   # iOS pods
yarn ios
```

There are no unit tests for the library or the native code; native behavior is verified by running the Sample on a device/simulator. The Sample has New Architecture on (`newArchEnabled=true` in `Sample/android/gradle.properties`, `ENV['RCT_NEW_ARCH_ENABLED'] = '1'` in `Sample/ios/Podfile`).

## Repository map

- `src/index.ts`: public entry point, re-exporting `PdfRendererView` (default) and `PdfRendererViewPropsType`.
- `src/PdfRendererView.tsx`: merges prop defaults (`singlePage: false`, `distanceBetweenPages: 16`, `maxZoom: 5`, `maxPageResolution: 2048`), strips `borderRadius`, groups `{source, singlePage, maxZoom}` into `params`, and renders `RNPdfRendererView`.
- `src/specs/RNPdfRendererViewNativeComponent.ts`: Fabric native component spec (`NativeParams`, `NativeProps`, `codegenNativeComponent<NativeProps>('RNPdfRendererView')`); codegen input (`package.json#codegenConfig`: name `rnpdfrenderer_codegen`, Android package `com.github.douglasjunior.reactNativePdfRenderer`, iOS componentProvider `RNPdfRendererView` -> `RNPdfRendererComponentView`).
- `src/mock.tsx`: Jest mock component (`PdfRendererViewMock`), exposed as `react-native-pdf-renderer/dist/mock` when published.
- `android/src/main/java/com/github/douglasjunior/reactNativePdfRenderer/`: `PdfRendererPackage.java`, `PdfRendererViewManagerImpl.java` (shared prop handling and event builders), `modules/PdfRendererRecyclerView.java` (renders pages via `android.graphics.pdf.PdfRenderer` + `RecyclerView`), `modules/ObservableZoom.java`, `modules/ScaleTracker.java`.
- `android/src/newarch/.../modules/` and `android/src/oldarch/.../modules/`: two `PdfRendererViewManager.java` implementations; `android/build.gradle` selects one depending on `newArchEnabled`.
- `ios/ReactNativePdfRendererLibrary/`: `RNPDFView.h/.mm` (`PDFKit` `PDFView` wrapper, page break margins, zoom limits), `RNPdfRendererComponentView.h/.mm` (Fabric view under `#ifdef RCT_NEW_ARCH_ENABLED`), `RNPdfRendererModule.h/.m` (old-arch bridge, `#else` branch). `ReactNativePdfRenderer.podspec` globs `ios/ReactNativePdfRendererLibrary/**/*.{h,m,mm,swift}`; it calls `install_modules_dependencies` when `RCT_NEW_ARCH_ENABLED=1`, else depends on `React-Core`.
- `Sample/`: RN 0.88.1 + Expo SDK 58 demo app (`App.tsx`), consumes the lib via `"react-native-pdf-renderer": "file:../"`.
- `.github/workflows/publish.yml`: release automation. `.github/workflows/commit-authors.yml`: PR commit author check. `docs/`, `screenshots/`, `DEPENDENTS.md`: README assets; leave alone.

## Render & event flow

JS `PdfRendererView` merges defaults, strips `borderRadius` (`borderRadius: undefined`), and passes `params: { source, singlePage, maxZoom }`, `distanceBetweenPages`, `maxPageResolution`, and event handlers to `RNPdfRendererView`. Native strips `file://` (Android) or ensures `file://` (iOS) to open the local PDF file, emits `onPageChange` (`{ position, total }`), `onScaleChange` (`{ scale }`), and `onError` (`{}`). On iOS old architecture, `PdfRendererView` also passes `onRnPdfPageChange`, `onRnPdfScaleChange`, and `onRnPdfError` because iOS requires unique event names on legacy `RCTViewManager`.

## Invariants (do not break)

- Zero third-party native PDF dependencies: only Android `android.graphics.pdf.PdfRenderer` + `androidx.recyclerview:recyclerview` and Apple `PDFKit`.
- `source` expects a local file path/URI; never add network downloading to the library itself.
- `borderRadius` must stay stripped (`borderRadius: undefined`) in `src/PdfRendererView.tsx` to avoid iOS crashes (#1).
- `RNPdfRendererComponentView` returns `NO` from `+(BOOL)shouldBeRecycled` so Fabric does not recycle stale PDF views across mounts.
- Keep `onRnPdfPageChange`, `onRnPdfScaleChange`, and `onRnPdfError` in `src/PdfRendererView.tsx` and `ios/ReactNativePdfRendererLibrary/RNPdfRendererModule.m` for iOS old-architecture compatibility.
- Keep `src/mock.tsx` compatible with `PdfRendererViewPropsType` (`dist/mock` documented in `README.md`).
- Keep `"jsx": "react"` in `tsconfig.json` so `tsc` emits `.js` (not `.jsx`) files in `dist/`.
- Keep `package.json` `main` and `react-native` pointing to `src`, and preserve `dist/.gitkeep`.
- Keep the AGP 9 built-in Kotlin guard (`if (project.extensions.findByName('kotlin') == null)`) in `android/build.gradle`.

## Recipes

Add a prop or event (backward compatible):
1. Update `NativeProps` / `NativeParams` in `src/specs/RNPdfRendererViewNativeComponent.ts` and `PdfRendererViewPropsType` / `PdfRendererView.tsx` in `src/PdfRendererView.tsx`.
2. Ensure `src/mock.tsx` remains type-compatible.
3. Android: update `PdfRendererViewManagerImpl.java`, `modules/PdfRendererRecyclerView.java`, and both `src/newarch` and `src/oldarch` `PdfRendererViewManager.java`.
4. iOS: update `RNPDFView.h/.mm`, `RNPdfRendererComponentView.mm` (Fabric), and `RNPdfRendererModule.m` (old arch).
5. Update `README.md` API Reference table.
6. Validate in `Sample/` on both platforms with New Architecture on (re-run `pod install` / Gradle build to trigger codegen).

Test a library change in the Sample:
- The Sample installs the lib as a copy, so edits to `src/`, `android/` or `ios/` are not picked up automatically. From `Sample/`, run `./install.sh` (wipes `node_modules`, `ios/Pods`, and root `node_modules`, reinstalls, strips the nested `Sample/` and `.git` from the copy, runs `npx -y pod-install`), then restart Metro with `yarn start --reset-cache`. `install.sh` uses `yarn`, so confirm Yarn 1 first.

## Boundaries

Ask a human before:
- changing the public API, the spec, prop defaults, or event payloads;
- bumping `peerDependencies`, `engines`, minimum iOS/Android versions, or RN/React/TypeScript major versions;
- touching `.github/workflows/publish.yml` or anything about releasing.

Never:
- publish manually (`npm publish`, `yarn publish`) or restore `scripts/publish.js` (removed). Publishing is automatic: a GitHub Release with a semver tag (`1.2.3` or `v1.2.3`) triggers `.github/workflows/publish.yml`, which runs `yarn install --frozen-lockfile` and `yarn build`, sets `main`/`types` to `dist` only in the workflow workspace, publishes via npm Trusted Publishing (OIDC), uses dist-tag `next` for pre-releases, and the release bot commits `chore(release): <version> [skip ci]` back to the default branch.
- edit `version` in `package.json` or point `main`/`types` to `dist` in the repo; the workflow owns both;
- commit `dist/*` (except `dist/.gitkeep`), `ios/Pods`, `vendor/bundle`, or Yarn Berry artifacts;
- edit generated/lock files by hand (`yarn.lock`, `Podfile.lock`) or run `yarn install` with Yarn 4;
- add dependencies to `dependencies` (the lib has none; keep it that way);
- run Android emulators or iOS simulators headless (`-no-window` or `xcrun simctl boot` without opening the UI) unless the user explicitly asks; always open the visible emulator/simulator window (e.g., windowed `emulator` on Android and Xcode `DeviceHub.app` / `Simulator.app` on iOS).

## Conventions

- Language: English everywhere (code, comments, commits, docs).
- Commits: Conventional Commits: `feat(android): ...`, `fix(ios): ...`, `fix: ...`, `docs: ...`, `chore(deps): ...`. The release bot owns `chore(release)`.
- Formatting: Prettier 2.8.8 (`.prettierrc.js`: single quotes, trailing commas `all`, `arrowParens: 'avoid'`); ESLint `@react-native`. Fix lint on files you touch; do not reformat unrelated lines.
- License: every `.ts`, `.tsx`, `.java`, `.h`, `.m`, `.mm` file starts with the MIT header (Douglas Nassif Roma Junior). Copy it from an existing file into new files.
- Java source level is 1.8; keep Android code compatible with `minSdk` 24.

## Definition of done

- [ ] `node_modules/.bin/tsc` and `node_modules/.bin/eslint src` pass at the root; compiled files in `dist/` removed (keep `dist/.gitkeep`).
- [ ] In `Sample/`: `node_modules/.bin/tsc --noEmit`, `node_modules/.bin/eslint .` and `node_modules/.bin/jest` pass (only after reinstalling the lib copy if `src/` changed).
- [ ] If native or spec code changed: Sample built and exercised on Android and iOS.
- [ ] `README.md` updated for any public change (props, events, requirements).
- [ ] `git status` shows no compiled files in `dist/`, no `yarn.lock` churn from Yarn 4, no version edits.
- [ ] Commit message follows Conventional Commits.
