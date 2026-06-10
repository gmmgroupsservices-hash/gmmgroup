import { getAllStates, getDistricts } from "india-state-district";

const STATES = getAllStates();
const STATE_BY_CODE = new Map(STATES.map((state) => [state.code.toLowerCase(), state]));
const STATE_BY_NAME = new Map(STATES.map((state) => [state.name.toLowerCase(), state]));

export const INDIA_STATE_OPTIONS = STATES;

export const getStateCode = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  return STATE_BY_CODE.get(normalized)?.code || STATE_BY_NAME.get(normalized)?.code || value.trim().toUpperCase();
};

export const getStateName = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  return STATE_BY_CODE.get(normalized)?.name || STATE_BY_NAME.get(normalized)?.name || value;
};

export const getDistrictOptionsForState = (stateValue: string) => {
  const stateCode = getStateCode(stateValue);
  if (!stateCode) return [];
  return getDistricts(stateCode);
};

const LOCALITIES_BY_DISTRICT: Record<string, string[]> = {
  hyderabad: [
    "Jubilee Hills",
    "Banjara Hills",
    "Gachibowli",
    "Kondapur",
    "Madhapur",
    "HITEC City",
    "Kokapet",
    "Narsingi",
    "Tellapur",
    "Manikonda",
    "Financial District",
    "Miyapur",
    "Kukatpally",
    "Secunderabad",
    "Shamshabad"
  ],
  bengaluru: [
    "Whitefield",
    "Indiranagar",
    "Koramangala",
    "Electronic City",
    "Sarjapur Road",
    "HSR Layout",
    "Hebbal",
    "Jayanagar",
    "Yelahanka",
    "Marathahalli",
    "Bannerghatta Road",
    "Devanahalli",
    "Thanisandra",
    "Bellandur"
  ],
  bangalore: [
    "Whitefield",
    "Indiranagar",
    "Koramangala",
    "Electronic City",
    "Sarjapur Road",
    "HSR Layout",
    "Hebbal",
    "Jayanagar",
    "Yelahanka",
    "Marathahalli",
    "Bannerghatta Road",
    "Devanahalli",
    "Thanisandra",
    "Bellandur"
  ],
  visakhapatnam: [
    "MVP Colony",
    "Madhurawada",
    "Rushikonda",
    "Gajuwaka",
    "Seethammadhara",
    "Dwaraka Nagar",
    "Akkayyapalem",
    "Yendada",
    "PM Palem",
    "Beach Road"
  ],
  vijayawada: [
    "Benz Circle",
    "Kanuru",
    "Poranki",
    "Patamata",
    "Governorpet",
    "Gollapudi",
    "Tadepalli",
    "Ibrahimpatnam",
    "Auto Nagar",
    "Bhavanipuram"
  ],
  mumbai: [
    "Andheri",
    "Bandra",
    "Worli",
    "Lower Parel",
    "Powai",
    "Goregaon",
    "Malad",
    "Thane",
    "Navi Mumbai",
    "Chembur",
    "Juhu",
    "Borivali"
  ],
  pune: [
    "Hinjewadi",
    "Kharadi",
    "Baner",
    "Wakad",
    "Hadapsar",
    "Viman Nagar",
    "Koregaon Park",
    "Magarpatta",
    "Kalyani Nagar",
    "Undri"
  ],
  chennai: [
    "Anna Nagar",
    "Adyar",
    "OMR",
    "Velachery",
    "T Nagar",
    "Porur",
    "Tambaram",
    "Sholinganallur",
    "Medavakkam",
    "Guindy"
  ],
  delhi: [
    "Dwarka",
    "Rohini",
    "Saket",
    "Vasant Kunj",
    "Karol Bagh",
    "Lajpat Nagar",
    "Greater Kailash",
    "Janakpuri",
    "Pitampura",
    "Connaught Place"
  ],
  gurugram: [
    "DLF Phase 1",
    "DLF Phase 2",
    "Golf Course Road",
    "Sohna Road",
    "Sector 56",
    "Sector 57",
    "New Gurgaon",
    "Cyber City",
    "MG Road",
    "Palam Vihar"
  ],
  noida: [
    "Sector 62",
    "Sector 75",
    "Sector 76",
    "Sector 137",
    "Noida Extension",
    "Greater Noida West",
    "Pari Chowk",
    "Yamuna Expressway",
    "Sector 150",
    "Sector 18"
  ]
};

export const getLocalityOptionsForDistrict = (_stateValue: string, districtValue: string) => {
  const key = districtValue.trim().toLowerCase();
  if (!key) return [];
  return LOCALITIES_BY_DISTRICT[key] ?? [];
};
