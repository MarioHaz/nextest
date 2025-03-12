import { addToFavorites, removeFromFavorites } from "@/app/store/likeSlice";
import Image from "next/image";
import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

export default function Modal({ onClose, item, setSelectedItem }) {
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const isFavorite = favorites.favorites.some((fav) => fav.id === item.id);
  function formatDate(date) {
    if (!date || !date.day || !date.month || !date.year) {
      return "N/A";
    }
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[date.month - 1]} ${date.day}, ${date.year}`;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with semi-transparent background */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => {
          onClose();
          setSelectedItem(null);
        }}
      ></div>

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg mx-4 max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            setSelectedItem(null);
          }}
          className="cursor-pointer z-10 absolute top-4 right-4 rounded-full bg-gray-800 text-white w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Banner (top image) */}
        {item?.bannerImage && (
          <div className="h-40 w-full relative bg-gray-200">
            <Image
              src={item.bannerImage}
              alt="Anime Banner"
              className="w-full h-full object-cover"
              width={200}
              height={200}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Titles */}
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <h2 className="text-md font-bold text-gray-800">
                {item?.title?.english || "No English Title"}
              </h2>
              <h3 className="text-sm text-gray-500">
                {item?.title?.native || "No Native Title"}
              </h3>
            </div>
            {/* Heart icon (favorites) */}
            <div style={{ fontSize: "24px", color: "red" }}>
              {isFavorite ? (
                <FaHeart onClick={() => dispatch(removeFromFavorites(item))} />
              ) : (
                <FaRegHeart onClick={() => dispatch(addToFavorites(item))} />
              )}
            </div>
          </div>

          {/* Description */}
          <p
            className="mt-4 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item?.description || "" }}
          />

          {/* Stats Row */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-400">
                Episodes
              </p>
              <p className="text-sm">{item?.episodes ?? "?"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-gray-400">
                Average Score
              </p>
              <p className="text-sm">
                {item?.averageScore ? `${item.averageScore}%` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-gray-400">
                Status
              </p>
              <p className="text-sm">{item?.status || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-gray-400">
                Start Date
              </p>
              <p className="text-sm">{formatDate(item?.startDate) || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-gray-400">
                End Date
              </p>
              <p className="text-sm">{formatDate(item?.endDate) || "N/A"}</p>
            </div>
          </div>

          {/* Trailer */}
          {item?.trailer?.site === "youtube" && item?.trailer?.id && (
            <div className="mt-8">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${item.trailer.id}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
