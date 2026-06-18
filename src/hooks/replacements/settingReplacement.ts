import { Shift, type SingleReplacement } from "../replacementTypes";

const optionsReplacement = /*js*/ `E(Options, "aura", new SelectOption("Aura", ["None", "Rain", "Tornado", "Halo", "Planet", "Inferno"], "None"));
E(Options, "trail", new SelectOption("Trail", ["None", "Flame", "Rain", "Heart"], "None"));
E(Options, "auraAll", new Option("Aura To All Players", false));
E(Options, "trailAll", new Option("Trail To All Players", false));
E(Options, "cullChunks", new Option("Cull Chunks", true));`;

const auraReplacements = `}), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options.fog
		}), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options.cullChunks
		}), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options.clouds
    }), jsxRuntimeExports.jsx(SelectButton, {
			option: Options.aura
    }), jsxRuntimeExports.jsx(SelectButton, {
			option: Options.trail
    }), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options.auraAll
		}), jsxRuntimeExports.jsx(ToggleButton, {
			option: Options.trailAll`;

export const EXTRA_OPTIONS: SingleReplacement = [
	/let\s+Options\s*=\s*\w+;/,
	{
		replacement: optionsReplacement,
		shift: Shift.AFTER,
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
		replacement:
			/*js*/ "Options.cullChunks.value?CHUNK_UNLOADS_PER_TICK:0)",
		shift: Shift.REPLACE,
	},
];

export const SHOW_CLOUDS_SETTING: SingleReplacement = [
	/A\s*\(\s*this\s*,\s*["']generate["']\s*\)\s*;\s*I\s*\(\s*this\s*,\s*["']showClouds["']\s*\)\s*;/g,
	{
		replacement: /*js*/ `b(this, "generate",Options.clouds.value);
		E(this, "showClouds",Options.clouds.value);`,
		shift: Shift.REPLACE,
	},
];

export const SHOW_CLOUDS_UPDATE_SETTING: SingleReplacement = [
	/this\.generate\s*==\s*this\.showClouds/g,
	{
		replacement: /*js*/ `this.showClouds = Options.clouds.value; this.generate == this.showClouds`,
		shift: Shift.REPLACE,
	},
];

export const GENERATE_CLOUDS_REPLACEMENT: SingleReplacement = [
	/generateClouds\s*\(\s*\w+\s*\)\s*\{\s*for[\s\S]*?;/g,
	{
		replacement: `generateClouds(u) {
		for (const h of this.clouds) this.gameScene.scene.remove(h), h.visible = Options.clouds.value;`,
		shift: Shift.REPLACE,
	},
];

const trailAuraReplacement = /*js*/ `class EffectsManager {
	constructor(u, h) {
		E(this, "activeEffects");
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
		(u = Options.aura.value != "None" && (Options.auraAll.value || this.world.game.player.socketId == this.player.profile.uuid)? AURAS[Options.aura.value.toLowerCase()]: AURAS[this.player.profile.effects.aura]) == null || u.effect.update(this.world, this.player), (h = Options.trail.value != "None" && (Options.trailAll.value || this.world.game.player.socketId == this.player.profile.uuid)? TRAILS[Options.trail.value.toLowerCase()]: TRAILS[this.player.profile.effects.trail]) == null || h.effect.update(this.world, this.player)
	}
}`;

export const TRAIL_AURA_REPLACEMENT: SingleReplacement = [
	/class\sEffectsManager\s*\{[\s\S]*?\}\s*\}/g,
	{
		replacement: trailAuraReplacement,
		shift: Shift.REPLACE,
	},
];
const leaderboardDEVreplacement = /*js*/ `Leaderboards = () => {
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

export const DEVELOPER_LEADERBOARD: SingleReplacement = [
	/Leaderboards\s*=\s*\(\s*\)\s*=>\s*\{[\s\S]*?\}\s*\)\s*\]\s*\}\s*\)\s*\]\s*\}\s*\)\s*\]\s*\}\s*\)\s*\]\s*\}\s*\)\s*\}\s*\)\s*\}\s*\)\s*\}\s*,/g,
	{
		replacement: leaderboardDEVreplacement,
		shift: Shift.REPLACE,
	},
];
const modeStatsReplacement = /*js*/ `modeStats = {
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
