import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Read filters from the request body
    const { search, year, genre, status, season } = await req.json();

    // 2. Build the query
    const query = `
      query (
        $page: Int = 1
        $perPage: Int = 6
        $search: String
        $seasonYear: Int
        $season: MediaSeason
        $status: MediaStatus
        $genre_in: [String]
      ) {
        Page(page: $page, perPage: $perPage) {
          media(
            type: ANIME
            isAdult: false
            sort: [POPULARITY_DESC]
            search: $search
            seasonYear: $seasonYear
            season: $season
            status: $status
            genre_in: $genre_in
          ) {
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

    // 3. Build variables from filters
    const variables = {
      search: search || undefined,
      seasonYear: year ? parseInt(year) : undefined,
      season: season || undefined,
      status: status || undefined,
      genre_in: genre ? [genre] : undefined,
      perPage: 6,
    };

    // 4. Send request to AniList
    const aniListRes = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await aniListRes.json();

    if (!aniListRes.ok) {
      const msg = data?.errors?.[0]?.message || "AniList error";
      throw new Error(msg);
    }

    // 5. Return JSON response
    return NextResponse.json({
      success: true,
      data: data.data, // { Page: { media: [...] } }
    });
  } catch (error) {
    console.error("Error in /api/graph/season:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
