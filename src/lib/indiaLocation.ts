export type IndiaLocation = {
  pincode: string;
  city: string;
  district: string;
  state: string;
  postOffice: string;
};

type PostalApiOffice = {
  Name?: string;
  District?: string;
  State?: string;
  Pincode?: string;
  Block?: string;
};

type PostalApiResponse = {
  Status?: string;
  PostOffice?: PostalApiOffice[] | null;
};

const FALLBACK: Record<string, IndiaLocation[]> = {
  patna: [{ pincode: "800001", city: "Patna", district: "Patna", state: "Bihar", postOffice: "Patna GPO" }],
  delhi: [{ pincode: "110001", city: "New Delhi", district: "New Delhi", state: "Delhi", postOffice: "New Delhi GPO" }],
  mumbai: [{ pincode: "400001", city: "Mumbai", district: "Mumbai", state: "Maharashtra", postOffice: "Mumbai GPO" }],
  bengaluru: [{ pincode: "560001", city: "Bengaluru", district: "Bengaluru", state: "Karnataka", postOffice: "Bengaluru GPO" }],
  bangalore: [{ pincode: "560001", city: "Bengaluru", district: "Bengaluru", state: "Karnataka", postOffice: "Bengaluru GPO" }],
  kolkata: [{ pincode: "700001", city: "Kolkata", district: "Kolkata", state: "West Bengal", postOffice: "Kolkata GPO" }],
  chennai: [{ pincode: "600001", city: "Chennai", district: "Chennai", state: "Tamil Nadu", postOffice: "Chennai GPO" }],
  hyderabad: [{ pincode: "500001", city: "Hyderabad", district: "Hyderabad", state: "Telangana", postOffice: "Hyderabad GPO" }],
};

const cityFromOffice = (office: PostalApiOffice) => office.Block?.trim() || office.District?.trim() || office.Name?.replace(/\s+(GPO|H\.O|S\.O|B\.O)$/i, "").trim() || "";
const convert = (office: PostalApiOffice): IndiaLocation => ({
  pincode: office.Pincode?.trim() || "",
  city: cityFromOffice(office),
  district: office.District?.trim() || "",
  state: office.State?.trim() || "",
  postOffice: office.Name?.trim() || "",
});

const cache = new Map<string, IndiaLocation[]>();
async function request(path: string, signal?: AbortSignal) {
  const key = path.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;
  const response = await fetch(`https://api.postalpincode.in/${path}`, { signal });
  if (!response.ok) throw new Error("Location service is temporarily unavailable.");
  const payload = (await response.json()) as PostalApiResponse[];
  const locations = (payload[0]?.PostOffice || []).map(convert).filter((item) => item.pincode && item.state);
  cache.set(key, locations);
  return locations;
}

export async function lookupPincode(pincode: string, signal?: AbortSignal) {
  if (!/^\d{6}$/.test(pincode)) return [];
  try {
    return await request(`pincode/${pincode}`, signal);
  } catch {
    return Object.values(FALLBACK).flat().filter((item) => item.pincode === pincode);
  }
}

export async function lookupCity(city: string, signal?: AbortSignal) {
  const query = city.trim();
  if (query.length < 3) return [];
  const q = query.toLowerCase();
  const local = FALLBACK[q] || [];
  try {
    const remote = await request(`postoffice/${encodeURIComponent(query)}`, signal);
    const scored = remote
      .map((item) => {
        const cityName = item.city.toLowerCase();
        const district = item.district.toLowerCase();
        const office = item.postOffice.toLowerCase();
        const score =
          (cityName === q ? 8 : cityName.includes(q) ? 3 : 0) +
          (district === q ? 7 : district.includes(q) ? 2 : 0) +
          (office.startsWith(q) ? 5 : office.includes(q) ? 1 : 0);
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
    const combined = [...local, ...scored];
    return combined.filter((item, index) => combined.findIndex((candidate) => candidate.pincode === item.pincode && candidate.postOffice === item.postOffice) === index).slice(0, 12);
  } catch {
    return local;
  }
}
