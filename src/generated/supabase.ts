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
          show_id: number | null
          type: Database["public"]["Enums"]["CreditType"]
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
          show_id?: number | null
          type: Database["public"]["Enums"]["CreditType"]
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
          show_id?: number | null
          type?: Database["public"]["Enums"]["CreditType"]
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
            foreignKeyName: "credit_show_id_fkey"
            columns: ["show_id"]
            referencedRelation: "show"
            referencedColumns: ["id"]
          }
        ]
      }
      episode: {
        Row: {
          air_date: string | null
          episode_number: number
          id: number
          name: string
          overview: string
          runtime: number | null
          season_id: number
          season_number: number
          show_id: number
          still_path: string | null
          vote_average: number
          vote_count: number
        }
        Insert: {
          air_date?: string | null
          episode_number: number
          id: number
          name: string
          overview: string
          runtime?: number | null
          season_id: number
          season_number: number
          show_id: number
          still_path?: string | null
          vote_average: number
          vote_count: number
        }
        Update: {
          air_date?: string | null
          episode_number?: number
          id?: number
          name?: string
          overview?: string
          runtime?: number | null
          season_id?: number
          season_number?: number
          show_id?: number
          still_path?: string | null
          vote_average?: number
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "episode_season_id_fkey"
            columns: ["season_id"]
            referencedRelation: "season"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episode_show_id_fkey"
            columns: ["show_id"]
            referencedRelation: "show"
            referencedColumns: ["id"]
          }
        ]
      }
      genre: {
        Row: {
          id: number
          name: string
          type: Database["public"]["Enums"]["GenreType"]
        }
        Insert: {
          id: number
          name: string
          type?: Database["public"]["Enums"]["GenreType"]
        }
        Update: {
          id?: number
          name?: string
          type?: Database["public"]["Enums"]["GenreType"]
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
      media_provider: {
        Row: {
          id: string
          movie_id: number | null
          provider_id: number
          show_id: number | null
        }
        Insert: {
          id: string
          movie_id?: number | null
          provider_id: number
          show_id?: number | null
        }
        Update: {
          id?: string
          movie_id?: number | null
          provider_id?: number
          show_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_provider_movie_id_fkey"
            columns: ["movie_id"]
            referencedRelation: "movie"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_provider_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_provider_show_id_fkey"
            columns: ["show_id"]
            referencedRelation: "show"
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
      network: {
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
      person: {
        Row: {
          biography: string
          birthday: string | null
          deathday: string | null
          gender: number
          id: number
          imdb_id: string | null
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
          imdb_id?: string | null
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
          imdb_id?: string | null
          known_for_department?: string
          name?: string
          place_of_birth?: string | null
          popularity?: number
          profile_path?: string
        }
        Relationships: []
      }
      provider: {
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
      season: {
        Row: {
          air_date: string | null
          episode_count: number
          id: number
          name: string
          overview: string
          poster_path: string | null
          season_number: number
          show_id: number
          vote_average: number
        }
        Insert: {
          air_date?: string | null
          episode_count: number
          id: number
          name: string
          overview: string
          poster_path?: string | null
          season_number: number
          show_id: number
          vote_average: number
        }
        Update: {
          air_date?: string | null
          episode_count?: number
          id?: number
          name?: string
          overview?: string
          poster_path?: string | null
          season_number?: number
          show_id?: number
          vote_average?: number
        }
        Relationships: [
          {
            foreignKeyName: "season_show_id_fkey"
            columns: ["show_id"]
            referencedRelation: "show"
            referencedColumns: ["id"]
          }
        ]
      }
      show: {
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
            foreignKeyName: "show_created_by_id_fkey"
            columns: ["created_by_id"]
            referencedRelation: "person"
            referencedColumns: ["id"]
          }
        ]
      }
      sync_run_log: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
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
      GenreType: "MOVIE" | "SHOW" | "BOTH"
      ShowStatus: "ENDED" | "CANCELED" | "RETURNING_SERIES" | "IN_PRODUCTION"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

