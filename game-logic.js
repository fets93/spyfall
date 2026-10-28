// Game rules, kept free of any page code so they can be tested with Node (see test.js).
const GameLogic = {
  SPY: "Spy",
  MIN_PLAYERS: 3,
  DEFAULT_TIMER_MINUTES: 8,
  MAX_TIMER_MINUTES: 20,
  DEFAULT_PLACES: ["Beach", "Restaurant", "Space Station", "Pirate Ship", "Magic School", "At home", "Current Location", "Sauna", "Military Base", "Forest", "Casino", "Circus", "Bank", "Club", "Polar Station", "Cathedral", "Airplane", "Brothel", "Hospital", "School", "Hotel", "Theater", "Rock Concert"],

  // Deals one card per player: everyone gets the same random place, except
  // `spies` randomly chosen players who get the spy card.
  dealCards(places, spies, players) {
    if (players <= 0) return [];
    // A place called "Spy" would make everyone look like a spy at the reveal
    const usable = places.filter(p => p !== GameLogic.SPY);
    const place = usable.length ? usable[Math.floor(Math.random() * usable.length)] : "No place";
    // Always keep at least one non-spy, otherwise there is nothing to find out
    const spyCount = Math.min(Math.max(spies, 0), players - 1);
    const seats = [...Array(players).keys()];
    for (let i = seats.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [seats[i], seats[j]] = [seats[j], seats[i]];
    }
    const spySeats = new Set(seats.slice(0, spyCount));
    return seats.map((_, i) => (spySeats.has(i) ? GameLogic.SPY : place));
  },

  // Trims the name and returns null if it's empty or already in the list (case-insensitive).
  validatedNewEntry(name, existing) {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const lower = trimmed.toLowerCase();
    return existing.some(e => e.toLowerCase() === lower) ? null : trimmed;
  },

  // Formats a countdown as m:ss, rounding up so the display only shows 0:00 once time is really over.
  formattedTime(seconds) {
    const total = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  },

  clampSpies(spies, players) {
    if (players < GameLogic.MIN_PLAYERS) return 1;
    return Math.min(Math.max(spies, 1), players - 1);
  },
};

if (typeof module !== "undefined") module.exports = GameLogic;
