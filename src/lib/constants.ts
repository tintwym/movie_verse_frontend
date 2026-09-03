export const GENRE_NAME_TO_TMDB_ID: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Fantasy: 14,
  Horror: 27,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  Thriller: 53,
};

export const REGISTRATION_GENRES = [
  "Action",
  "Drama",
  "Comedy",
  "Documentary",
  "Horror",
  "Science Fiction",
  "Animation",
  "Fantasy",
] as const;
