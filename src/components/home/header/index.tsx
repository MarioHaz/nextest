import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="flex flex-row justify-around items-center p-4 bg-gray-700 text-white w-full">
      <h1 className="text-xl">Nextest</h1>
      <nav className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/favorites" className="hover:underline">
          Favorites
        </Link>
      </nav>
    </header>
  );
}
