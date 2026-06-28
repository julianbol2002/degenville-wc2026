export interface ParticipantConfig {
  tabName: string;
  displayName: string;
  slug: string;
}

export const PARTICIPANTS: ParticipantConfig[] = [
  { tabName: "Carson_Russell", displayName: "Carson Russell", slug: "carson-russell" },
  { tabName: "Coleman_Tuck", displayName: "Coleman Tuck", slug: "coleman-tuck" },
  { tabName: "blake_parkman", displayName: "blake parkman", slug: "blake-parkman" },
  { tabName: "Devin_duCille", displayName: "Devin duCille", slug: "devin-ducille" },
  { tabName: "myles_jones", displayName: "myles jones", slug: "myles-jones" },
  { tabName: "nate_briscoe", displayName: "nate briscoe", slug: "nate-briscoe" },
  { tabName: "zach_fischer", displayName: "zach fischer", slug: "zach-fischer" },
  { tabName: "Aidan_Whillock", displayName: "Aidan Whillock", slug: "aidan-whillock" },
  { tabName: "andrew_canaway", displayName: "andrew canaway", slug: "andrew-canaway" },
  { tabName: "wesley_kane", displayName: "wesley kane", slug: "wesley-kane" },
  { tabName: "cameron_cheeley", displayName: "cameron cheeley", slug: "cameron-cheeley" },
  { tabName: "ben_cripe", displayName: "ben cripe", slug: "ben-cripe" },
  { tabName: "will_braza", displayName: "will braza", slug: "will-braza" },
  { tabName: "Ben_Whitlock", displayName: "Ben Whitlock", slug: "ben-whitlock" },
  { tabName: "Zach_Bowen", displayName: "Zach Bowen", slug: "zach-bowen" },
  { tabName: "Alec_Stephens", displayName: "Alec Stephens", slug: "alec-stephens" },
  { tabName: "Casey_Venis", displayName: "Casey Venis", slug: "casey-venis" },
];

export const RESULTS_TAB = "Results (Enter Here)";

export function getParticipantBySlug(slug: string): ParticipantConfig | undefined {
  return PARTICIPANTS.find((p) => p.slug === slug);
}
