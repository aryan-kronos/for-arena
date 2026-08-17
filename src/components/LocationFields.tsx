import { useEffect, useRef, useState } from "react";
import { lookupCity, lookupPincode, type IndiaLocation } from "@/lib/indiaLocation";

export type LocationValue = IndiaLocation;
const empty: LocationValue = { pincode: "", city: "", district: "", state: "", postOffice: "" };

export function LocationFields({ value, onChange, required = false }: { value?: LocationValue; onChange: (value: LocationValue) => void; required?: boolean }) {
  const current = value ?? empty;
  const [suggestions, setSuggestions] = useState<IndiaLocation[]>([]);
  const [status, setStatus] = useState("");
  const [cityEdited, setCityEdited] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  const apply = (location: IndiaLocation) => {
    setCityEdited(false);
    setSuggestions([]);
    setStatus(`Filled from ${location.postOffice || location.pincode}. You can change it.`);
    onChange(location);
  };

  useEffect(() => {
    if (!/^\d{6}$/.test(current.pincode)) return;
    const controller = new AbortController();requestRef.current?.abort();requestRef.current=controller;setStatus("Checking PIN code…");
    void lookupPincode(current.pincode, controller.signal).then((results)=>{if(controller.signal.aborted)return;if(results.length===1)apply(results[0]);else if(results.length>1){setSuggestions(results);apply(results[0]);setSuggestions(results)}else setStatus("No matching PIN code found. Enter the location manually.")}).catch(()=>!controller.signal.aborted&&setStatus("Could not check the PIN code. Enter the location manually."));
    return()=>controller.abort();
    // Only PIN changes should trigger this lookup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[current.pincode]);

  useEffect(()=>{
    if(!cityEdited||current.city.trim().length<3)return;const controller=new AbortController();requestRef.current?.abort();requestRef.current=controller;const timer=window.setTimeout(()=>{setStatus("Finding matching post offices…");void lookupCity(current.city,controller.signal).then(results=>{if(controller.signal.aborted)return;setSuggestions(results);if(results.length){apply(results[0]);setSuggestions(results)}else setStatus("No automatic match. Add the PIN code or complete the fields manually.")}).catch(()=>!controller.signal.aborted&&setStatus("Location lookup is unavailable. Complete the fields manually."))},550);return()=>{window.clearTimeout(timer);controller.abort()};
    // Only user-edited city text should search.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[current.city,cityEdited]);

  const input="hairline w-full bg-paper px-3 py-3 text-[14px] text-ink outline-none focus:border-violet";
  return <fieldset className="mt-5"><legend className="text-[12px] font-bold text-deepviolet">Business location</legend><p className="mt-1 text-[11px] leading-relaxed text-muted">Enter either the city or six-digit PIN code. We will suggest the district, state and post office. A city can have many PIN codes, so always verify the selected area.</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><div><label htmlFor="signup-city" className="mono mb-1.5 block text-[9px] text-muted uppercase">City</label><input id="signup-city" value={current.city} onChange={e=>{setCityEdited(true);onChange({...current,city:e.target.value})}} className={input} required={required} autoComplete="address-level2"/></div><div><label htmlFor="signup-pincode" className="mono mb-1.5 block text-[9px] text-muted uppercase">PIN code</label><input id="signup-pincode" value={current.pincode} onChange={e=>{setCityEdited(false);onChange({...current,pincode:e.target.value.replace(/\D/g,"").slice(0,6)})}} className={input} required={required} inputMode="numeric" autoComplete="postal-code"/></div><div><label htmlFor="signup-district" className="mono mb-1.5 block text-[9px] text-muted uppercase">District</label><input id="signup-district" value={current.district} onChange={e=>onChange({...current,district:e.target.value})} className={input}/></div><div><label htmlFor="signup-state" className="mono mb-1.5 block text-[9px] text-muted uppercase">State</label><input id="signup-state" value={current.state} onChange={e=>onChange({...current,state:e.target.value})} className={input} autoComplete="address-level1"/></div></div>{suggestions.length>1&&<div className="mt-3"><label htmlFor="signup-postoffice" className="mono mb-1.5 block text-[9px] text-muted uppercase">Area / post office</label><select id="signup-postoffice" className={input} value={`${current.postOffice}|${current.pincode}`} onChange={e=>{const selected=suggestions.find(x=>`${x.postOffice}|${x.pincode}`===e.target.value);if(selected)apply(selected)}}>{suggestions.map(x=><option key={`${x.postOffice}-${x.pincode}`} value={`${x.postOffice}|${x.pincode}`}>{x.postOffice} · {x.pincode}</option>)}</select></div>}<p aria-live="polite" className="mt-2 text-[11px] text-violet">{status}</p></fieldset>;
}
