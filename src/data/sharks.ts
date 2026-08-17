export interface SharkCard {
  id: string;
  title: string;
  scientificName: string;
  caption: string;
  file: string;
}

export const SHARKS: SharkCard[] = [
  {
    id: 'great-white',
    title: 'Great white shark',
    scientificName: 'Carcharodon carcharias',
    caption: 'Apex coastal and pelagic hunter. Often associated with seal colonies and temperate shelves.',
    file: 'great-white.svg',
  },
  {
    id: 'hammerhead',
    title: 'Scalloped hammerhead',
    scientificName: 'Sphyrna lewini',
    caption: 'Schooling hammerhead that uses coastal seamounts and warm productive waters.',
    file: 'hammerhead.svg',
  },
  {
    id: 'tiger',
    title: 'Tiger shark',
    scientificName: 'Galeocerdo cuvier',
    caption: 'Coastal generalist found around islands, reefs, and turbid shelves.',
    file: 'tiger.svg',
  },
  {
    id: 'whitetip',
    title: 'Whitetip reef shark',
    scientificName: 'Triaenodon obesus',
    caption: 'Reef-associated shark that rests in caves and forages on coral slopes.',
    file: 'whitetip.svg',
  },
  {
    id: 'bull',
    title: 'Bull shark',
    scientificName: 'Carcharhinus leucas',
    caption: 'Coastal shark that can enter estuaries. Not a freshwater “hotspot” product in FINDS.',
    file: 'bull.svg',
  },
  {
    id: 'mako',
    title: 'Shortfin mako',
    scientificName: 'Isurus oxyrinchus',
    caption: 'Fast offshore lamnid associated with warmer pelagic prey fields.',
    file: 'mako.svg',
  },
];
