export interface ProgramDay {
  day: number
  title: string
  task: string
  question: string
  note: string
  icon: string
}

export const TEN_DAY_PROGRAM: ProgramDay[] = [
  {
    day: 1,
    title: "Upoznaj svoje okidače",
    task: "Prati kada ti se javlja želja za cigaretom i zapiši što si radio/la u tom trenutku.",
    question: "U kojim situacijama ti je najteže odoljeti?",
    note: "Prepoznavanje uzorka je prvi korak prema promjeni.",
    icon: "🔍",
  },
  {
    day: 2,
    title: "Pripremi okolinu",
    task: "Makni upaljače, pepeljare i zalihe cigareta iz svog okruženja.",
    question: "Što ti kod kuće ili na poslu otežava promjenu?",
    note: "Lakše je uspjeti kada smanjiš iskušenja oko sebe.",
    icon: "🏠",
  },
  {
    day: 3,
    title: "Promijeni jutarnju rutinu",
    task: "Uvedi jednu novu malu naviku odmah nakon buđenja — čaša vode, kratka šetnja ili duboko disanje.",
    question: "Što može zamijeniti prvu jutarnju cigaretu?",
    note: "Nova rutina gradi novi identitet. Ti si osoba koja bira zdravlje.",
    icon: "🌅",
  },
  {
    day: 4,
    title: "Prekini automatsku reakciju",
    task: "Svaki put kada osjetiš želju, odgodi je za 3 minute. Samo 3 minute.",
    question: "Koliko je dugo trajala želja kada si je odgodio/la?",
    note: "Žudnja dolazi u valovima i prolazi. Ti si jači/a od nje.",
    icon: "⏱️",
  },
  {
    day: 5,
    title: "Nađi zamjenu",
    task: "Isprobaj zamjene: voda, žvakaća guma, duboko disanje ili kratka šetnja.",
    question: "Koja zamjena ti najviše pomaže?",
    note: "Zamjena nije slabost — to je strategija pobjednika.",
    icon: "🔄",
  },
  {
    day: 6,
    title: "Upravljanje stresom",
    task: "Kada osjetiš stres, koristi 2 minute dubokog disanja umjesto cigarete.",
    question: "Koliko često pušenje povezuješ sa stresom?",
    note: "Smirenje je vještina koja se uči, ne cigareta.",
    icon: "🧘",
  },
  {
    day: 7,
    title: "Nagradi se",
    task: "Pogledaj koliko si novca uštedjeo/la i odvoji dio za nešto lijepo za sebe.",
    question: "Čime se možeš razveseliti ovaj tjedan?",
    note: "Mozak voli nagradu. Daj mu je — zaslužio/la si!",
    icon: "🎁",
  },
  {
    day: 8,
    title: "Ojačaj novi identitet",
    task: "Reci sebi naglas: 'Ja učim živjeti bez cigareta. Svaki dan sam sve bolji/a.'",
    question: "Kako želiš da izgleda tvoja nova svakodnevna rutina?",
    note: "Promjena kreće iz identiteta. Ti već jesi ta osoba.",
    icon: "💫",
  },
  {
    day: 9,
    title: "Priprema za društvene situacije",
    task: "Napravi plan za situacije koje te izazivaju — kava s prijateljem, izlazak, stresni posao.",
    question: "Koja situacija ti je najrizičnija i kako ćeš je riješiti?",
    note: "Plan unaprijed znači manje impulsa u trenutku.",
    icon: "🗺️",
  },
  {
    day: 10,
    title: "Pogledaj koliko si već napravio/la",
    task: "Pregledaj sav napredak — dane, ušteđeni novac, preskočene cigarete.",
    question: "Što si naučio/la o sebi ovih 10 dana?",
    note: "Ovo nije kraj — ovo je novi početak. Nastavi dalje!",
    icon: "🏆",
  },
]

export const DAILY_MOTIVATIONS = [
  "Svaki dan bez cigarete je velika pobjeda.",
  "Manje nego prije već je napredak.",
  "Tvoje tijelo već osjeća promjenu.",
  "Nastavi korak po korak.",
  "Ne trebaš biti savršen/a da bi napredovao/la.",
  "Danas promijeni rutinu uz kavu.",
  "Kad dođe želja, odgodi je 3 minute.",
  "Voda i kratka šetnja mogu pomoći.",
  "Jedna cigareta ne briše sav trud.",
  "I dalje si na pravom putu.",
  "Ovo je ovisnost, ne test savršenstva.",
  "Napredak, ne savršenstvo.",
  "Tvoje tijelo ti zahvaljuje svaki sat.",
  "Svaki preskočeni dim je pobjeda.",
  "Graditi naviku traje — i to je u redu.",
]

export function getDailyMotivation(dayIndex: number): string {
  return DAILY_MOTIVATIONS[dayIndex % DAILY_MOTIVATIONS.length]
}

export const ACHIEVEMENTS = [
  {
    key: "first_24h",
    name: "Prvih 24 sata",
    description: "Proveo/la si cijeli dan bez cigarete!",
    icon: "🌟",
    condition: "1 dan u programu",
  },
  {
    key: "three_days",
    name: "3 dana napretka",
    description: "Tri dana zaredom — to je pravi napredak!",
    icon: "🔥",
    condition: "3 dana u programu",
  },
  {
    key: "first_week",
    name: "Prvi tjedan",
    description: "Cijeli tjedan! Tvoje tijelo se već mijenja.",
    icon: "🏅",
    condition: "7 dana u programu",
  },
  {
    key: "ten_days",
    name: "10 dana programa",
    description: "Završio/la si 10-dnevni reset. Nevjerojatno!",
    icon: "🎯",
    condition: "10 dana u programu",
  },
  {
    key: "first_challenge",
    name: "Prvi izazov",
    description: "Prihvatio/la si izazov i krenuo/la naprijed!",
    icon: "⚡",
    condition: "Pridružio/la se izazovu",
  },
  {
    key: "saved_10_eur",
    name: "Ušteđeno 10 €",
    description: "Već si uštedjeo/la 10 eura. Nastavi!",
    icon: "💰",
    condition: "Ušteđeno 10 €",
  },
  {
    key: "50_skipped",
    name: "50 preskočenih cigareta",
    description: "50 cigareta koje nisi zapalio/la. Tvoja pluća ti hvale!",
    icon: "🫁",
    condition: "50 preskočenih cigareta",
  },
  {
    key: "craving_warrior",
    name: "Borac sa žudnjom",
    description: "Uspješno si prebrodio/la 10 žudnji!",
    icon: "🛡️",
    condition: "10 riješenih žudnji",
  },
]
