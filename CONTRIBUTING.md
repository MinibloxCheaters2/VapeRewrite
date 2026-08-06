# Contributing

To make a cheat for Miniblox, you need to understand how Miniblox works...

## Miniblox internals

- [Vite] (latest version, since they have Rolldown, and there's chunking/code splitting enabled because libraries like i.e. ThreeJS are in separate files, ESM)
- [ThreeJS] (r184, see the `canvas` with `data-engine="three.js r184"`)
- [TypeScript] (confirmed by enums being structured like IIFEs and way the too-many AI sloppenated comments in `index.html`)
- [NextJS] (?, app/client/**src/lib**/{...}.ts is a very common NextJS file structure)
- [React]
	- bundle code confirms it a LOT, and one AI sloppenated comment in `index.html` confirms this with a file path:
		> keep it roughly in sync with MODE_CONTENT in src/react/pages/Title/modeContent.ts
	- and the div element with `id="react"`
- [Unleash](https://github.com/Unleash/unleash) (feature flags)

[React]: https://react.dev/
[TypeScript]: https://www.typescriptlang.org/
[NextJS]: https://nextjs.org/
[Vite]: https://vite.dev/
[ThreeJS]: https://threejs.org/

## Project structure

```
├── .devcontainer/		# Dev container config
├── .forgejo/			# Forgejo CI workflows
├── .github/			# GitHub Actions workflows & templates
├── dist/			# Built output (vape-rewrite.user.js)
├── icons/			# GUI icons (categories, tabs, overlays, etc.)
│   ├── category/		#   Module category icons
│   ├── gui/			#   GUI element icons
│   ├── misc/			#   Misc UI icons
│   ├── notifications/		#   Notification icons
│   ├── overlays/		#   In-world overlay icons
│   ├── rainbow/		#   Rainbow-themed icons
│   ├── tabs/			#   Sidebar tab icons
│   └── targets/		#   Target display icons
├── scripts/
│   └── mirrors.ts		#   Mirror download script
├── src/			# # Source code
│   ├── event/			# Event bus system
│   │   ├── Bus.ts		#   Event bus implementation
│   │   ├── Cancelable.ts	#   Cancelable event wrapper
│   │   ├── Events.ts		#   Event type definitions
│   │   └── CancelableWrapper.ts
│   ├── features/		# Core cheat features
│   │   ├── binds/		#   Keybind system
│   │   ├── commands/		#   In-game command system (brigadier-based)
│   │   │   ├── api/		#     Brigadier dispatcher & manager
│   │   │   └── impl/		#     Command implementations
│   │   ├── config/		#   Settings & configuration system
│   │   │   ├── Configurable.ts	#     Configurable base class
│   │   │   ├── Settings.ts	#     Setting types
│   │   │   ├── SubModule.ts	#     Sub-module base
│   │   │   └── configs.ts	#     Config definitions
│   │   ├── hud/		#   HUD elements (on-screen overlays)
│   │   │   ├── api/		#     HUD base classes & manager
│   │   │   └── impl/		#     HUD implementations (array list, CPS, FPS, keystrokes, speed, target)
│   │   └── modules/		#   Modules (the actual cheat features)
│   │       ├── api/		#     Module base classes & managers
│   │       ├── impl/		#     Module implementations by category
│   │       │   ├── blatant/	#       Blatant modules (Blink, KillAura, Scaffold, Fly, Speed, etc.)
│   │       │   ├── combat/	#       Combat modules (AutoClicker, Criticals, Velocity, WTap, etc.)
│   │       │   ├── inventory/	#       Inventory modules (AutoArmor, InventoryManager)
│   │       │   ├── minigames/	#       Minigames modules (Breaker, ChestAura, MurderMystery, etc.)
│   │       │   ├── render/	#       Render modules (Chams, HudManager)
│   │       │   ├── utility/	#       Utility modules (AntiBan, Sprint, PingSpoof, etc.)
│   │       │   └── world/	#       World modules (NoFall, Timer, LiquidWalk)
│   │       └── legit/		#     Legit mode state machine
│   ├── hooks/			# Game event hooks (packet, tick, chat, connect, etc.)
│   ├── types/			# TypeScript type declarations (.d.ts)
│   ├── ui/			# React GUI (click GUI, HUD config, etc.)
│   ├── utils/			# Utility modules
│   │   ├── aiming/		#   Aiming & rotation utilities
│   │   ├── helpers/		#   Misc helpers (ant cheat detection, block handlers, etc.)
│   │   ├── input/		#   Input/key handling
│   │   ├── inventory/		#   Inventory management utilities
│   │   │   ├── armor/		#     Armor evaluation
│   │   │   └── cleanup/	#     Inventory cleanup planner
│   │   ├── logging/		#   Logger system
│   │   ├── mapping/		#   Packet/event name mappings
│   │   ├── math/		#   Vector & math utilities
│   │   ├── movement/		#   Movement prediction & correction
│   │   ├── network/		#   Packet queue, refs, WASM packet gen
│   │   ├── refs/		#   References to game objects (ThreeJS, Miniblox)
│   │   └── time/		#   Timing & wait utilities
│   ├── Bus.ts			# # Main event bus instance
│   ├── Client.ts		# # Client entry & lifecycle
│   ├── debugControls.ts	# # Debug key controls
│   ├── exposed.ts		# # Runtime debug helpers (inspect refs, values, etc.)
│   ├── index.ts		# # Entry point
│   ├── meta.js			# # UserScript metadata block
│   └── style.css		# # Global styles
├── wiki-assets/		# Wiki documentation images
├── minifyPlugin.ts		# Custom minification plugin for rolldown (built-in one removes comments required for user-scripts)
├── package.json		# Project metadata & dependencies
├── rolldown.config.ts	# Rolldown build config
└── tsconfig.json		# TypeScript configuration
```
