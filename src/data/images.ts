/**
 * Image library.
 *
 * Every photograph in this project comes from Wikimedia Commons and is used
 * under a Creative Commons licence. The full attribution for each image is
 * stored alongside it and rendered in the interface, as the licences require.
 *
 * Photographs were chosen because they show the real places that the
 * eclipse passes over. Nothing here is generated, and no image is a mock-up
 * of a place that does not exist.
 *
 * Source: https://commons.wikimedia.org
 */

export interface ImageAsset {
  /** Stable key used to reference the asset. */
  key: string;
  /** Direct URL of the original file on Wikimedia Commons. */
  url: string;
  /** Intrinsic width in pixels. */
  width: number;
  /** Intrinsic height in pixels. */
  height: number;
  /** Alternative text describing the content of the photograph. */
  alt: string;
  /** Name of the photographer or the uploading user. */
  author: string;
  /** Short licence identifier, for example "CC BY-SA 4.0". */
  license: string;
  /** URL of the licence text. */
  licenseUrl: string;
  /** URL of the Commons file description page. */
  page: string;
}

export const images: Record<string, ImageAsset> = {
  tozeurSunset: {
    key: "tozeurSunset",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/85/Tozeur_Oasis_at_sunset.jpg",
    width: 1600,
    height: 1061,
    alt: "Sunset over the palm groves of the Tozeur oasis in southern Tunisia.",
    author: "Cyril Romier",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Tozeur_Oasis_at_sunset.jpg",
  },
  tozeurPalmGrove: {
    key: "tozeurPalmGrove",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Inside_Tozeur_Oasis_03.jpg/1920px-Inside_Tozeur_Oasis_03.jpg",
    width: 1600,
    height: 1205,
    alt: "Date palms inside the Tozeur oasis.",
    author: "Houss 2020",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    page: "https://commons.wikimedia.org/wiki/File:Inside_Tozeur_Oasis_03.jpg",
  },
  tozeurPalm: {
    key: "tozeurPalm",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/12/Palm_tree_in_Tozeur%2C_Tunisia.JPG",
    width: 1600,
    height: 2133,
    alt: "A single date palm rising above the Tozeur oasis.",
    author: "Wikimedia Commons contributor",
    license: "CC BY-SA 3.0",
    licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
    page: "https://commons.wikimedia.org/wiki/File:Palm_tree_in_Tozeur,_Tunisia.JPG",
  },
  chottElJerid: {
    key: "chottElJerid",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Chott_el-Jerid_1117.jpg/1920px-Chott_el-Jerid_1117.jpg",
    width: 1600,
    height: 1200,
    alt: "The salt flats of Chott el Jerid under an open sky.",
    author: "Gorik Francois",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Chott_el-Jerid_1117.jpg",
  },
  chottElJeridSalt: {
    key: "chottElJeridSalt",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Tunisia-3901_-_Chott_el_Jerid_%288032314619%29.jpg/1920px-Tunisia-3901_-_Chott_el_Jerid_%288032314619%29.jpg",
    width: 1600,
    height: 1063,
    alt: "White salt crust stretching to the horizon at Chott el Jerid.",
    author: "Dennis G. Jarvis",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Tunisia-3901_-_Chott_el_Jerid_(8032314619).jpg",
  },
  sidiBouSaid: {
    key: "sidiBouSaid",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/74/Sidi_Bou_Said_02.jpg",
    width: 1600,
    height: 1069,
    alt: "White and blue houses of Sidi Bou Said above the Gulf of Tunis.",
    author: "Rene Cortin",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Sidi_Bou_Said_02.jpg",
  },
  sidiBouSaidCoast: {
    key: "sidiBouSaidCoast",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Sidi_Bou_Said_01.jpg",
    width: 1600,
    height: 1069,
    alt: "Café terrace and coastal view in Sidi Bou Said.",
    author: "Rene Cortin",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Sidi_Bou_Said_01.jpg",
  },
  sidiBouSaidAlley: {
    key: "sidiBouSaidAlley",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Sidi_Bou_Said_Allee.jpg",
    width: 1600,
    height: 2133,
    alt: "A narrow blue-and-white alley in Sidi Bou Said.",
    author: "Amy Keus",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Sidi_Bou_Said_Allee.jpg",
  },
  kairouanMosque: {
    key: "kairouanMosque",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Great_Mosque_of_Kairouan_Panorama_-_Grande_Mosqu%C3%A9e_de_Kairouan_Panorama.jpg",
    width: 1600,
    height: 1108,
    alt: "Panorama of the Great Mosque of Kairouan and its courtyard.",
    author: "Marek Szarejko",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Kairouan_Panorama_-_Grande_Mosqu%C3%A9e_de_Kairouan_Panorama.jpg",
  },
  kairouanMinaret: {
    key: "kairouanMinaret",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/The_Minaret_of_the_Great_Mosque_Okba_of_Kairouan%2C_Tunisia.jpg/1920px-The_Minaret_of_the_Great_Mosque_Okba_of_Kairouan%2C_Tunisia.jpg",
    width: 1600,
    height: 1067,
    alt: "The minaret of the Great Mosque of Kairouan.",
    author: "Monaam Ben Fredj",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:The_Minaret_of_the_Great_Mosque_Okba_of_Kairouan,_Tunisia.jpg",
  },
  carthageBaths: {
    key: "carthageBaths",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/01996_01434_Ruins_of_Antonine_Baths_at_Carthage.jpg/1920px-01996_01434_Ruins_of_Antonine_Baths_at_Carthage.jpg",
    width: 1600,
    height: 1066,
    alt: "Ruins of the Antonine Baths at Carthage.",
    author: "Silar",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:01996_01434_Ruins_of_Antonine_Baths_at_Carthage.jpg",
  },
  carthageRuins: {
    key: "carthageRuins",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Ruins_in_Carthage.jpg/1920px-Ruins_in_Carthage.jpg",
    width: 1600,
    height: 912,
    alt: "Archaeological ruins at Carthage.",
    author: "Safa Heraghi",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Ruins_in_Carthage.jpg",
  },
  mahdiaBeach: {
    key: "mahdiaBeach",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Mahdia_Beach_-_Plage_Mahdia_-_El_Skala_1.jpg",
    width: 4032,
    height: 3024,
    alt: "The beach and old town of Mahdia on the Gulf of Hammamet.",
    author: "Jihed M'hamed",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    page: "https://commons.wikimedia.org/wiki/File:Mahdia_Beach_-_Plage_Mahdia_-_El_Skala_1.jpg",
  },
  djerbaBeach: {
    key: "djerbaBeach",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/10/Djerba_beach-kleche.jpg",
    width: 3648,
    height: 2056,
    alt: "A quiet white-sand beach on the island of Djerba.",
    author: "Philippe Heckel",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Djerba_beach-kleche.jpg",
  },
  djerbaArcades: {
    key: "djerbaArcades",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Houmt_Souk-street_arcades-Al%40in76.jpg/1920px-Houmt_Souk-street_arcades-Al%40in76.jpg",
    width: 1600,
    height: 1197,
    alt: "Arcaded street in Houmt Souk on the island of Djerba.",
    author: "Alain Feulvarch",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Houmt_Souk-street_arcades-Al@in76.jpg",
  },
  djerbaCeramics: {
    key: "djerbaCeramics",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Houmt_Souk-ceramics-katinalynn.jpg/1920px-Houmt_Souk-ceramics-katinalynn.jpg",
    width: 1600,
    height: 1063,
    alt: "Handmade pottery sold in the markets of Houmt Souk.",
    author: "Katina Rogers",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Houmt_Souk-ceramics-katinalynn.jpg",
  },
  matmata: {
    key: "matmata",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Matmata_-_panoramio_%2814%29.jpg/1920px-Matmata_-_panoramio_%2814%29.jpg",
    width: 1600,
    height: 996,
    alt: "Earthen houses of the Berber village of Matmata.",
    author: "Tanya Dedyukhina",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Matmata_-_panoramio_(14).jpg",
  },
  sousseMedina: {
    key: "sousseMedina",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Medina_of_Sousse%2C_Sousse_Governorate%2C_Tunisia%2C_January_2024_-_Street.jpg/1920px-Medina_of_Sousse%2C_Sousse_Governorate%2C_Tunisia%2C_January_2024_-_Street.jpg",
    width: 1600,
    height: 1200,
    alt: "A street in the medina of Sousse.",
    author: "Sharon Hahn Darlin",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Medina_of_Sousse,_Sousse_Governorate,_Tunisia,_January_2024_-_Street.jpg",
  },
  sousseRibat: {
    key: "sousseRibat",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Medina_of_Sousse%2C_Sousse_Governorate%2C_Tunisia%2C_January_2024_-_Ribat_Fortress.jpg/1920px-Medina_of_Sousse%2C_Sousse_Governorate%2C_Tunisia%2C_January_2024_-_Ribat_Fortress.jpg",
    width: 1600,
    height: 1200,
    alt: "The Ribat fortress of Sousse, an eighth-century fort.",
    author: "Sharon Hahn Darlin",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Medina_of_Sousse,_Sousse_Governorate,_Tunisia,_January_2024_-_Ribat_Fortress.jpg",
  },
  sousseRampart: {
    key: "sousseRampart",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Medina_of_Sousse%2C_Sousse_Governorate%2C_Tunisia%2C_January_2024_-_Rampart_walkway.jpg/1920px-Medina_of_Sousse%2C_Sousse_Governorate%2C_Tunisia%2C_January_2024_-_Rampart_walkway.jpg",
    width: 1600,
    height: 1200,
    alt: "Walkway along the ramparts of the medina of Sousse.",
    author: "Sharon Hahn Darlin",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    page: "https://commons.wikimedia.org/wiki/File:Medina_of_Sousse,_Sousse_Governorate,_Tunisia,_January_2024_-_Rampart_walkway.jpg",
  },
  elDjem: {
    key: "elDjem",
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Amphitheater_at_El_Djem.jpg/1920px-Amphitheater_at_El_Djem.jpg",
    width: 1600,
    height: 1067,
    alt: "The Roman amphitheatre of El Djem.",
    author: "Agnieszka Wolska",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    page: "https://commons.wikimedia.org/wiki/File:Amphitheater_at_El_Djem.jpg",
  },
};

export function getImage(key: string): ImageAsset {
  const asset = images[key];
  if (!asset) {
    throw new Error(`Unknown image: ${key}`);
  }
  return asset;
}

/** A one-line attribution string, for example "Cyril Romier, CC BY 2.0". */
export function imageCredit(asset: ImageAsset): string {
  return `${asset.author} · ${asset.license}`;
}
