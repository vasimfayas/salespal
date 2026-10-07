/**
 * Ports, airports and road points used to pick an enquiry's From / To.
 * Seaports carry their UN/LOCODE, airports their IATA code. Pure data, safe on client and server.
 * The enquiry stores the label ("Jebel Ali, United Arab Emirates") as plain text, so places that
 * aren't listed can still be typed in.
 */

export type LocationKind = "port" | "airport" | "land";

export type FreightLocation = {
  name: string;
  code?: string;
  kind: LocationKind;
  country: string;
  countryCode: string;
  /** Extra words people search with (old names, city, abbreviations). */
  aliases?: string[];
};

type CountryDef = {
  country: string;
  code: string;
  aliases?: string[];
  ports?: [name: string, code: string, aliases?: string[]][];
  airports?: [name: string, code: string, aliases?: string[]][];
  land?: [name: string, aliases?: string[]][];
};

const COUNTRIES: CountryDef[] = [
  // ── Gulf & Middle East ──
  {
    country: "Qatar", code: "QA",
    ports: [["Hamad Port", "QAHMD", ["doha", "new port"]], ["Doha Port", "QADOH"], ["Mesaieed Port", "QAMES", ["umm said"]], ["Ras Laffan Port", "QARLF"]],
    airports: [["Hamad International Airport", "DOH", ["doha"]]],
    land: [["Abu Samra Border", ["salwa", "saudi border"]], ["Doha", ["doha city"]], ["Mesaieed Industrial City"], ["Ras Laffan Industrial City"]],
  },
  {
    country: "United Arab Emirates", code: "AE", aliases: ["uae", "emirates"],
    ports: [["Jebel Ali", "AEJEA", ["dubai"]], ["Port Rashid", "AEPRA", ["dubai"]], ["Khalifa Port", "AEKHL", ["abu dhabi"]], ["Mina Zayed", "AEMZD", ["abu dhabi"]], ["Port Khalid", "AESHJ", ["sharjah"]], ["Khor Fakkan", "AEKLF"], ["Fujairah", "AEFJR"]],
    airports: [["Dubai International Airport", "DXB"], ["Dubai World Central", "DWC", ["al maktoum"]], ["Abu Dhabi International Airport", "AUH"], ["Sharjah International Airport", "SHJ"]],
    land: [["Ghuwaifat Border", ["saudi border"]], ["Dubai"], ["Abu Dhabi"], ["Sharjah"]],
  },
  {
    country: "Saudi Arabia", code: "SA", aliases: ["ksa"],
    ports: [["Jeddah Islamic Port", "SAJED"], ["King Abdulaziz Port", "SADMM", ["dammam"]], ["Jubail Commercial Port", "SAJUB"], ["King Abdullah Port", "SAKAC", ["rabigh"]], ["Yanbu Commercial Port", "SAYNB"]],
    airports: [["King Khalid International Airport", "RUH", ["riyadh"]], ["King Abdulaziz International Airport", "JED", ["jeddah"]], ["King Fahd International Airport", "DMM", ["dammam"]]],
    land: [["Salwa Border", ["qatar border", "abu samra"]], ["Riyadh"], ["Dammam"], ["Jeddah"], ["King Fahd Causeway", ["bahrain"]]],
  },
  {
    country: "Oman", code: "OM",
    ports: [["Sohar Port", "OMSOH"], ["Port of Salalah", "OMSLL"], ["Port Sultan Qaboos", "OMMCT", ["muscat"]], ["Port of Duqm", "OMDQM"]],
    airports: [["Muscat International Airport", "MCT"]],
    land: [["Muscat"], ["Sohar"]],
  },
  {
    country: "Kuwait", code: "KW",
    ports: [["Shuwaikh Port", "KWSWK"], ["Shuaiba Port", "KWSAA"]],
    airports: [["Kuwait International Airport", "KWI"]],
    land: [["Kuwait City"]],
  },
  {
    country: "Bahrain", code: "BH",
    ports: [["Khalifa Bin Salman Port", "BHKBS"]],
    airports: [["Bahrain International Airport", "BAH"]],
    land: [["Manama"]],
  },
  { country: "Iraq", code: "IQ", ports: [["Umm Qasr", "IQUQR"]], airports: [["Basra International Airport", "BSR"], ["Baghdad International Airport", "BGW"]] },
  { country: "Jordan", code: "JO", ports: [["Aqaba", "JOAQJ"]], airports: [["Queen Alia International Airport", "AMM", ["amman"]]], land: [["Amman"]] },
  {
    country: "Egypt", code: "EG",
    ports: [["Port Said", "EGPSD"], ["Alexandria", "EGALY"], ["Ain Sokhna", "EGSOK"], ["Damietta", "EGDAM"]],
    airports: [["Cairo International Airport", "CAI"]],
  },
  {
    country: "Turkey", code: "TR", aliases: ["turkiye"],
    ports: [["Mersin", "TRMER"], ["Ambarli", "TRAMR", ["istanbul"]], ["Izmir", "TRIZM"]],
    airports: [["Istanbul Airport", "IST"]],
  },

  // ── South Asia ──
  {
    country: "India", code: "IN",
    ports: [["Nhava Sheva (JNPT)", "INNSA", ["jnpt", "mumbai", "jawaharlal nehru"]], ["Mundra", "INMUN"], ["Chennai", "INMAA", ["madras"]], ["Kolkata", "INCCU", ["calcutta"]], ["Cochin", "INCOK", ["kochi"]], ["Visakhapatnam", "INVTZ", ["vizag"]], ["Tuticorin", "INTUT"]],
    airports: [["Mumbai Airport", "BOM"], ["Delhi Airport", "DEL", ["new delhi"]], ["Chennai Airport", "MAA"], ["Bengaluru Airport", "BLR", ["bangalore"]], ["Hyderabad Airport", "HYD"], ["Kochi Airport", "COK", ["cochin"]]],
  },
  {
    country: "Pakistan", code: "PK",
    ports: [["Karachi", "PKKHI"], ["Port Qasim", "PKBQM"]],
    airports: [["Karachi Airport", "KHI"], ["Lahore Airport", "LHE"]],
  },
  { country: "Sri Lanka", code: "LK", ports: [["Colombo", "LKCMB"]], airports: [["Colombo Airport", "CMB", ["bandaranaike"]]] },
  { country: "Bangladesh", code: "BD", ports: [["Chittagong", "BDCGP", ["chattogram"]]], airports: [["Dhaka Airport", "DAC"]] },

  // ── East & Southeast Asia ──
  {
    country: "China", code: "CN",
    ports: [["Shanghai", "CNSHA"], ["Ningbo", "CNNGB"], ["Yantian", "CNYTN", ["shenzhen"]], ["Shekou", "CNSHK", ["shenzhen"]], ["Nansha", "CNNSA", ["guangzhou"]], ["Qingdao", "CNTAO"], ["Tianjin (Xingang)", "CNTXG"], ["Xiamen", "CNXMN"], ["Dalian", "CNDLC"]],
    airports: [["Shanghai Pudong Airport", "PVG"], ["Beijing Capital Airport", "PEK"], ["Guangzhou Baiyun Airport", "CAN"], ["Shenzhen Airport", "SZX"]],
  },
  { country: "Hong Kong", code: "HK", ports: [["Hong Kong", "HKHKG"]], airports: [["Hong Kong International Airport", "HKG"]] },
  { country: "Taiwan", code: "TW", ports: [["Kaohsiung", "TWKHH"]], airports: [["Taoyuan International Airport", "TPE", ["taipei"]]] },
  { country: "South Korea", code: "KR", aliases: ["korea"], ports: [["Busan", "KRPUS", ["pusan"]], ["Incheon", "KRINC"]], airports: [["Incheon International Airport", "ICN", ["seoul"]]] },
  {
    country: "Japan", code: "JP",
    ports: [["Tokyo", "JPTYO"], ["Yokohama", "JPYOK"], ["Kobe", "JPUKB"], ["Nagoya", "JPNGO"]],
    airports: [["Narita International Airport", "NRT", ["tokyo"]], ["Kansai International Airport", "KIX", ["osaka"]]],
  },
  { country: "Singapore", code: "SG", ports: [["Singapore", "SGSIN"]], airports: [["Changi Airport", "SIN", ["singapore"]]] },
  {
    country: "Malaysia", code: "MY",
    ports: [["Port Klang", "MYPKG"], ["Tanjung Pelepas", "MYTPP"], ["Penang", "MYPEN"]],
    airports: [["Kuala Lumpur International Airport", "KUL"]],
  },
  { country: "Thailand", code: "TH", ports: [["Laem Chabang", "THLCH"], ["Bangkok", "THBKK"]], airports: [["Suvarnabhumi Airport", "BKK", ["bangkok"]]] },
  {
    country: "Vietnam", code: "VN", aliases: ["viet nam"],
    ports: [["Ho Chi Minh City (Cat Lai)", "VNSGN", ["saigon"]], ["Hai Phong", "VNHPH"]],
    airports: [["Tan Son Nhat Airport", "SGN", ["ho chi minh"]], ["Noi Bai Airport", "HAN", ["hanoi"]]],
  },
  { country: "Indonesia", code: "ID", ports: [["Jakarta (Tanjung Priok)", "IDJKT"], ["Surabaya", "IDSUB"]], airports: [["Soekarno-Hatta Airport", "CGK", ["jakarta"]]] },
  { country: "Philippines", code: "PH", ports: [["Manila", "PHMNL"]], airports: [["Ninoy Aquino Airport", "MNL", ["manila"]]] },

  // ── Europe ──
  { country: "Germany", code: "DE", ports: [["Hamburg", "DEHAM"], ["Bremerhaven", "DEBRV"]], airports: [["Frankfurt Airport", "FRA"]] },
  { country: "Netherlands", code: "NL", aliases: ["holland"], ports: [["Rotterdam", "NLRTM"]], airports: [["Amsterdam Schiphol Airport", "AMS"]] },
  { country: "Belgium", code: "BE", ports: [["Antwerp", "BEANR"]], airports: [["Brussels Airport", "BRU"], ["Liège Airport", "LGG"]] },
  {
    country: "United Kingdom", code: "GB", aliases: ["uk", "england", "britain"],
    ports: [["Felixstowe", "GBFXT"], ["Southampton", "GBSOU"], ["London Gateway", "GBLGP"]],
    airports: [["London Heathrow Airport", "LHR"]],
  },
  { country: "France", code: "FR", ports: [["Le Havre", "FRLEH"], ["Marseille", "FRMRS"]], airports: [["Paris Charles de Gaulle Airport", "CDG"]] },
  { country: "Spain", code: "ES", ports: [["Valencia", "ESVLC"], ["Algeciras", "ESALG"], ["Barcelona", "ESBCN"]], airports: [["Madrid Barajas Airport", "MAD"]] },
  { country: "Italy", code: "IT", ports: [["Genoa", "ITGOA"], ["La Spezia", "ITSPE"], ["Gioia Tauro", "ITGIT"]], airports: [["Milan Malpensa Airport", "MXP"]] },
  { country: "Greece", code: "GR", ports: [["Piraeus", "GRPIR"]], airports: [["Athens Airport", "ATH"]] },

  // ── Africa ──
  { country: "South Africa", code: "ZA", ports: [["Durban", "ZADUR"], ["Cape Town", "ZACPT"]], airports: [["Johannesburg O. R. Tambo Airport", "JNB"]] },
  { country: "Kenya", code: "KE", ports: [["Mombasa", "KEMBA"]], airports: [["Nairobi Jomo Kenyatta Airport", "NBO"]] },
  { country: "Tanzania", code: "TZ", ports: [["Dar es Salaam", "TZDAR"]] },
  { country: "Djibouti", code: "DJ", ports: [["Djibouti", "DJJIB"]] },
  { country: "Nigeria", code: "NG", ports: [["Lagos (Apapa)", "NGAPP"]], airports: [["Lagos Murtala Muhammed Airport", "LOS"]] },
  { country: "Morocco", code: "MA", ports: [["Tanger Med", "MAPTM"]], airports: [["Casablanca Mohammed V Airport", "CMN"]] },

  // ── Americas & Oceania ──
  {
    country: "United States", code: "US", aliases: ["usa", "america"],
    ports: [["Los Angeles", "USLAX"], ["Long Beach", "USLGB"], ["New York / New Jersey", "USNYC"], ["Savannah", "USSAV"], ["Houston", "USHOU"]],
    airports: [["New York JFK Airport", "JFK"], ["Los Angeles Airport", "LAX"], ["Chicago O'Hare Airport", "ORD"], ["Miami Airport", "MIA"]],
  },
  { country: "Canada", code: "CA", ports: [["Vancouver", "CAVAN"]], airports: [["Toronto Pearson Airport", "YYZ"]] },
  { country: "Brazil", code: "BR", ports: [["Santos", "BRSSZ"]], airports: [["São Paulo Guarulhos Airport", "GRU"]] },
  { country: "Australia", code: "AU", ports: [["Melbourne", "AUMEL"], ["Sydney", "AUSYD"]], airports: [["Sydney Airport", "SYD"]] },
];

export const FREIGHT_LOCATIONS: (FreightLocation & { search: string })[] = COUNTRIES.flatMap((c) => {
  const base = { country: c.country, countryCode: c.code };
  const rows: FreightLocation[] = [
    ...(c.ports ?? []).map(([name, code, aliases]) => ({ ...base, name, code, kind: "port" as const, aliases })),
    ...(c.airports ?? []).map(([name, code, aliases]) => ({ ...base, name, code, kind: "airport" as const, aliases })),
    ...(c.land ?? []).map(([name, aliases]) => ({ ...base, name, kind: "land" as const, aliases })),
  ];
  return rows.map((r) => ({
    ...r,
    search: [r.name, r.code, r.country, r.countryCode, ...(r.aliases ?? []), ...(c.aliases ?? [])].filter(Boolean).join(" ").toLowerCase(),
  }));
});

/** Text stored on the enquiry for a picked location. */
export function locationLabel(l: FreightLocation) {
  return `${l.name}, ${l.country}`;
}

/** Which kind of place suits a transport mode. */
export const KIND_FOR_MODE: Record<string, LocationKind> = { sea: "port", air: "airport", land: "land" };
