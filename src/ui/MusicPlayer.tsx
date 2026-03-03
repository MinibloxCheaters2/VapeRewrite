import { createSignal, For, onMount, Show } from "solid-js";
import { render } from "solid-js/web";
import { guiVisible } from "./guiState";
import shadowWrapper from "./shadowWrapper";

const JAMENDO_API_KEY = "0c5e9d9e";

interface Track {
	id: string;
	name: string;
	artist_name: string;
	image: string;
	duration: number;
}

interface GlobalMusicState {
	currentTrack: Track | null;
	audioElement: HTMLAudioElement | null;
	isPlaying: boolean;
	analyser: AnalyserNode | null;
	audioContext: AudioContext | null;
}

const globalMusicState: GlobalMusicState = {
	currentTrack: null,
	audioElement: null,
	isPlaying: false,
	analyser: null,
	audioContext: null,
};

// Visualizer component - always at bottom of screen
function Visualizer() {
	const [isVisible, setIsVisible] = createSignal(false);
	const [coverImage, setCoverImage] = createSignal("");
	let canvasRef: HTMLCanvasElement | undefined;
	let animationFrameId: number | undefined;

	const startVisualizer = () => {
		if (
			!globalMusicState.audioElement ||
			!globalMusicState.analyser ||
			!canvasRef
		)
			return;

		const ctx = canvasRef.getContext("2d");
		if (!ctx) return;

		const analyser = globalMusicState.analyser;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const draw = () => {
			if (!globalMusicState.isPlaying) {
				ctx.clearRect(0, 0, canvasRef?.width, canvasRef?.height);
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = undefined;
				}
				return;
			}

			animationFrameId = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);

			ctx.clearRect(0, 0, canvasRef?.width, canvasRef?.height);

			const barCount = 64;
			const barWidth = canvasRef?.width / barCount;

			for (let i = 0; i < barCount; i++) {
				const dataIndex = Math.floor((i / barCount) * bufferLength);
				const barHeight =
					(dataArray[dataIndex] / 255) * canvasRef?.height * 0.9;

				const gradient = ctx.createLinearGradient(
					0,
					canvasRef?.height - barHeight,
					0,
					canvasRef?.height,
				);
				gradient.addColorStop(0, "rgba(5, 134, 105, 1)");
				gradient.addColorStop(1, "rgba(5, 134, 105, 0.4)");

				ctx.fillStyle = gradient;
				ctx.fillRect(
					i * barWidth + 1,
					canvasRef?.height - barHeight,
					barWidth - 2,
					barHeight,
				);
			}
		};

		draw();
	};

	onMount(() => {
		// Poll for state changes
		const interval = setInterval(() => {
			const playing = globalMusicState.isPlaying;
			const track = globalMusicState.currentTrack;

			setIsVisible(playing);

			if (track?.image) {
				setCoverImage(track.image);
			}

			if (playing && !animationFrameId) {
				startVisualizer();
			}
		}, 100);

		return () => {
			clearInterval(interval);
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});

	return (
		<Show when={isVisible()}>
			<div
				style={{
					position: "fixed",
					bottom: "0",
					left: "0",
					"z-index": "9999",
					"pointer-events": "none",
				}}
			>
				{/* Cover image */}
				<img
					src={
						coverImage() ||
						"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23333'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='0.3em' fill='%23888' font-size='30'%3E🎵%3C/text%3E%3C/svg%3E"
					}
					alt="Cover"
					style={{
						position: "fixed",
						bottom: "0",
						left: "0",
						width: "100px",
						height: "100px",
						"object-fit": "cover",
						"pointer-events": "auto",
					}}
				/>

				{/* Visualizer canvas */}
				<canvas
					ref={canvasRef}
					width={800}
					height={100}
					style={{
						position: "fixed",
						bottom: "0",
						left: "100px",
						width: "800px",
						height: "100px",
					}}
				/>
			</div>
		</Show>
	);
}

