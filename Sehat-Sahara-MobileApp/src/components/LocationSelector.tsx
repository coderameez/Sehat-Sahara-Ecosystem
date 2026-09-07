import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';

export interface LocationData {
  lat?: number;
  lng?: number;
  address: string;
  city: string;
  area: string;
}

interface LocationSelectorProps {
  value?: LocationData;
  onChange: (location: LocationData) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

// Fallback static locations if API key is missing or fails
const FALLBACK_LOCATIONS = [
  { city: 'Karachi', area: 'Gulshan-e-Iqbal', address: 'Gulshan-e-Iqbal, Karachi', lat: 24.9180, lng: 67.0971 },
  { city: 'Karachi', area: 'DHA Phase 6', address: 'DHA Phase 6, Karachi', lat: 24.8115, lng: 67.0643 },
  { city: 'Lahore', area: 'Johar Town', address: 'Johar Town, Lahore', lat: 31.4697, lng: 74.2728 },
  { city: 'Lahore', area: 'DHA Phase 5', address: 'DHA Phase 5, Lahore', lat: 31.4705, lng: 74.4111 },
  { city: 'Islamabad', area: 'F-8 Markaz', address: 'F-8 Markaz, Islamabad', lat: 33.7104, lng: 73.0422 },
];

let isScriptLoaded = false;
let isScriptLoading = false;

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  label = 'Location',
  placeholder = 'Search for area, street, or city',
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value?.address || '');
  const [useFallback, setUseFallback] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (value?.address) {
      setInputValue(value.address);
    }
  }, [value]);

  useEffect(() => {
    const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setUseFallback(true);
      return;
    }

    if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
      initAutocomplete();
      return;
    }

    if (!isScriptLoaded && !isScriptLoading) {
      isScriptLoading = true;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        isScriptLoaded = true;
        isScriptLoading = false;
        initAutocomplete();
      };
      script.onerror = () => {
        isScriptLoading = false;
        setUseFallback(true);
      };
      document.head.appendChild(script);
    } else if (isScriptLoading) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (isScriptLoaded) {
          clearInterval(checkInterval);
          initAutocomplete();
        }
      }, 500);
      return () => clearInterval(checkInterval);
    }
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !(window as any).google?.maps?.places) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'pk' }, // Restrict to Pakistan for Sehat Sahara
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      let city = '';
      let area = place.name || '';

      place.address_components?.forEach((component: any) => {
        if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
          city = component.long_name;
        }
        if (component.types.includes('sublocality') || component.types.includes('neighborhood')) {
          area = component.long_name;
        }
      });

      const formattedAddress = place.formatted_address || area;
      setInputValue(formattedAddress);

      onChange({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: formattedAddress,
        city: city || 'Unknown City',
        area: area,
      });
    });
  };

  const handleFallbackSelect = (loc: typeof FALLBACK_LOCATIONS[0]) => {
    setInputValue(loc.address);
    setShowDropdown(false);
    onChange({
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address,
      city: loc.city,
      area: loc.area
    });
  };

  return (
    <div className="relative">
      <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
          <Search className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (useFallback) setShowDropdown(true);
          }}
          onFocus={() => { if (useFallback) setShowDropdown(true); }}
          onBlur={() => {
            // Delay hiding dropdown to allow click
            setTimeout(() => setShowDropdown(false), 200);
          }}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-4 rounded-xl border bg-white text-[15px] outline-none transition-all ${
            error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-[#1B7F4C]'
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}

      {useFallback && showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 z-50 max-h-60 overflow-y-auto">
          {FALLBACK_LOCATIONS.filter(loc => loc.address.toLowerCase().includes(inputValue.toLowerCase())).map((loc, i) => (
            <div
              key={i}
              onClick={() => handleFallbackSelect(loc)}
              className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer flex items-start gap-3"
            >
              <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 text-[14px]">{loc.area}</p>
                <p className="text-[12px] text-slate-500">{loc.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
