import Image from "next/image";
import React from "react";

export default function MovieCard({ item }) {
  return (
    <div className="h-40 w-40">
      <Image
        src={item?.coverImage?.extraLarge}
        alt={item.title}
        width={200}
        height={200}
        className="w-40 h-60 object-cover"
      />
      <h2>
        {item.title.romaji.length > 12
          ? `${item.title.romaji?.substring(0, 10)}...`
          : item.title.romaji}
      </h2>
    </div>
  );
}
