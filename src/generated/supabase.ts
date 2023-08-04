export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
        Relationships: []
      }
      credit: {
        Row: {
          cast_id: number | null
          character: string | null
          credit_id: string
          department: string | null
          job: string | null
          movie_id: number | null
          order: number | null
          person_id: number
          series_id: number | null
          type: "CAST" | "CREW" | "GUEST_STAR"
        }
        Insert: {
          cast_id?: number | null
          character?: string | null
          credit_id: string
          department?: string | null
          job?: string | null
          movie_id?: number | null
          order?: number | null
          person_id: number
          series_id?: number | null
          type: "CAST" | "CREW" | "GUEST_STAR"
        }
        Update: {
          cast_id?: number | null
          character?: string | null
          credit_id?: string
          department?: string | null
          job?: string | null
          movie_id?: number | null
          order?: number | null
          person_id?: number
          series_id?: number | null
          type?: "CAST" | "CREW" | "GUEST_STAR"
        }
        Relationships: [
          {
            foreignKeyName: "credit_movie_id_fkey"
            columns: ["movie_id"]
            referencedRelation: "movie"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_person_id_fkey"
            columns: ["person_id"]
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_series_id_fkey"
            columns: ["series_id"]
            referencedRelation: "tv_series"
            referencedColumns: ["id"]
          }
        ]
      }
      episode: {
        Row: {
          episode_number: number
          id: number
          name: string
          overview: string
          runtime: number
          season_number: number
          seasonId: string
          still_path: string
          vote_average: number
          vote_count: number
        }
        Insert: {
          episode_number: number
          id: number
          name: string
          overview: string
          runtime: number
          season_number: number
          seasonId: string
          still_path: string
          vote_average: number
          vote_count: number
        }
        Update: {
          episode_number?: number
          id?: number
          name?: string
          overview?: string
          runtime?: number
          season_number?: number
          seasonId?: string
          still_path?: string
          vote_average?: number
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "episode_seasonId_fkey"
            columns: ["seasonId"]
            referencedRelation: "season"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      media_watch_provider: {
        Row: {
          id: string
          movieId: number | null
          seriesId: number | null
          watchProviderId: number
        }
        Insert: {
          id: string
          movieId?: number | null
          seriesId?: number | null
          watchProviderId: number
        }
        Update: {
          id?: string
          movieId?: number | null
          seriesId?: number | null
          watchProviderId?: number
        }
        Relationships: [
          {
            foreignKeyName: "media_watch_provider_movieId_fkey"
            columns: ["movieId"]
            referencedRelation: "movie"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_watch_provider_seriesId_fkey"
            columns: ["seriesId"]
            referencedRelation: "tv_series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_watch_provider_watchProviderId_fkey"
            columns: ["watchProviderId"]
            referencedRelation: "watch_provider"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
      }
      season: {
        Row: {
          air_date: string
          id: string
          name: string
          other_id: number
          overview: string
          poster_path: string
          season_number: number
          tvSeriesId: number
          vote_average: number
        }
        Insert: {
          air_date: string
          id: string
          name: string
          other_id: number
          overview: string
          poster_path: string
          season_number: number
          tvSeriesId: number
          vote_average: number
        }
        Update: {
          air_date?: string
          id?: string
          name?: string
          other_id?: number
          overview?: string
          poster_path?: string
          season_number?: number
          tvSeriesId?: number
          vote_average?: number
        }
        Relationships: [
          {
            foreignKeyName: "season_tvSeriesId_fkey"
            columns: ["tvSeriesId"]
            referencedRelation: "tv_series"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
      }
      tv_series: {
        Row: {
          cast: string
          content_rating: string | null
          created_by_id: number | null
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
          tagline: string | null
          vote_average: number
          vote_count: number
        }
        Insert: {
          cast: string
          content_rating?: string | null
          created_by_id?: number | null
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
          tagline?: string | null
          vote_average: number
          vote_count: number
        }
        Update: {
          cast?: string
          content_rating?: string | null
          created_by_id?: number | null
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
          tagline?: string | null
          vote_average?: number
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "tv_series_created_by_id_fkey"
            columns: ["created_by_id"]
            referencedRelation: "person"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      CreditType: "CAST" | "CREW" | "GUEST_STAR"
      TvSeriesStatus:
        | "ENDED"
        | "CANCELED"
        | "RETURNING_SERIES"
        | "IN_PRODUCTION"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

