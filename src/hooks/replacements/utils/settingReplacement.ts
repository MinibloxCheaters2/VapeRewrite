import { Shift, type SingleReplacement } from "../../replacementTypes";

export const SHOW_USERNAMES_WITH_HIDDEN_CHARS: SingleReplacement = [
	/function\s+stripCrazyGamesSuffix\s*\(\w+\)\s*\{[\s\S]*?return[\s\S]*?\}/g,
	{
		replacement: `function stripCrazyGamesSuffix(m) { return m; }`,
		shift: Shift.REPLACE,
	},
];

const optionsReplacement = `var _n;
let Options$1 = (_n = class {
	static reset() {
		this.resetVideo(), this.resetControls(), this.sound.reset()
	}
	static resetVideo() {
		this.fov.reset(), this.resolution.reset(), this.renderDistance.reset(), this.particles.reset(), this.stars.reset(), this.dynamicFOV.reset(), this.textureMaterial.reset(), this.fastRender.reset(), this.autoFullscreen.reset(), this.clouds.reset(), this.cullChunks.reset(), this.aura.reset(), this.trail.reset(), this.auraAll.reset(), this.trailAll.reset()
	}
	static resetControls() {
		this.mouseSensitivity.reset(), this.scrollSensitivity.reset(), this.touchSensitivity.reset(), this.invertScroll.reset()
	}
}, I(_n, "debug", new Option("Debug", !1)), I(_n, "fov", new SliderOption("FOV", 50, 150, 85)), I(_n, "mouseSensitivity", new SliderOption("Mouse Sensitivity", 1, 300, 100)), I(_n, "scrollSensitivity", new SliderOption("Scroll Sensitivity", 1, 300, 200)), I(_n, "touchSensitivity", new SliderOption("Touch Sensitivity", 1, 300, 100)), I(_n, "renderDistance", new SliderOption("Render Distance ", 2, 10, 3)), I(_n, "particles", new SliderOption("Particles", 0, 100, 20)), I(_n, "resolution", new SliderOption("Resolution Scale", 10, 200, 100)), I(_n, "invertScroll", new Option("Invert Scroll", !1)), I(_n, "autoJump", new Option("Auto Jump", !0)), I(_n, "cullChunks", new Option("Cull Chunks", !0)), I(_n, "clouds", new Option("Clouds", !1)), I(_n, "fastRender", new Option("Fast Render", !0)), I(_n, "fastEntities", new Option("Fast Entities", !1)), I(_n, "dynamicFOV", new Option("Dynamic FOV", !0)), I(_n, "autoFullscreen", new Option("Auto Fullscreen ", !1)), I(_n, "stars", new Option("Stars", !0)), I(_n, "fog", new Option("Fog", !0)), I(_n, "bobbing", new Option("Bobbing", !0)), I(_n, "textureMaterial", new SelectOption$1("Material Texture", ["Basic", "Lambert", "Phong", "Standard", "Toon"], "Lambert")), I(_n, "aura", new SelectOption$1("Aura", ["None", "Rain", "Tornado", "Halo", "Planet", "Inferno"], "None")), I(_n, "trail", new SelectOption$1("Trail", ["None", "Flame", "Rain", "Heart"], "None")), I(_n, "auraAll", new Option("Aura To All Players", !1)), I(_n, "trailAll", new Option("Trail To All Players", !1)), I(_n, "sound", new SoundOptions), I(_n, "cinematicMode", !1), I(_n, "streamerMode", new Option("Streamer Mode", !1, !1)), I(_n, "enableZoom", new Option("Enable Zoom", !1, !1)), I(_n, "zoomLevel", new SliderOption("Zoom Level", 1, 15, 3, 1, !1)), I(_n, "f1Mode", new Option("F1 Mode", !1, !1)), _n);`;

const auraReplacements = `}), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options$1.fog
		}), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options$1.cullChunks
		}), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options$1.clouds
    }), jsxRuntimeExports.jsx(SelectButton, {
			option: Options$1.aura
    }), jsxRuntimeExports.jsx(SelectButton, {
			option: Options$1.trail
    }), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options$1.auraAll
		}), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options$1.trailAll`;

export const EXTRA_OPTIONS: SingleReplacement = [
	/var\s+_+\w+\s*;\s*let\s+Options\$1\s*=\s*\(_+\w+\s*=\s*class\s*\{[\s\S]*?\}\s*,[\s\S]*?\)\s*;/g,
	{
		replacement: optionsReplacement,
		shift: Shift.REPLACE,
	},
];

