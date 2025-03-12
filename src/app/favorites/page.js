"use client";
import { useState } from "react";
import MovieCard from "@/components/home/movieCard";
import Modal from "@/components/modal";
import { useDispatch, useSelector } from "react-redux";

export default function Favorites() {
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAnimeClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="w-full h-screen mb-40">
      <main className="flex flex-col items-center justify-around m-20 gap-20">
        {/* If `media` is non-empty, show filtered results; else show favs */}
        {favorites?.favorites?.length > 0 ? (
          <div className="w-full">
            <h2>FAVORITES</h2>
            <div className="flex flex-row gap-8 ">
              {favorites.favorites.map((item) => (
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
