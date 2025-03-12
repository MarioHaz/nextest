"use client";

import React, { JSX, useState } from "react";
import MovieCard from "../../components/home/movieCard";
import Modal from "../../components/modal";
import { useDispatch, useSelector } from "react-redux";

// Define a simple MediaItem interface. Extend this as needed.
export interface MediaItem {
  id: number | string;
  bannerImage?: string;
  title?: {
    english?: string;
    native?: string;
  };
  description?: string;
  episodes?: number;
  averageScore?: number;
  status?: string;
  startDate?: { day: number; month: number; year: number };
  endDate?: { day: number; month: number; year: number };
  trailer?: {
    site?: string;
    id?: string;
  };
}

// Define your Redux state interface (adjust based on your actual state)
interface RootState {
  favorites: {
    favorites: MediaItem[];
  };
}

export default function Favorites(): JSX.Element {
  const favorites = useSelector((state: RootState) => state.favorites);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleAnimeClick = (item: MediaItem): void => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="w-full h-screen mb-40">
      <main className="flex flex-col items-center justify-around m-20 gap-20">
        {favorites?.favorites?.length > 0 ? (
          <div className="w-full">
            <h2>FAVORITES</h2>
            <div className="flex flex-row gap-8">
              {favorites.favorites.map((item: MediaItem) => (
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
            <h2>No favorites found</h2>
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
