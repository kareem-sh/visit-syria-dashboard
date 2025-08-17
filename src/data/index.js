import trips from "./trips2.js";

export const USE_MOCK_DATA = true;

export const getDataByType = (type) => {
  if (USE_MOCK_DATA) {
    switch (type) {
      case "event":
        return trips;
      default:
        return [];
    }
  }

  // API mode placeholder
  return [];
};
