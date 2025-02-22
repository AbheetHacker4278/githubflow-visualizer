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
      active_users: {
        Row: {
          count: number | null
          id: string
          last_updated: string | null
        }
        Insert: {
          count?: number | null
          id?: string
          last_updated?: string | null
        }
        Update: {
          count?: number | null
          id?: string
          last_updated?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      asset_insights: {
        Row: {
          asset_id: string
          buying_advice: string
          created_at: string | null
          id: string
          key_factors: Json
          resistance_level: number
          sentiment: string
          support_level: number
          updated_at: string | null
        }
        Insert: {
          asset_id: string
          buying_advice: string
          created_at?: string | null
          id?: string
          key_factors: Json
          resistance_level: number
          sentiment: string
          support_level: number
          updated_at?: string | null
        }
        Update: {
          asset_id?: string
          buying_advice?: string
          created_at?: string | null
          id?: string
          key_factors?: Json
          resistance_level?: number
          sentiment?: string
          support_level?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_rooms: {
        Row: {
          code: string
          created_at: string | null
          created_by: string
          id: string
          max_size: number
          name: string
          password: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by: string
          id?: string
          max_size?: number
          name: string
          password?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string
          id?: string
          max_size?: number
          name?: string
          password?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          is_edited: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          is_edited?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          is_edited?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          is_edited: boolean | null
          likes_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_edited?: boolean | null
          likes_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_edited?: boolean | null
          likes_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      node_annotations: {
        Row: {
          box_color: string | null
          created_at: string | null
          id: string
          node_id: string
          position: Json | null
          repo_url: string
          text_color: string | null
          text_content: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          box_color?: string | null
          created_at?: string | null
          id?: string
          node_id: string
          position?: Json | null
          repo_url: string
          text_color?: string | null
          text_content: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          box_color?: string | null
          created_at?: string | null
          id?: string
          node_id?: string
          position?: Json | null
          repo_url?: string
          text_color?: string | null
          text_content?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          comment_id: string | null
          created_at: string | null
          discussion_id: string | null
          id: string
          reason: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          reason: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          reason?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      room_members: {
        Row: {
          joined_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          joined_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          room_id: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          room_id: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          room_id?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          created_at: string | null
          id: string
          session_end: string | null
          session_start: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_end?: string | null
          session_start?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session_end?: string | null
          session_start?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      visitor_counts: {
        Row: {
          count: number | null
          id: string
          is_verified: boolean | null
          last_updated: string | null
        }
        Insert: {
          count?: number | null
          id?: string
          is_verified?: boolean | null
          last_updated?: string | null
        }
        Update: {
          count?: number | null
          id?: string
          is_verified?: boolean | null
          last_updated?: string | null
        }
        Relationships: []
      }
      visualization_history: {
        Row: {
          id: string
          repo_name: string
          repo_owner: string
          repo_url: string
          user_id: string
          visualized_at: string | null
        }
        Insert: {
          id?: string
          repo_name: string
          repo_owner: string
          repo_url: string
          user_id: string
          visualized_at?: string | null
        }
        Update: {
          id?: string
          repo_name?: string
          repo_owner?: string
          repo_url?: string
          user_id?: string
          visualized_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_room_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
