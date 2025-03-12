import { addToFavorites, removeFromFavorites } from "@/app/store/likeSlice";
import Image from "next/image";
import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

export default function MovieCard({ item, handleAnimeClick }) {
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const isFavorite = favorites.favorites.some((fav) => fav.id === item.id);
  return (
    <div className="h-40 w-40 ">
      <Image
        onClick={() => handleAnimeClick(item)}
        src={item?.coverImage?.extraLarge}
        alt={item.title}
        width={200}
        height={200}
        className="w-40 h-60 object-cover cursor-pointer hover:scale-105 transition-transform"
      />
      <div className="flex flex-row justify-between items-center">
        <h2>
          {item.title.romaji.length > 12
            ? `${item.title.romaji?.substring(0, 10)}...`
            : item.title.romaji}
        </h2>
        {isFavorite ? (
          <FaHeart
            className="w-4 h-4 cursor-pointer text-red-500"
            onClick={() => dispatch(removeFromFavorites(item))}
          />
        ) : (
          <FaRegHeart
            className="w-4 h-4 cursor-pointer hover:text-red-500"
            onClick={() => dispatch(addToFavorites(item))}
          />
        )}
      </div>
    </div>
  );
}
