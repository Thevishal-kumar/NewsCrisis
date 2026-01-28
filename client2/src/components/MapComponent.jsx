import React from 'react';
import {
  What3wordsAutosuggest,
  What3wordsMap
} from "@what3words/react-components";
   
// IMPORTANT: Load your API keys from the .env file
const API_KEY = import.meta.env.VITE_WHAT3WORDS_API_KEY;
const MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function MapComponent() {
  return (
    // This component will fill the container it's placed in
    <What3wordsMap
      id="w3w-map"
      api_key={API_KEY}
      map_api_key={MAP_API_KEY}
      // You can customize these controls as needed
      disable_default_ui={true}
      zoom_control={true}
      // Center the map on a relevant location, e.g., an aid mission
      words="filled.count.soap"
      zoom={15}
    >
      {/* This div tells the map where to render. It will fill its parent. */}
      <div slot="map" style={{ width: "100%", height: "100%" }} />

      {/* Optional: Add a search bar on top of the map */}
      <div slot="search-control" style={{ margin: "10px 0 0 10px" }} >
        <What3wordsAutosuggest>
          <input
            type="text"
            placeholder="Search a 3 word address..."
            className="p-2 rounded border border-slate-600 bg-slate-700 text-white w-72"
            autoComplete="off"
          />
        </What3wordsAutosuggest>
      </div>
    </What3wordsMap>
  );
}
