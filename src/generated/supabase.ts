export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  cinemang: {
    Tables: {
      cast_credit: {
        Row: {
          cast_id: number
          character: string
          credit_id: string
          movieId: number
          order: number
          personId: number
        }
        Insert: {
          cast_id: number
          character: string
          credit_id: string
          movieId: number
          order: number
          personId: number
        }
        Update: {
          cast_id?: number
          character?: string
          credit_id?: string
          movieId?: number
          order?: number
          personId?: number
        }
      }
      company: {
        Row: {
          description: string
          headquarters: string
          homepage: string
          id: number
          logo_path: string | null
          name: string
          origin_country: string
          parent_company: string | null
        }
        Insert: {
          description: string
          headquarters: string
          homepage: string
          id: number
          logo_path?: string | null
          name: string
          origin_country: string
          parent_company?: string | null
        }
        Update: {
          description?: string
          headquarters?: string
          homepage?: string
          id?: number
          logo_path?: string | null
          name?: string
          origin_country?: string
          parent_company?: string | null
        }
      }
      crew_credit: {
        Row: {
          credit_id: string
          department: string
          job: string
          movieId: number
          personId: number
        }
        Insert: {
          credit_id: string
          department: string
          job: string
          movieId: number
          personId: number
        }
        Update: {
          credit_id?: string
          department?: string
          job?: string
          movieId?: number
          personId?: number
        }
      }
      genre: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      ignored_movie: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        Update: {
          id?: number
        }
      }
      ignored_person: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        Update: {
          id?: number
        }
      }
      language: {
        Row: {
          count: number
          id: string
          name: string
        }
        Insert: {
          count?: number
          id: string
          name: string
        }
        Update: {
          count?: number
          id?: string
          name?: string
        }
      }
      movie: {
        Row: {
          cast: string
          certification: string | null
          director: string
          genre_id: number
          id: number
          imdb_id: string
          language_id: string
          overview: string
          popularity: number
          poster_path: string
          released_at: string
          runtime: number
          title: string
          vote_average: number
          vote_count: number
        }
        Insert: {
          cast: string
          certification?: string | null
          director: string
          genre_id: number
          id: number
          imdb_id: string
          language_id: string
          overview: string
          popularity: number
          poster_path: string
          released_at: string
          runtime: number
          title: string
          vote_average: number
          vote_count: number
        }
        Update: {
          cast?: string
          certification?: string | null
          director?: string
          genre_id?: number
          id?: number
          imdb_id?: string
          language_id?: string
          overview?: string
          popularity?: number
          poster_path?: string
          released_at?: string
          runtime?: number
          title?: string
          vote_average?: number
          vote_count?: number
        }
      }
      movie_watch_provider: {
        Row: {
          movieId: number
          watchProviderId: number
        }
        Insert: {
          movieId: number
          watchProviderId: number
        }
        Update: {
          movieId?: number
          watchProviderId?: number
        }
      }
      person: {
        Row: {
          biography: string
          birthday: string | null
          deathday: string | null
          gender: number
          id: number
          imdb_id: string
          known_for_department: string
          name: string
          place_of_birth: string | null
          popularity: number
          profile_path: string
        }
        Insert: {
          biography: string
          birthday?: string | null
          deathday?: string | null
          gender: number
          id: number
          imdb_id: string
          known_for_department: string
          name: string
          place_of_birth?: string | null
          popularity: number
          profile_path: string
        }
        Update: {
          biography?: string
          birthday?: string | null
          deathday?: string | null
          gender?: number
          id?: number
          imdb_id?: string
          known_for_department?: string
          name?: string
          place_of_birth?: string | null
          popularity?: number
          profile_path?: string
        }
      }
      system_info: {
        Row: {
          id: number
          loadFinishedAt: string
          loadStartedAt: string
        }
        Insert: {
          id: number
          loadFinishedAt: string
          loadStartedAt: string
        }
        Update: {
          id?: number
          loadFinishedAt?: string
          loadStartedAt?: string
        }
      }
      tv_network: {
        Row: {
          headquarters: string
          homepage: string
          id: number
          logo_path: string | null
          name: string
          origin_country: string
          parent_company: string | null
        }
        Insert: {
          headquarters: string
          homepage: string
          id: number
          logo_path?: string | null
          name: string
          origin_country: string
          parent_company?: string | null
        }
        Update: {
          headquarters?: string
          homepage?: string
          id?: number
          logo_path?: string | null
          name?: string
          origin_country?: string
          parent_company?: string | null
        }
      }
      tv_series: {
        Row: {
          cast: string
          content_rating: string | null
          created_by: string
          first_air_date: string
          genre_id: number
          id: number
          language_id: string
          last_air_date: string
          name: string
          overview: string
          popularity: number
          poster_path: string
          status: string
          vote_average: number
          vote_count: number
        }
        Insert: {
          cast: string
          content_rating?: string | null
          created_by: string
          first_air_date: string
          genre_id: number
          id: number
          language_id: string
          last_air_date: string
          name: string
          overview: string
          popularity: number
          poster_path: string
          status: string
          vote_average: number
          vote_count: number
        }
        Update: {
          cast?: string
          content_rating?: string | null
          created_by?: string
          first_air_date?: string
          genre_id?: number
          id?: number
          language_id?: string
          last_air_date?: string
          name?: string
          overview?: string
          popularity?: number
          poster_path?: string
          status?: string
          vote_average?: number
          vote_count?: number
        }
      }
      watch_provider: {
        Row: {
          count: number
          display_priority: number
          id: number
          logo_path: string
          name: string
        }
        Insert: {
          count?: number
          display_priority: number
          id: number
          logo_path: string
          name: string
        }
        Update: {
          count?: number
          display_priority?: number
          id?: number
          logo_path?: string
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
