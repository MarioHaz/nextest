import {
  addToFavorites,
  removeFromFavorites,
} from "../../../app/store/likeSlice";
import Image from "next/image";
import React, { JSX } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

// Define the MediaItem interface – adjust this to match your API structure
export interface MediaItem {
  id: number | string;
  coverImage?: {
    extraLarge: string;
  };
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
  };
}

interface RootState {
  favorites: {
    favorites: MediaItem[];
  };
}

interface MovieCardProps {
  item: MediaItem;
  handleAnimeClick: (item: MediaItem) => void;
}

export default function MovieCard({
  item,
  handleAnimeClick,
}: MovieCardProps): JSX.Element {
  const favorites = useSelector((state: RootState) => state.favorites);
  const dispatch = useDispatch();

  const isFavorite = favorites.favorites.some(
    (fav: MediaItem) => fav.id === item.id
  );

  return (
    <div className="h-40 w-40">
      <Image
        onClick={() => handleAnimeClick(item)}
        src={item?.coverImage?.extraLarge ?? "/placeholder.jpg"}
        alt={item.title?.romaji || item.title?.english || "Anime"}
        width={200}
        height={200}
        className="w-40 h-60 object-cover cursor-pointer hover:scale-105 transition-transform"
      />
      <div className="flex flex-row justify-between items-center">
        <h2>
          {item.title?.romaji && item.title.romaji.length > 12
            ? `${item.title.romaji.substring(0, 10)}...`
            : item.title?.romaji}
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
