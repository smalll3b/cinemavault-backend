import axios from 'axios';
import { config } from '../config';

interface OMDBResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Type: string;
  Response: string;
  Error?: string;
}

const client = axios.create({
  baseURL: config.omdb.apiUrl,
  timeout: 10000,
});

export const searchMovieByTitle = async (title: string): Promise<OMDBResponse | null> => {
  try {
    const response = await client.get<OMDBResponse>('/', {
      params: {
        apikey: config.omdb.apiKey,
        t: title,
        type: 'movie',
      },
    });

    if (response.data.Response === 'False') {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error searching movie by title:', error);
    return null;
  }
};

export const searchMovieById = async (imdbId: string): Promise<OMDBResponse | null> => {
  try {
    const response = await client.get<OMDBResponse>('/', {
      params: {
        apikey: config.omdb.apiKey,
        i: imdbId,
      },
    });

    if (response.data.Response === 'False') {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error searching movie by ID:', error);
    return null;
  }
};

export const searchMovies = async (query: string, year?: string): Promise<any> => {
  try {
    const response = await client.get('/', {
      params: {
        apikey: config.omdb.apiKey,
        s: query,
        type: 'movie',
        ...(year && { y: year }),
      },
    });

    if (response.data.Response === 'False') {
      return { Search: [] };
    }

    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return { Search: [] };
  }
};

export const mapOMDBToMovie = (omdbMovie: OMDBResponse) => {
  return {
    title: omdbMovie.Title,
    year: parseInt(omdbMovie.Year, 10),
    imdb_id: omdbMovie.imdbID,
    poster: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    plot: omdbMovie.Plot !== 'N/A' ? omdbMovie.Plot : null,
    runtime: omdbMovie.Runtime !== 'N/A' ? parseInt(omdbMovie.Runtime, 10) : null,
    genre: omdbMovie.Genre,
    director: omdbMovie.Director !== 'N/A' ? omdbMovie.Director : null,
    actors: omdbMovie.Actors !== 'N/A' ? omdbMovie.Actors : null,
    external_rating: omdbMovie.imdbRating !== 'N/A' ? parseFloat(omdbMovie.imdbRating) : null,
  };
};

