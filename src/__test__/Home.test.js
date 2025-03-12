import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new Map()),
}));

// Mock fetch so it doesn't fail
global.fetch = jest.fn(async (url) => {
  // Return a mock success response for each endpoint
  if (url === "/api/graph/getAllByRating") {
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          Page: {
            media: [], // you can put mock items here if you want
          },
        },
      }),
    };
  }
  if (url === "/api/graph/getAllTimesFav") {
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          Page: {
            media: [],
          },
        },
      }),
    };
  }
  if (url === "/api/graph/getByFilters") {
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          Page: {
            media: [],
          },
        },
      }),
    };
  }
  return {
    ok: false,
    json: async () => ({ success: false, message: "Unknown endpoint" }),
  };
});

describe("Home", () => {
  it("renders a heading", async () => {
    render(<Home />);

    const heading = await screen.findByRole("heading", {
      level: 2,
      name: /popular this season/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