function MusicPlayer() {
	const [expanded, setExpanded] = createSignal(false);
	const [searching, setSearching] = createSignal(false);
	const [searchQuery, setSearchQuery] = createSignal("");
	const [searchResults, setSearchResults] = createSignal<Track[]>([]);
	const [currentTrack, setCurrentTrack] = createSignal<Track | null>(null);
	const [isPlaying, setIsPlaying] = createSignal(false);
	const [currentTime, setCurrentTime] = createSignal(0);
	const [duration, setDuration] = createSignal(0);

	let searchTimeout: number | undefined;

	const formatTime = (seconds: number) => {
		if (!seconds || Number.isNaN(seconds)) return "00:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const setupAudioAnalyser = (audioElement: HTMLAudioElement) => {
		try {
			// Don't recreate if already connected
			if ((audioElement as any)._audioSource) {
				console.log("Audio source already connected");
				return;
			}

			if (!globalMusicState.audioContext) {
				globalMusicState.audioContext = new (
					window.AudioContext || (window as any).webkitAudioContext
				)();
				console.log("AudioContext created");
			}

			if (!globalMusicState.analyser) {
				globalMusicState.analyser =
					globalMusicState.audioContext.createAnalyser();
				globalMusicState.analyser.fftSize = 256;
				console.log("Analyser created");
			}

			const source =
				globalMusicState.audioContext.createMediaElementSource(
					audioElement,
				);
			source.connect(globalMusicState.analyser);
			globalMusicState.analyser.connect(
				globalMusicState.audioContext.destination,
			);
			(audioElement as any)._audioSource = source;
			console.log("Audio source connected to analyser and destination");
		} catch (error) {
			console.error("Failed to setup audio analyser:", error);
		}
	};

	const loadTrack = (track: Track) => {
		console.log("Loading track:", track.name);
		setCurrentTrack(track);
		globalMusicState.currentTrack = track;

		if (globalMusicState.audioElement) {
			globalMusicState.audioElement.pause();
			globalMusicState.audioElement.src = "";
		}

		const audioUrl = `https://prod-1.storage.jamendo.com/?trackid=${track.id}&format=mp31&from=app-97dab294`;
		console.log("Audio URL:", audioUrl);

		const audioElement = new Audio();
		globalMusicState.audioElement = audioElement;
		audioElement.crossOrigin = "anonymous";
		audioElement.preload = "metadata";

		audioElement.addEventListener("loadedmetadata", () => {
			setDuration(audioElement.duration || 0);
			console.log("Track loaded, duration:", audioElement.duration);
		});

		audioElement.addEventListener("timeupdate", () => {
			setCurrentTime(audioElement.currentTime || 0);
		});

		audioElement.addEventListener("ended", () => {
			console.log("Track ended");
			globalMusicState.isPlaying = false;
			setIsPlaying(false);
			playNextTrack();
		});

		audioElement.addEventListener("error", (e) => {
			console.error("Audio error:", e);
		});

		audioElement.addEventListener("canplay", () => {
			console.log("Audio can play");
		});

		audioElement.src = audioUrl;
		audioElement.load();

		setupAudioAnalyser(audioElement);

		globalMusicState.isPlaying = false;
		setIsPlaying(false);
	};

	const playTrack = () => {
		if (!globalMusicState.audioElement || !globalMusicState.currentTrack) {
			console.log("Cannot play: no audio element or track");
			return;
		}

		console.log("Playing track:", globalMusicState.currentTrack.name);
		globalMusicState.audioElement
			.play()
			.then(() => {
				globalMusicState.isPlaying = true;
				setIsPlaying(true);
				console.log("Playback started");
			})
			.catch((error) => {
				console.error("Play error:", error);
			});
	};

	const pauseTrack = () => {
		if (!globalMusicState.audioElement) return;

		console.log("Pausing track");
		globalMusicState.audioElement.pause();
		globalMusicState.isPlaying = false;
		setIsPlaying(false);
	};

	const playNextTrack = () => {
		const results = searchResults();
		const current = currentTrack();
		if (!current || results.length === 0) return;

		const currentIndex = results.findIndex((t) => t.id === current.id);
		const nextIndex = (currentIndex + 1) % results.length;
		console.log("Playing next track:", results[nextIndex].name);
		loadTrack(results[nextIndex]);
		setTimeout(() => playTrack(), 100);
	};

	const searchMusic = async (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		console.log("Searching for:", query);
		try {
			const response = await fetch(
				`https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=20&search=${encodeURIComponent(query)}&include=musicinfo`,
			);
			const data = await response.json();

			if (data.results && data.results.length > 0) {
				console.log("Found", data.results.length, "tracks");
				setSearchResults(data.results);
			} else {
				console.log("No results found");
				setSearchResults([]);
			}
		} catch (error) {
			console.error("Search error:", error);
			setSearchResults([]);
		}
	};

	const handleSearchInput = (value: string) => {
		setSearchQuery(value);
		clearTimeout(searchTimeout);
		searchTimeout = window.setTimeout(() => {
			searchMusic(value);
		}, 500);
	};

	const isVisible = () => guiVisible();

	return (
		<>
			{/* Visualizer - always at bottom */}
			<Visualizer />

			{/* Music player button - only when GUI visible */}
			<Show when={isVisible()}>
				<div
					style={{
						position: "fixed",
						bottom: "20px",
						left: "20px",
						"z-index": "10001",
						"font-family": "Arial, sans-serif",
					}}
					on:pointerenter={() => setExpanded(true)}
					on:pointerleave={() => {
						setExpanded(false);
						setSearching(false);
					}}
				>
					<div
						style={{
							position: "relative",
							width: expanded()
								? searching()
									? "360px"
									: "340px"
								: "80px",
							height: expanded()
								? searching()
									? "440px"
									: "160px"
								: "80px",
							"background-color": "rgba(26, 25, 26, 0.95)",
							"border-radius": "16px",
							"box-shadow":
								"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
							"backdrop-filter": "blur(10px)",
							overflow: "hidden",
							transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						}}
					>
						{/* Cover image - always visible */}
						<div
							style={{
								position: "absolute",
								top: "10px",
								left: "10px",
								width: "60px",
								height: "60px",
								"border-radius": "10px",
								overflow: "hidden",
								"background-color": "rgb(30, 29, 30)",
								"z-index": "2",
								"box-shadow": "0 2px 8px rgba(0, 0, 0, 0.3)",
							}}
						>
							<img
								src={
									currentTrack()?.image ||
									"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23333'/%3E%3Ctext x='30' y='30' text-anchor='middle' dy='0.3em' fill='%23888' font-size='24'%3E🎵%3C/text%3E%3C/svg%3E"
								}
								alt="Cover"
								style={{
									width: "100%",
									height: "100%",
									"object-fit": "cover",
								}}
							/>
						</div>

						{/* Expanded content */}
						<Show when={expanded()}>
							<div
								style={{
									position: "absolute",
									top: "0",
									left: "0",
									width: "100%",
									height: "100%",
									padding: "16px",
									"padding-left": "85px",
									"box-sizing": "border-box",
								}}
							>
								{/* Search mode */}
								<Show when={searching()}>
									<div style={{ height: "100%" }}>
										<div
											style={{
												display: "flex",
												gap: "8px",
												"margin-bottom": "12px",
											}}
										>
											<input
												type="text"
												placeholder="🔍 Search music..."
												value={searchQuery()}
												on:input={(e) =>
													handleSearchInput(
														e.currentTarget.value,
													)
												}
												autofocus
												style={{
													flex: "1",
													padding: "10px 12px",
													border: "1px solid rgba(5, 134, 105, 0.3)",
													"border-radius": "8px",
													background:
														"rgba(0, 0, 0, 0.4)",
													color: "rgb(200, 200, 200)",
													"font-size": "13px",
													outline: "none",
													"font-family":
														"Arial, sans-serif",
												}}
											/>
											<button
												type="button"
												on:click={(e) => {
													e.stopPropagation();
													setSearching(false);
												}}
												style={{
													width: "36px",
													height: "36px",
													background:
														"rgba(255, 255, 255, 0.1)",
													border: "none",
													"border-radius": "8px",
													color: "rgb(200, 200, 200)",
													cursor: "pointer",
													"font-size": "16px",
													display: "flex",
													"align-items": "center",
													"justify-content": "center",
													transition:
														"background 0.2s",
												}}
												on:pointerenter={(e) => {
													e.currentTarget.style.background =
														"rgba(255, 255, 255, 0.2)";
												}}
												on:pointerleave={(e) => {
													e.currentTarget.style.background =
														"rgba(255, 255, 255, 0.1)";
												}}
											>
												✕
											</button>
										</div>

										<div
											style={{
												height: "calc(100% - 60px)",
												"overflow-y": "auto",
												"padding-right": "4px",
											}}
										>
											<For
												each={searchResults()}
												fallback={
													<div
														style={{
															"text-align":
																"center",
															padding:
																"40px 20px",
															color: "rgb(100, 100, 100)",
															"font-size": "13px",
														}}
													>
														{searchQuery()
															? "No results found"
															: "Enter a search term"}
													</div>
												}
											>
												{(track) => (
													<div
														on:click={(e) => {
															e.stopPropagation();
															loadTrack(track);
															setSearching(false);
															setTimeout(
																() =>
																	playTrack(),
																100,
															);
														}}
														style={{
															display: "flex",
															gap: "10px",
															padding: "10px",
															"border-radius":
																"8px",
															cursor: "pointer",
															transition:
																"background 0.2s",
															"margin-bottom":
																"6px",
														}}
														on:pointerenter={(
															e,
														) => {
															e.currentTarget.style.background =
																"rgba(5, 134, 105, 0.2)";
														}}
														on:pointerleave={(
															e,
														) => {
															e.currentTarget.style.background =
																"transparent";
														}}
													>
														<img
															src={
																track.image ||
																"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23444'/%3E%3C/svg%3E"
															}
															alt=""
															style={{
																width: "45px",
																height: "45px",
																"border-radius":
																	"6px",
																"object-fit":
																	"cover",
															}}
														/>
														<div
															style={{
																flex: "1",
																"min-width":
																	"0",
															}}
														>
															<div
																style={{
																	"font-size":
																		"13px",
																	"font-weight":
																		"600",
																	color: "rgb(200, 200, 200)",
																	"white-space":
																		"nowrap",
																	overflow:
																		"hidden",
																	"text-overflow":
																		"ellipsis",
																	"margin-bottom":
																		"4px",
																}}
															>
																{track.name}
															</div>
															<div
																style={{
																	"font-size":
																		"11px",
																	color: "rgb(150, 150, 150)",
																	"white-space":
																		"nowrap",
																	overflow:
																		"hidden",
																	"text-overflow":
																		"ellipsis",
																}}
															>
																{
																	track.artist_name
																}
															</div>
														</div>
													</div>
												)}
											</For>
										</div>
									</div>
								</Show>

								{/* Player mode */}
								<Show when={!searching()}>
									<div style={{ height: "100%" }}>
										{/* Track info */}
										<div
											style={{ "margin-bottom": "10px" }}
										>
											<div
												style={{
													"font-size": "14px",
													"font-weight": "bold",
													color: "rgb(5, 134, 105)",
													"white-space": "nowrap",
													overflow: "hidden",
													"text-overflow": "ellipsis",
													"margin-bottom": "4px",
												}}
											>
												{currentTrack()?.name ||
													"No track selected"}
											</div>
											<div
												style={{
													"font-size": "12px",
													color: "rgb(150, 150, 150)",
													"white-space": "nowrap",
													overflow: "hidden",
													"text-overflow": "ellipsis",
												}}
											>
												{currentTrack()?.artist_name ||
													"Click search to select"}
											</div>
										</div>

										{/* Time */}
										<div
											style={{
												"font-size": "11px",
												color: "rgb(100, 100, 100)",
												"margin-bottom": "10px",
											}}
										>
											{formatTime(currentTime())} /{" "}
											{formatTime(duration())}
										</div>

										{/* Controls */}
										<div
											style={{
												display: "flex",
												gap: "10px",
												"align-items": "center",
											}}
										>
											<button
												type="button"
												on:click={(e) => {
													e.stopPropagation();
													if (isPlaying()) {
														pauseTrack();
													} else {
														playTrack();
													}
												}}
												disabled={!currentTrack()}
												style={{
													width: "40px",
													height: "40px",
													"border-radius": "50%",
													border: "2px solid rgb(5, 134, 105)",
													background: "transparent",
													color: "rgb(5, 134, 105)",
													cursor: currentTrack()
														? "pointer"
														: "not-allowed",
													"font-size": "16px",
													display: "flex",
													"align-items": "center",
													"justify-content": "center",
													transition: "all 0.2s",
													opacity: currentTrack()
														? "1"
														: "0.3",
												}}
												on:pointerenter={(e) => {
													if (currentTrack()) {
														e.currentTarget.style.background =
															"rgb(5, 134, 105)";
														e.currentTarget.style.color =
															"white";
														e.currentTarget.style.transform =
															"scale(1.05)";
													}
												}}
												on:pointerleave={(e) => {
													e.currentTarget.style.background =
														"transparent";
													e.currentTarget.style.color =
														"rgb(5, 134, 105)";
													e.currentTarget.style.transform =
														"scale(1)";
												}}
											>
												{isPlaying() ? "⏸" : "▶"}
											</button>

											<button
												type="button"
												on:click={(e) => {
													e.stopPropagation();
													playNextTrack();
												}}
												disabled={
													!currentTrack() ||
													searchResults().length === 0
												}
												style={{
													width: "36px",
													height: "36px",
													"border-radius": "50%",
													border: "2px solid rgb(5, 134, 105)",
													background: "transparent",
													color: "rgb(5, 134, 105)",
													cursor:
														currentTrack() &&
														searchResults().length >
															0
															? "pointer"
															: "not-allowed",
													"font-size": "14px",
													display: "flex",
													"align-items": "center",
													"justify-content": "center",
													transition: "all 0.2s",
													opacity:
														currentTrack() &&
														searchResults().length >
															0
															? "1"
															: "0.3",
												}}
												on:pointerenter={(e) => {
													if (
														currentTrack() &&
														searchResults().length >
															0
													) {
														e.currentTarget.style.background =
															"rgb(5, 134, 105)";
														e.currentTarget.style.color =
															"white";
														e.currentTarget.style.transform =
															"scale(1.05)";
													}
												}}
												on:pointerleave={(e) => {
													e.currentTarget.style.background =
														"transparent";
													e.currentTarget.style.color =
														"rgb(5, 134, 105)";
													e.currentTarget.style.transform =
														"scale(1)";
												}}
											>
												⏭
											</button>

											<button
												type="button"
												on:click={(e) => {
													e.stopPropagation();
													setSearching(true);
												}}
												style={{
													flex: "1",
													padding: "10px",
													"border-radius": "8px",
													border: "1px solid rgba(5, 134, 105, 0.3)",
													background:
														"rgba(0, 0, 0, 0.3)",
													color: "rgb(150, 150, 150)",
													cursor: "pointer",
													"font-size": "13px",
													transition: "all 0.2s",
													"font-family":
														"Arial, sans-serif",
												}}
												on:pointerenter={(e) => {
													e.currentTarget.style.background =
														"rgba(5, 134, 105, 0.2)";
													e.currentTarget.style.color =
														"rgb(5, 134, 105)";
													e.currentTarget.style.borderColor =
														"rgb(5, 134, 105)";
												}}
												on:pointerleave={(e) => {
													e.currentTarget.style.background =
														"rgba(0, 0, 0, 0.3)";
													e.currentTarget.style.color =
														"rgb(150, 150, 150)";
													e.currentTarget.style.borderColor =
														"rgba(5, 134, 105, 0.3)";
												}}
											>
												🔍 Search
											</button>
										</div>
									</div>
								</Show>
							</div>
						</Show>
					</div>
				</div>
			</Show>
		</>
	);
}

export function initMusicPlayer() {
	const container = document.createElement("div");
	container.id = "music-player-container";
	shadowWrapper.wrapper.appendChild(container);

	render(() => <MusicPlayer />, container);
}
