"use client";

import { useState, useEffect } from "react";
import Header from "@/components/home/header";
import MovieCard from "@/components/home/movieCard";
import { inputs } from "./data/inputs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Filters
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [season, setSeason] = useState("");

  // Data states
  const [media, setMedia] = useState([]); // For filtered results
  const [seasonFav, setSeasonFav] = useState([]); // For “Popular This Season”
  const [allTimesFav, setAllTimesFav] = useState([]); // For “Popular All Time”

  // Loading & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1) Helper to see if user has applied ANY filter
  const hasFilter = Boolean(search || year || genre || status || season);

  // === 1.1) Whenever the user changes a filter in an input, we update the URL ===
  //        so it reflects the new filter state.
  function updateUrlParam(paramName, value) {
    // Clone the current URLSearchParams
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      // If user typed/selected something, set or update the param
      params.set(paramName, value);
    } else {
      // If user cleared it, remove the param from the URL
      params.delete(paramName);
    }

    // Now update the URL in place (no page reload)
    router.replace(`?${params.toString()}`);
  }

  // === 1.2) On filter changes, update both local state and the URL param ===
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
      updateUrlParam("search", e.target.value);
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

  // 2) `useEffect` triggers whenever ANY filter changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!hasFilter) {
          // --- NO FILTERS => fetch your “fav” data in parallel ---
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

          // Clear the filtered media if no filter is applied
          setMedia([]);
        } else {
          // --- FILTERS APPLIED => fetch from filter route ---
          const response = await fetch("/api/graph/getByFilters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ search, year, genre, status, season }),
          });
          const json = await response.json();

          if (!json.success) throw new Error(json.message);

          // Put filtered results into `media`
          setMedia(json.data.Page.media || []);

          // Clear out the favorites
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
  }, [search, year, genre, status, season, hasFilter]);

  // 3) Render logic
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // function to clear filters
  const handleClearFilters = () => {
    setSearch("");
    setYear("");
    setGenre("");
    setStatus("");
    setSeason("");
    updateUrlParam("search", "");
    updateUrlParam("year", "");
    updateUrlParam("genre", "");
    updateUrlParam("status", "");
    updateUrlParam("season", "");
  };
  return (
    <div className="w-full h-screen mb-40">
      <Header />
      <main className="flex flex-col items-center justify-around m-20 gap-20">
        {/* Filters Section */}
        <div className="flex flex-row gap-8 items-center justify-center">
          {/* Each input config from ./data/inputs can point to the right onChange */}
          {inputs.map((input) => (
            <div key={input.label} className="flex flex-col gap-2">
              <label htmlFor="name">{input.label}</label>
              {input.type === "selector" ? (
                <select
                  className="bg-white rounded-md w-40 h-6"
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
                  onChange={(e) =>
                    input.label === "Year"
                      ? handleYearChange(e)
                      : input.label === "Airing Status"
                      ? handleStatusChange(e)
                      : input.label === "Season"
                      ? handleSeasonChange(e)
                      : input.label === "Genres"
                      ? handleGenreChange(e)
                      : null
                  }
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
                  defaultValue={search}
                  placeholder="Search your favorite anime"
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
            onClick={() => {
              handleClearFilters();
            }}
            className="bg-white rounded-md w-40 h-6"
          >
            Clear
          </button>
        </div>

        {/* If `media` is non-empty, show filtered results; else show favs */}
        {media.length > 0 ? (
          <div className="w-full">
            <h2>FILTERED RESULTS</h2>
            <div className="flex flex-row gap-8">
              {media.map((item) => (
                <div key={item.id}>
                  <MovieCard item={item} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Show “fav” sections only if user not filtering
          <div className="flex flex-col items-center justify-around gap-40 w-full">
            {/* Popular This Season */}
            <div className="w-full">
              <h2>POPULAR THIS SEASON</h2>
              <div className="flex flex-row gap-8">
                {seasonFav.map((item) => (
                  <MovieCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            {/* Popular All Times */}
            <div className="w-full">
              <h2>POPULAR ALL TIME</h2>
              <div className="flex flex-row gap-8">
                {allTimesFav.map((item) => (
                  <MovieCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
