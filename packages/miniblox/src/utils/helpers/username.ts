/**
 * Extracted from Miniblox's source code. (3.46.139)
 */

// from miniblox
const adjectives = [
	"Happy",
	"Funny",
	"Brave",
	"Clever",
	"Swift",
	"Mighty",
	"Wild",
	"Sneaky",
	"Loyal",
	"Fierce",
	"Curious",
	"Bold",
	"Gentle",
	"Quiet",
	"Playful",
	"Fearless",
	"Cunning",
	"Friendly",
	"Jolly",
	"Proud",
	"Silly",
	"Cheerful",
	"Daring",
	"Energetic",
	"Lazy",
	"Mysterious",
	"Shy",
	"Adventurous",
	"Calm",
	"Strong",
	"Noble",
	"Wise",
	"Speedy",
	"Joyful",
	"Grumpy",
	"Kind",
	"Crazy",
	"Lively",
	"Charming",
	"Crafty",
	"Majestic",
	"Peppy",
	"Stubborn",
	"Diligent",
	"Sleepy",
	"Quick",
	"Witty",
	"Chill",
];
const objects = [
	"Bear",
	"Pig",
	"Wolf",
	"Tiger",
	"Lion",
	"Fox",
	"Eagle",
	"Falcon",
	"Hawk",
	"Panther",
	"Cheetah",
	"Leopard",
	"Elephant",
	"Rhino",
	"Giraffe",
	"Buffalo",
	"Crocodile",
	"Alligator",
	"Shark",
	"Dolphin",
	"Whale",
	"Penguin",
	"Owl",
	"Rabbit",
	"Deer",
	"Moose",
	"Koala",
	"Kangaroo",
	"Zebra",
	"Panda",
	"Hippo",
	"Otter",
	"Raccoon",
	"Squirrel",
	"Badger",
	"Bison",
	"Camel",
	"Goat",
	"Sheep",
	"Lynx",
	"Jaguar",
	"Cougar",
	"Gorilla",
	"Chimpanzee",
	"Orangutan",
	"Wolf",
	"Hare",
	"Parrot",
	"Lizard",
	"Gecko",
	"Iguana",
];
const randomBuffer = 5;
const minLength = 20;

/**
 * @returns a 20 character username
 */
export default function randomUsername() {
	let adj: string, obj: string;
	do {
		adj = adjectives[Math.floor(Math.random() * adjectives.length)];
		obj = objects[Math.floor(Math.random() * objects.length)];
	} while (adj.length + obj.length + randomBuffer > minLength);
	let random = ``;
	for (let i = 0; i < 4; i++) {
		const s = `abcdefghijklmnopqrstuvwxyz`[Math.floor(Math.random() * 26)];
		random += Math.random() > 0.5 ? s.toUpperCase() : s;
	}
	return `${adj}${obj}.${random}`;
}
