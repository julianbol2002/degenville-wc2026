const BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSs07VSIpzIgfg5-7lz45Bal_fOCRoV1aJWjt9r9MbJFdQqUeYhov5_0FQEUwncVJKQQdjudRk9h9aR/pub?output=csv&gid=";

export const RESULTS_TAB = "Results (Enter Here)";
export const RESULTS_CSV_URL = BASE + "1863442006";

export const PARTICIPANTS = [
  { tabName: "Carson_Russell",   displayName: "Carson Russell",   slug: "carson-russell",   csvUrl: BASE + "1620953036" },
  { tabName: "Coleman_Tuck",     displayName: "Coleman Tuck",     slug: "coleman-tuck",     csvUrl: BASE + "2022448053" },
  { tabName: "blake_parkman",    displayName: "blake parkman",    slug: "blake-parkman",    csvUrl: BASE + "1819183821" },
  { tabName: "Devin_duCille",    displayName: "Devin duCille",    slug: "devin-ducille",    csvUrl: BASE + "1454210084" },
  { tabName: "myles_jones",      displayName: "myles jones",      slug: "myles-jones",      csvUrl: BASE + "37850740"   },
  { tabName: "nate_briscoe",     displayName: "nate briscoe",     slug: "nate-briscoe",     csvUrl: BASE + "1767346490" },
  { tabName: "zach_fischer",     displayName: "zach fischer",     slug: "zach-fischer",     csvUrl: BASE + "421342707"  },
  { tabName: "Aidan_Whillock",   displayName: "Aidan Whillock",   slug: "aidan-whillock",   csvUrl: BASE + "432500133"  },
  { tabName: "andrew_canaway",   displayName: "andrew canaway",   slug: "andrew-canaway",   csvUrl: BASE + "69808205"   },
  { tabName: "wesley_kane",      displayName: "wesley kane",      slug: "wesley-kane",      csvUrl: BASE + "560942049"  },
  { tabName: "cameron_cheeley",  displayName: "cameron cheeley",  slug: "cameron-cheeley",  csvUrl: BASE + "521221019"  },
  { tabName: "ben_cripe",        displayName: "ben cripe",        slug: "ben-cripe",        csvUrl: BASE + "1330100723" },
  { tabName: "will_braza",       displayName: "will braza",       slug: "will-braza",       csvUrl: BASE + "785059405"  },
  { tabName: "Ben_Whitlock",     displayName: "Ben Whitlock",     slug: "ben-whitlock",     csvUrl: BASE + "2109602071" },
  { tabName: "Zach_Bowen",       displayName: "Zach Bowen",       slug: "zach-bowen",       csvUrl: BASE + "47606267"   },
  { tabName: "Alec_Stephens",    displayName: "Alec Stephens",    slug: "alec-stephens",    csvUrl: BASE + "1116447354" },
  { tabName: "Casey_Venis",      displayName: "Casey Venis",      slug: "casey-venis",      csvUrl: BASE + "1608316391" },
  { tabName: "Julian_Bolanos",   displayName: "Julian Bolanos",   slug: "julian-bolanos",   csvUrl: BASE + "219585122"  },
];

export function getParticipantConfig(tabName: string) {
  return PARTICIPANTS.find((p) => p.tabName === tabName) ?? null;
}

export function getParticipantBySlug(slug: string) {
  return PARTICIPANTS.find((p) => p.slug === slug) ?? null;
}
