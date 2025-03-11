import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";

export default function Home() {
  const inputs = [
    { label: "Search", type: "text" },
    { label: "Genres", type: "selector" },
    { label: "Year", type: "selector" },
    { label: "Airing Status", type: "selector" },
    { label: "Season", type: "selector" },
  ];
  return (
    <div className="w-full">
      <Header />
      <main className="flex flex-col items-center justify-around m-20">
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
      </main>
    </div>
  );
}
