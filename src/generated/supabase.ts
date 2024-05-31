export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          character: string | null
          credit_id: string
          department: string | null
          job: string | null
          movie_id: number | null
          order: number | null
          person_id: number
          show_id: number | null
        }
        Insert: {
          character?: string | null
          credit_id: string
          department?: string | null
          job?: string | null
          movie_id?: number | null
          order?: number | null
          person_id: number
          show_id?: number | null
        }
        Update: {
          character?: string | null
          credit_id?: string
          department?: string | null
          job?: string | null
          movie_id?: number | null
          order?: number | null
          person_id?: number
          show_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movie"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "show"
            referencedColumns: ["id"]
          },
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
          show_id: number
        }
        Insert: {
          air_date?: string | null
          episode_number: number
          id: number
          name: string
          overview: string
          runtime?: number | null
          season_id: number
          show_id: number
        }
        Update: {
          air_date?: string | null
          episode_number?: number
          id?: number
          name?: string
          overview?: string
          runtime?: number | null
          season_id?: number
          show_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "episode_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episode_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "show"
            referencedColumns: ["id"]
          },
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
          type: Database["public"]["Enums"]["GenreType"]
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
            isOneToOne: false
            referencedRelation: "movie"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_provider_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_provider_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "show"
            referencedColumns: ["id"]
          },
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
            isOneToOne: false
            referencedRelation: "show"
            referencedColumns: ["id"]
          },
        ]
      }
      show: {
        Row: {
          cast: string
          content_rating: string | null
          created_by: string | null
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
          created_by?: string | null
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
          created_by?: string | null
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
        Relationships: []
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
      column_sizes: {
        Args: {
          target_table: unknown
        }
        Returns: {
          column_name: string
          column_size: number
        }[]
      }
    }
    Enums: {
      GenreType: "MOVIE" | "SHOW" | "BOTH"
      ShowStatus: "ENDED" | "CANCELED" | "RETURNING_SERIES" | "IN_PRODUCTION"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
