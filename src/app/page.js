"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/home/header";
import MovieCard from "@/components/home/movieCard";
import { inputs } from "./data/inputs";
import Modal from "@/components/modal";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===============================
  // 1) Local states for UI inputs
  // ===============================
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [season, setSeason] = useState("");

  // ===============================
  // 2) Data / UI state
  // ===============================
  const [media, setMedia] = useState([]); // Filtered results
  const [seasonFav, setSeasonFav] = useState([]); // “Popular This Season”
  const [allTimesFav, setAllTimesFav] = useState([]); // “Popular All Time”

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // ===============================
  // 3) Update URL when user changes a filter
  // ===============================
  function updateUrlParam(paramName, value) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    // Replace current URL with new query string, no full reload
    router.replace(`?${params.toString()}`);
  }

  // ===============================
  // 4) Event handlers for inputs
  // ===============================
  //   We do two things:
  //   (a) set local state (so the input visually updates)
  //   (b) update the URL param (which triggers the effect below)

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      setSearch(value);
      updateUrlParam("search", value);
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setYear(value);
    updateUrlParam("year", value);
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setGenre(value);
    updateUrlParam("genre", value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    updateUrlParam("status", value);
  };

  const handleSeasonChange = (e) => {
    const value = e.target.value;
    setSeason(value);
    updateUrlParam("season", value);
  };

  // ===============================
  // 5) Single effect: read query params => set local states => fetch
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // -- (A) Parse the latest query params --
        const spSearch = searchParams.get("search") || "";
        const spYear = searchParams.get("year") || "";
        const spGenre = searchParams.get("genre") || "";
        const spStatus = searchParams.get("status") || "";
        const spSeason = searchParams.get("season") || "";

        // Update local state so inputs reflect the query
        setSearch(spSearch);
        setYear(spYear);
        setGenre(spGenre);
        setStatus(spStatus);
        setSeason(spSeason);

        // Determine if ANY filter is actually set
        const hasFilter = Boolean(
          spSearch || spYear || spGenre || spStatus || spSeason
        );

        // -- (B) Fetch data depending on hasFilter --
        if (!hasFilter) {
          // No filters => fetch "Popular This Season" + "All Time" in parallel
          const [resSeason, resAllTimes] = await Promise.all([
            fetch("/api/graph/getAllByRating", { method: "POST" }),
            fetch("/api/graph/getAllTimesFav", { method: "POST" }),
          ]);
          const [dataSeason, dataAllTimes] = await Promise.all([
            resSeason.json(),
            resAllTimes.json(),
          ]);

          if (!dataSeason.success) throw new Error(dataSeason.message);
          if (!dataAllTimes.success) throw new Error(dataAllTimes.message);

          setSeasonFav(dataSeason?.data?.Page?.media || []);
          setAllTimesFav(dataAllTimes?.data?.Page?.media || []);
          setMedia([]); // Clear filtered results
        } else {
          // If there's at least one filter => fetch filtered data
          const response = await fetch("/api/graph/getByFilters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              search: spSearch,
              year: spYear,
              genre: spGenre,
              status: spStatus,
              season: spSeason,
            }),
          });
          const json = await response.json();

          if (!json.success) throw new Error(json.message);

          setMedia(json.data.Page.media || []);
          setSeasonFav([]);
          setAllTimesFav([]);
        }
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);
  // ^ We only watch searchParams. Whenever the query changes (user typed, or page reloaded with ?something),
  //   we re-run this effect to read them & fetch.

  // ===============================
  // 6) Clear all filters
  // ===============================
  const handleClearFilters = () => {
    // The simplest approach is to go back to "/"
    // or you can remove them param by param:
    router.replace("/");
  };

  const handleAnimeClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // ===============================
  // 7) Render
  // ===============================
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full h-screen mb-40">
      <main className="flex flex-col items-center justify-around m-20 gap-20">
        {/* Filters Section */}
        <div className="flex flex-row gap-8 items-center justify-center">
          {inputs.map((input) => (
            <div key={input.label} className="flex flex-col gap-2">
              <label htmlFor="name">{input.label}</label>
              {input.type === "selector" ? (
                <select
                  className="bg-white rounded-md w-40 h-6"
                  // Value is always from local state (which we sync from searchParams in effect)
                  value={
                    input.label === "Year"
                      ? year
                      : input.label === "Airing Status"
                      ? status
                      : input.label === "Season"
                      ? season
                      : input.label === "Genres"
                      ? genre
                      : ""
                  }
                  onChange={(e) => {
                    if (input.label === "Year") {
                      handleYearChange(e);
                    } else if (input.label === "Airing Status") {
                      handleStatusChange(e);
                    } else if (input.label === "Season") {
                      handleSeasonChange(e);
                    } else if (input.label === "Genres") {
                      handleGenreChange(e);
                    }
                  }}
                >
                  <option value="">Any</option>
                  {input.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={input.type}
                  className="bg-white rounded-md"
                  // Here we use 'value' not 'defaultValue'
                  value={search}
                  placeholder="Search your favorite anime"
                  onChange={(e) => setSearch(e.target.value)} // updates local state, but no immediate param set
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchKeyDown(e);
                    }
                  }}
                />
              )}
            </div>
          ))}
          <button
            onClick={handleClearFilters}
            className="bg-white rounded-md w-40 h-6"
          >
            Clear
          </button>
        </div>

        {/* If `media` is non-empty, show filtered results; else show favs */}
        {media.length > 0 ? (
          <div className="w-full">
            <h2>FILTERED RESULTS</h2>
            <div className="flex flex-row gap-8 ">
              {media.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  handleAnimeClick={handleAnimeClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-around gap-40 w-full">
            {/* Popular This Season */}
            <div className="w-full">
              <h2>POPULAR THIS SEASON</h2>
              <div className="flex flex-row gap-8">
                {seasonFav.map((item) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    handleAnimeClick={handleAnimeClick}
                  />
                ))}
              </div>
            </div>
            {/* Popular All Time */}
            <div className="w-full">
              <h2>POPULAR ALL TIME</h2>
              <div className="flex flex-row gap-8">
                {allTimesFav.map((item) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    handleAnimeClick={handleAnimeClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      {showModal && (
        <Modal
          item={selectedItem}
          setSelectedItem={setSelectedItem}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
