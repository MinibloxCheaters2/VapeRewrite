# Project utils organization

This directory contains small utility modules used across the project.

## Purpose

- Provide a single barrel import at `src/utils` to make imports cleaner.

## How to use

Import grouped utilities from the barrel:

```ts
import { Logger, vec, wait } from "src/utils";
```

## Notes & next steps

- The barrel (`index.ts`) re-exports the most commonly used modules without
  moving files.
- If you want to physically reorganize files into subfolders (e.g. `math/`,
  `net/`), I can move files and update imports across the repo.
- Consider adding more focused barrel files for subfolders if you split the
  directory.

## Files currently exposed by the barrel

- vec, radians, random, wait
- Logger, loggers
- key
- names, mappings
- movement, target, ServerFallDistance
- packetQueueManager, packetRefs, PacketUtil, posPacket
- refs, patchHelper, remapProxy, cachedResourceURL, initOrR, blockHandlers
- aiming/rotate, aiming/rotation
