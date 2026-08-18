import { useState, useEffect, type ChangeEvent } from "react";

export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "NP", name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
  { code: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
];

interface Props {
  id?: string;
  value: string;
  onChange: (fullNumber: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function PhoneCountryInput({
  id = "phone-input",
  value,
  onChange,
  disabled = false,
  required = true,
  className = "",
  placeholder = "98765 43210",
  autoFocus = false,
}: Props) {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]); // Default: India (+91)
  const [localNumber, setLocalNumber] = useState("");

  // Initialize and sync
  useEffect(() => {
    if (!value) {
      setLocalNumber("");
      return;
    }
    // Check if value starts with a known dial code
    const matched = COUNTRIES.find((c) => value.startsWith(c.dialCode));
    if (matched) {
      setSelectedCountry(matched);
      setLocalNumber(value.slice(matched.dialCode.length).trim());
    } else {
      setLocalNumber(value.replace(/^\+?91/, "").trim());
    }
  }, []);

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const next = COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0];
    setSelectedCountry(next);
    const cleaned = localNumber.replace(/\D/g, "");
    onChange(cleaned ? `${next.dialCode}${cleaned}` : "");
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "");
    setLocalNumber(digits);
    onChange(digits ? `${selectedCountry.dialCode}${digits}` : "");
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Country Selector */}
      <div className="relative flex shrink-0 items-center border-r border-line bg-ivory/60 hover:bg-ivory transition-colors">
        <label htmlFor={`${id}-country`} className="sr-only">
          Country Code
        </label>
        <select
          id={`${id}-country`}
          value={selectedCountry.code}
          onChange={handleCountryChange}
          disabled={disabled}
          className="cursor-pointer appearance-none bg-transparent py-3.5 pl-3 pr-7 text-[13px] font-bold text-deepviolet outline-none disabled:opacity-60"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code} className="bg-white text-ink py-1">
              {c.flag} {c.dialCode} ({c.name})
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 text-[10px] text-violet opacity-60">▼</span>
      </div>

      {/* Local Phone Input */}
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={localNumber}
        onChange={handleNumberChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="hairline -ml-px w-full bg-paper py-3.5 px-4 text-[15px] font-medium text-ink outline-none focus:border-violet disabled:opacity-60"
      />
    </div>
  );
}
