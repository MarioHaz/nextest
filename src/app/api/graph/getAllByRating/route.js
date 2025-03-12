import { NextResponse } from "next/server";

export async function POST() {
  // GraphQL query for a single anime by ID
  const query = `
   query Page($page: Int, $perPage: Int, $sort: [MediaSort], $type: MediaType, $isAdult: Boolean, $season: MediaSeason, $seasonYear: Int) {
  Page(page: $page, perPage: $perPage) {
    media(sort: $sort, type: $type, isAdult: $isAdult, season: $season, seasonYear: $seasonYear) {
      id
      title {
        english
        native
        romaji
      }
      description
      coverImage {
        extraLarge
      }
      bannerImage
      episodes
      endDate {
        day
        month
        year
      }
      startDate {
        day
        month
        year
      }
      status
      averageScore
      trailer {
        id
        site
        thumbnail
      }
      isFavourite
    }
  }
}

  `;

  // Variables used in that query
  const variables = {
    page: 1,
    perPage: 6,
    sort: ["POPULARITY_DESC"],
    season: "WINTER",
    seasonYear: 2025,
  };

  // AniList GraphQL endpoint + fetch options
  const url = "https://graphql.anilist.co";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  try {
    // Call AniList
    const response = await fetch(url, options);
    const json = await response.json();

    // If AniList responded with an error
    if (!response.ok) {
      // AniList returns errors in json.errors
      const errorMessage =
        json?.errors?.[0]?.message || "AniList request failed";
      throw new Error(errorMessage);
    }

    // If successful, json.data holds the query results
    return NextResponse.json({
      success: true,
      message: "Fetched anime from Anilist.",
      data: json.data, // e.g. { Media: { id: 15125, title: { ... }, coverImage: ... } }
    });
  } catch (error) {
    console.error("AniList API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