export const YOU_HAVE_AURA_MODE: SingleReplacement = [
	/}\s*\)\s*,\s*jsxRuntimeExports\.jsx\s*\(\s*ToggleButton\s*,\s*\{\s*option:\s*Options\$1\.fog/g,
	{
		replacement: auraReplacements,
		shift: Shift.REPLACE,
	},
];

export const ENABLE_CHUNK_CULLING_SETTING: SingleReplacement = [
	/CHUNK_UNLOADS_PER_TICK\s*\)/g,
	{
		replacement: "Options$1.cullChunks.value?CHUNK_UNLOADS_PER_TICK:0)",
		shift: Shift.REPLACE,
	},
];

export const SHOW_CLOUDS_SETTING: SingleReplacement = [
	/I\s*\(\s*this\s*,\s*["']generate["']\s*\)\s*;\s*I\s*\(\s*this\s*,\s*["']showClouds["']\s*\)\s*;/g,
	{
		replacement: `I(this, "generate",Options$1.clouds.value);
		I(this, "showClouds",Options$1.clouds.value);`,
		shift: Shift.REPLACE,
	},
];

export const SHOW_CLOUDS_UPDATE_SETTING: SingleReplacement = [
	/this\.generate\s*==\s*this\.showClouds/g,
	{
		replacement: `this.showClouds = Options$1.clouds.value; this.generate == this.showClouds`,
		shift: Shift.REPLACE,
	},
];

export const GENERATE_CLOUDS_REPLACEMENT: SingleReplacement = [
	/generateClouds\s*\(\s*\w+\s*\)\s*\{\s*for[\s\S]*?;/g,
	{
		replacement: `generateClouds(u) {
		for (const h of this.clouds) this.gameScene.scene.remove(h), h.visible = Options$1.clouds.value;`,
		shift: Shift.REPLACE,
	},
];

const trailAuraReplacement = `class EffectsManager {
	constructor(u, h) {
		I(this, "activeEffects");
		this.world = u, this.player = h, this.activeEffects = []
	}
	addEffect(u) {
		this.activeEffects.push(u)
	}
	removeEffect(u) {
		this.activeEffects = this.activeEffects.filter(h => h !== u)
	}
	getActiveEffects() {
		return this.activeEffects
	}
	update() {
		var u, h;
		(u = Options$1.aura.value != "None" && (Options$1.auraAll.value || this.world.game.player.socketId == this.player.profile.uuid)? AURAS[Options$1.aura.value.toLowerCase()]: AURAS[this.player.profile.effects.aura]) == null || u.effect.update(this.world, this.player), (h = Options$1.trail.value != "None" && (Options$1.trailAll.value || this.world.game.player.socketId == this.player.profile.uuid)? TRAILS[Options$1.trail.value.toLowerCase()]: TRAILS[this.player.profile.effects.trail]) == null || h.effect.update(this.world, this.player)
	}
}`;

export const TRAIL_AURA_REPLACEMENT: SingleReplacement = [
	/class\sEffectsManager\s*\{[\s\S]*?\}\s*\}/g,
	{
		replacement: trailAuraReplacement,
		shift: Shift.REPLACE,
	},
];

const browsePlanetsModalReplacement = `BrowsePlanetsModal = m => {
  const {
    servers: u,
    profile: h,
    refreshServers: p
  } = reactExports.useContext(AccountContext);

  const [g, y] = reactExports.useState("");
  const [x, S] = reactExports.useState(["All"]);
  const [sortBy, setSortBy] = reactExports.useState("Players");
  const b = useDebounce(g, 500);

  let v =
    (u == null
      ? []
      : u
          .filter(A => A.category === "planets")
          .sort((A, R) => {
            if (sortBy === "Time") {
              return (R.timeAllocated ?? 0) - (A.timeAllocated ?? 0);
            }
            return R.playerCount - A.playerCount;
          })) ?? [];

  const w = v.length === 0;

  (!h || !h.rank) && (v = v.filter(A => A.playerCount < A.maxPlayers));

  const k = () => {
    y("");
    m.onClose();
  };

  const E = A => {
    S(R =>
      A === "All"
        ? R.includes("All")
          ? []
          : ["All"]
        : R.includes(A)
        ? R.filter(L => L !== A)
        : [...R.filter(L => L !== "All"), A]
    );
  };

  const T = v.filter(A => {
    var F, U;
    const R =
      ((F = A.worldName)?.toLowerCase().includes(b.toLowerCase())) ||
      ((U = A.ownerUsername)?.toLowerCase().includes(b.toLowerCase()));

    let L = A.gameMode ?? "unknown";
    L = L.slice(0, 1).toUpperCase() + L.slice(1);

    const D = x.includes("All") || x.includes(L);
    return R && D;
  });

  const C = reactExports.useCallback(lodashExports.throttle(p, 3000), []);

  return jsxRuntimeExports.jsxs(Modal, {
    isOpen: m.isOpen,
    onClose: k,
    isCentered: !0,
    size: "2xl",
    children: [
      jsxRuntimeExports.jsx(ModalOverlay, {}),
      jsxRuntimeExports.jsxs(ModalContent, {
        bg: "gray.700",
        children: [
          jsxRuntimeExports.jsxs(ModalHeader, {
            fontSize: "2xl",
            children: [
              "Browse Planets - ",
              T.length,
              " servers available",
              jsxRuntimeExports.jsx(Text, {
                fontSize: "lg",
                children: "Join a planet to play with others!"
              })
            ]
          }),
          jsxRuntimeExports.jsx(ModalCloseButton, {}),
          jsxRuntimeExports.jsxs(ModalBody, {
            h: "full",
            children: [
              jsxRuntimeExports.jsxs(HStack, {
                children: [
                  jsxRuntimeExports.jsx(Input, {
                    placeholder: "Search...",
                    onChange: A => y(A.target.value)
                  }),
                  jsxRuntimeExports.jsx(IconButton, {
                    icon: jsxRuntimeExports.jsx(FiRefreshCw, { size: 28 }),
                    onClick: C
                  })
                ]
              }),

              jsxRuntimeExports.jsxs(HStack, {
                mt: 2,
                children: [
                  jsxRuntimeExports.jsx(Text, {
                    fontSize: "md",
                    children: "Sort by "
                  }),
                  jsxRuntimeExports.jsx(MultiSelect, {
                    options: ["Players", "Time"],
                    selectedOptions: [sortBy],
                    onSelect: A => setSortBy(A)
                  })
                ]
              }),
              jsxRuntimeExports.jsxs(HStack, {
                mt: 2,
                children: [
                  jsxRuntimeExports.jsx(Text, {
                    fontSize: "md",
                    children: "Gamemode "
                  }),
                  jsxRuntimeExports.jsx(MultiSelect, {
                    options: ["All", "Survival", "Adventure", "Creative"],
                    selectedOptions: x,
                    onSelect: E
                  })
                ]
              }),

              jsxRuntimeExports.jsx(Divider, { mt: 2, mb: 2 }),

              jsxRuntimeExports.jsx(VStack, {
                overflowY: "auto",
                maxH: "40vh",
                pb: "1em",
                children:
                  w
                    ? jsxRuntimeExports.jsx(Text, {
                        fontSize: "lg",
                        children:
                          "There are currently no planets available to join :("
                      })
                    : T.length === 0
                    ? jsxRuntimeExports.jsx(Text, {
                        fontSize: "lg",
                        children: "No planets found"
                      })
                    : T.map(A =>
                        jsxRuntimeExports.jsx(
                          PlanetItem,
                          { minigameId: A.id, server: A },
                          A.id
                        ))
              })]
          })]
      })]
  })
},`;

const planetModelEachPanelReplacement = `const PlanetItem = m => {
  const u = reactExports.useContext(GameContext),
        h = m.server.gameMode ?? "unknown";

  const openedAgo = m.server.timeAllocated
    ? "Opened " + dayjs(m.server.timeAllocated).fromNow()
    : null;

  return jsxRuntimeExports.jsx(Box, {
    w: "full",
    p: "0.5em",
    position: "relative",
    fontSize: "md",
    border: "2px solid grey",
    _hover: { border: "2px solid white", cursor: "pointer" },
    onClick: () => { u.connect(m.minigameId); },
    children: jsxRuntimeExports.jsxs(HStack, {
      justifyContent: "space-between",
      w: "full",
      children: [
        jsxRuntimeExports.jsxs(VStack, {
          align: "flex-start",
          overflowX: "hidden",
          children: [
            jsxRuntimeExports.jsx(Text, { children: m.server.worldName }),
            jsxRuntimeExports.jsxs(Text, {
              color: "gray.400",
              fontSize: "sm",
              children: ["Host: ", m.server.ownerUsername ? m.server.ownerUsername : "Guest"]
            }),
            openedAgo && jsxRuntimeExports.jsx(Text, {
              fontSize: "xs",
              color: "gray.500",
              children: openedAgo
            })
          ]
        }),
        jsxRuntimeExports.jsxs(VStack, {
          align: "flex-end",
          children: [
            jsxRuntimeExports.jsxs(Text, { fontSize: "sm", children: [m.server.playerCount, "/", m.server.maxPlayers] }),
            jsxRuntimeExports.jsx(Text, { fontSize: "sm", children: h.slice(0,1).toUpperCase() + h.slice(1) }),
            jsxRuntimeExports.jsx(Text, { fontSize: "sm", children: m.server.worldType ?? "unknown" })
          ]
        })
      ]
    })
  })
},`;
const leaderboardDEVreplacement = `Leaderboards = () => {
		const {
			profile: m
		} = reactExports.useContext(AccountContext),
			u = useNavigate(),
			[h, p] = reactExports.useState(SourceType.KITPVP),
			[g, y] = reactExports.useState(),
			[x, S] = reactExports.useState(),
			[b, v] = reactExports.useState([]),
			[w, k] = reactExports.useState(),
			[E, T] = reactExports.useState(!1);

		const [statType, setStatType] = reactExports.useState(modeStats[SourceType.KITPVP][0]);

		ReactInterface$1.useEscapeHandler(() => u("/"));

		const C = statType,
			A = C.charAt(0).toUpperCase() + C.slice(1);
		reactExports.useEffect(() => {
			T(!0), m ? ClientAxios.userRequest("/leaderboards/with_self_rank", {
				source: h,
				type: C
			}, T).then(D => {
				y(D.topDaily), S(D.topWeekly), v(D.topLifetime), k(D.self)
			}).catch(() => {
				toast({
					description: "Failed to load leaderboards. Please try again later.",
					status: "error"
				})
			}).finally(() => {
				T(!1)
			}) : ClientAxios.publicRequest("/leaderboards", {
				source: h,
				type: C
			}, T).then(D => {
				y(D.topDaily), S(D.topWeekly), v(D.topLifetime)
			}).catch(() => {
				toast({
					description: "Failed to load leaderboards. Please try again later.",
					status: "error"
				})
			}).finally(() => {
				T(!1)
			})
		}, [h, m, statType]);

		const R = D => {
			p(D);
			setStatType(modeStats[D][0]);
		},
			L = {
				background: "rgba(0, 0, 0, 0.5)",
				padding: "0.7em 0.7em",
				color: "white"
			};
		return jsxRuntimeExports.jsx(Container$1, {
			h: "full",
			maxW: "5xl",
			children: jsxRuntimeExports.jsx(Center, {
				h: "full",
				w: "full",
				children: jsxRuntimeExports.jsxs(VStack, {
					w: "full",
					children: [jsxRuntimeExports.jsxs(HStack, {
						w: "full",
						justifyContent: "space-between",
						children: [jsxRuntimeExports.jsx(Box, {
							width: 300,
							children: jsxRuntimeExports.jsx(Text, {
								fontSize: "4xl",
								children: "Leaderboards"
							})
						}), jsxRuntimeExports.jsx(Button$1, {
							onClick: () => u("/"),
							width: 150,
							children: "Back"
						})]
					}), jsxRuntimeExports.jsxs(VStack, {
						w: "full",
						style: L,
						children: [jsxRuntimeExports.jsx(HStack, {
							w: "full",
							overflowX: "auto",
							h: "full",
							justifyContent: "space-between",
							pb: "2",
							children: Object.keys(modeStats).map((D, F) => jsxRuntimeExports.jsx(Box, {
								border: h === D ? "2px solid white" : "2px solid gray",
								p: "3",
								onClick: () => R(D),
								whiteSpace: "nowrap",
								background: h === D ? "rgba(255, 255, 255, 0.2)" : "transparent",
								_hover: {
									cursor: "pointer",
									background: "rgba(255, 255, 255, 0.1)",
									border: "2px solid white"
								},
								children: jsxRuntimeExports.jsx(Text, {
									children: minigameServers[D].name
								})
							}, F)
							)
						}),
						jsxRuntimeExports.jsx(HStack, {
							w: "full",
							overflowX: "auto",
							justifyContent: "center",
							pb: "2",
							children: modeStats[h].map((stat, idx) =>
								jsxRuntimeExports.jsx(Box, {
									key: idx,
									border: stat === statType ? "2px solid white" : "2px solid gray",
									p: "3",
									onClick: () => setStatType(stat),
									whiteSpace: "nowrap",
									background: stat === statType ? "rgba(255, 255, 255, 0.2)" : "transparent",
									_hover: {
										cursor: "pointer",
										background: "rgba(255, 255, 255, 0.1)",
										border: "2px solid white"
									},
									children: jsxRuntimeExports.jsx(Text, {
										children: stat.charAt(0).toUpperCase() + stat.slice(1).toLowerCase()
									})
								}, idx)
							)
						}),

						jsxRuntimeExports.jsx(Divider, {}),

						E ? jsxRuntimeExports.jsx(Text, {
							h: "18em",
							children: "Loading..."
						}) : jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
							children: [jsxRuntimeExports.jsxs(HStack, {
								w: "full",
								h: "full",
								justifyContent: "space-around",
								children: [jsxRuntimeExports.jsxs(Text, {
									fontSize: "xl",
									children: ["Daily ", A]
								}), jsxRuntimeExports.jsxs(Text, {
									fontSize: "xl",
									children: ["Weekly ", A]
								}), jsxRuntimeExports.jsxs(Text, {
									fontSize: "xl",
									children: ["Lifetime ", A]
								})]
							}), jsxRuntimeExports.jsxs(HStack, {
								w: "full",
								justifyContent: "space-around",
								h: "100%",
								maxH: "60vh",
								overflowY: "auto",
								spacing: "0",
								children: [jsxRuntimeExports.jsx(LeaderboardStack, {
									leaderboard: g,
									self: w == null ? void 0 : w.daily
								}), jsxRuntimeExports.jsx(LeaderboardStack, {
									leaderboard: x,
									self: w == null ? void 0 : w.weekly
								}), jsxRuntimeExports.jsx(LeaderboardStack, {
									leaderboard: b,
									self: w == null ? void 0 : w.lifetime
								})]
							})]
						})]
					})]
				})
			})
		})
	},`;

export const ADVANCED_BROWSE_PLANETS_MODAL: SingleReplacement = [
	/BrowsePlanetsModal\s*=\s*\w+\s*=>\s*\{[\s\S]*?\)\s*\)\s*\}\s*\)\s*\]\s*\}\s*\)\s*\]\s*\}\s*\)\s*\]\s*\}\s*\)\s*\}\s*,/g,
	{
		replacement: browsePlanetsModalReplacement,
		shift: Shift.REPLACE,
	},
];

