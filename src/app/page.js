"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/home/header";
import { useState, useEffect } from "react";
import MovieCard from "@/components/home/movieCard";

export default function Home() {
  const inputs = [
    { label: "Search", type: "text" },
    { label: "Genres", type: "selector" },
    { label: "Year", type: "selector" },
    { label: "Airing Status", type: "selector" },
    { label: "Season", type: "selector" },
  ];

  const [media, setMedia] = useState([]);
  const [seasonFav, setSeasonFav] = useState([]);
  const [allTimesFav, setAllTimesFav] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Make both requests in parallel
        const [resSeason, resAllTimes] = await Promise.all([
          fetch("/api/graph/getAllByRating", { method: "POST" }),
          fetch("/api/graph/getAllTimesFav", { method: "POST" }),
        ]);

        // Parse both responses in parallel
        const [dataSeason, dataAllTimes] = await Promise.all([
          resSeason.json(),
          resAllTimes.json(),
        ]);

        // Update state with the results
        setSeasonFav(dataSeason?.data?.Page?.media || []);
        setAllTimesFav(dataAllTimes?.data?.Page?.media || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Optionally, render a loading or error state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return (
    <div className="w-full h-screen">
      <Header />

      <main className="flex flex-col items-center justify-around m-20 gap-20">
        {/* Filters Section */}
        <div className="flex flex-row gap-8">
          {inputs.map((input) => (
            <div key={input.label} className="flex flex-col gap-2">
              <label htmlFor="name">{input.label}</label>
              {input.type === "selector" ? (
                <select className="bg-white rounded-md w-40 h-6">
                  <option value="">Any</option>
                </select>
              ) : (
                <input type={input.type} className="bg-white rounded-md" />
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-around  gap-40">
          {/* Popular This Season */}
          <div className="w-full">
            <h2>POPULAR THIS SEASON</h2>
            <div className="flex flex-row gap-8">
              {seasonFav?.map((item) => (
                <div key={item.id}>
                  <MovieCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Popular All Times */}
          <div className="w-full">
            <h2>POPULAR ALL TIME</h2>
            <div className="flex flex-row gap-8">
              {allTimesFav?.map((item) => (
                <div key={item.id}>
                  <MovieCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
