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

// Helper function to create a Response-like object
const createMockResponse = (
  data: any,
  ok = true,
  status = 200,
  statusText = "OK"
) => {
  return {
    ok,
    status,
    statusText,
    headers: new Headers(),
    redirected: false,
    url: "",
    clone: () => {
      throw new Error("not implemented");
    },
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as Response;
};

// Mock fetch so it doesn't fail
global.fetch = jest.fn(async (url: string) => {
  if (url === "/api/graph/getAllByRating") {
    return createMockResponse({
      success: true,
      data: {
        Page: {
          media: [], // Provide mock items if needed
        },
      },
    });
  }
  if (url === "/api/graph/getAllTimesFav") {
    return createMockResponse({
      success: true,
      data: {
        Page: {
          media: [],
        },
      },
    });
  }
  if (url === "/api/graph/getByFilters") {
    return createMockResponse({
      success: true,
      data: {
        Page: {
          media: [],
        },
      },
    });
  }
  return createMockResponse(
    { success: false, message: "Unknown endpoint" },
    false,
    404,
    "Not Found"
  );
});

describe("Home", () => {
  it("renders a heading", async () => {
    render(<Home />);

    // Looking for an h2 with the text "POPULAR THIS SEASON"
    const heading = await screen.findByRole("heading", {
      level: 2,
      name: /popular this season/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
