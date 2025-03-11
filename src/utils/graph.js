/**************************************************
 * 1) Import and Setup
 **************************************************/
import { gql, GraphQLClient } from "graphql-request";

// ----  API URL ----//

const endpoint = "https://graphql.anilist.co";

export const adminGraphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**************************************************
 * 2) Query: Fetch Media by rating
 **************************************************/

const GET_MEDIA_BY_RATING = gql`
  query Page($perPage: Int, $sort: [RecommendationSort]) {
  Page(perPage: $perPage) {
    recommendations( sort: $sort) {
      media {
        coverImage {
          extraLarge
        }
        bannerImage
        description
        chapters
        episodes
        averageScore
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
        trailer {
          id
          site
          thumbnail
        }
       
      }
    }
  }
`;

export async function getMediaByRating(sort) {
  try {
    const response = await adminGraphQLClient.request(GET_MEDIA_BY_RATING, {
      perPage: 6,
      sort: ["RATING_DESC"],
      // Required argument to actually filter recommendations
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching media by rating:", error);
    throw error;
  }
}