export const PLANET_MODEL_EACH_PANEL: SingleReplacement = [
	/const PlanetItem\s*=\s*\w+\s*=>\s*\{[\s\S]*?\}\)\]\s*\}\)\]\s*\}\s*\)\s*\}\s*\)\s*\}\s*,/g,
	{
		replacement: planetModelEachPanelReplacement,
		shift: Shift.REPLACE,
	},
];

export const DEVELOPER_LEADERBOARD: SingleReplacement = [
	/Leaderboards\s*=\s*\(\s*\)\s*=>\s*\{[\s\S]*?\}\s*\)\s*\]\s*\}\s*\)\s*\]\s*\}\s*\)\s*\]\s*\}\s*\)\s*\]\s*\}\s*\)\s*\}\s*\)\s*\}\s*\)\s*\}\s*,/g,
	{
		replacement: leaderboardDEVreplacement,
		shift: Shift.REPLACE,
	},
];
const modeStatsReplacement = `modeStats = {
		kitpvp: [StatType.KILLS, StatType.DEATHS, StatType.KILLSTREAK],
		skywars: [StatType.WINS, StatType.KILLS, StatType.DEATHS, StatType.LOSSES],
		eggwars2: [StatType.WINS, StatType.KILLS, StatType.DEATHS, StatType.LOSSES, StatType.EGGS_BROKEN, StatType.FINAL_KILLS, StatType.FINAL_DEATHS],
		eggwars4: [StatType.WINS, StatType.KILLS, StatType.DEATHS, StatType.LOSSES, StatType.EGGS_BROKEN, StatType.FINAL_KILLS, StatType.FINAL_DEATHS],
		blitzbuild: [StatType.WINS],
		spleef: [StatType.WINS, StatType.TIME],
		duels_bridge: [StatType.WINS, StatType.KILLS, StatType.DEATHS, StatType.LOSSES],
		oitq: [StatType.KILLS, StatType.DEATHS, StatType.KILLSTREAK],
		pvp: [StatType.KILLS, StatType.DEATHS, StatType.KILLSTREAK],
		eggwars: [StatType.WINS, StatType.KILLS, StatType.DEATHS, StatType.LOSSES, StatType.EGGS_BROKEN, StatType.FINAL_KILLS, StatType.FINAL_DEATHS],
		eggwars3: [StatType.WINS, StatType.KILLS, StatType.DEATHS, StatType.LOSSES, StatType.EGGS_BROKEN, StatType.FINAL_KILLS, StatType.FINAL_DEATHS],
		blockhunt: [StatType.WINS, StatType.LOSSES],
	},`;

export const STATISTICS_MODE_STATS_REPLACEMENT: SingleReplacement = [
	/modeStats\s*=\s*\{[\s\S]*?\}\s*,/g,
	{
		replacement: modeStatsReplacement,
		shift: Shift.REPLACE,
	},
];
