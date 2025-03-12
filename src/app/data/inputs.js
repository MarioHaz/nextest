export const inputs = [
  {
    label: "Search",
    type: "text",
  },
  {
    label: "Genres",
    type: "selector",
    options: [
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Sci-Fi",
      "Slice of Life",
      "Sports",
      "Thriller",
    ],
  },
  {
    label: "Year",
    type: "selector",

    options: [2025],
  },
  {
    label: "Airing Status",
    type: "selector",

    options: ["RELEASING", "FINISHED"],
  },
  {
    label: "Season",
    type: "selector",

    options: ["SPRING", "SUMMER", "FALL", "WINTER"],
  },
];
