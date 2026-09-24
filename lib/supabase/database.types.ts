export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      approvals: {
        Row: {
          action: string | null
          actioned_at: string | null
          approver_id: string | null
          approver_role: string | null
          event_id: string | null
          id: string
          remark: string
        }
        Insert: {
          action?: string | null
          actioned_at?: string | null
          approver_id?: string | null
          approver_role?: string | null
          event_id?: string | null
          id?: string
          remark: string
        }
        Update: {
          action?: string | null
          actioned_at?: string | null
          approver_id?: string | null
          approver_role?: string | null
          event_id?: string | null
          id?: string
          remark?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          id: string
          issued_at: string | null
          registration_id: string | null
          type: string | null
          verification_code: string | null
        }
        Insert: {
          id?: string
          issued_at?: string | null
          registration_id?: string | null
          type?: string | null
          verification_code?: string | null
        }
        Update: {
          id?: string
          issued_at?: string | null
          registration_id?: string | null
          type?: string | null
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          department_id: string | null
          faculty_advisor_id: string | null
          head_user_id: string | null
          id: string
          name: string | null
          type: string | null
        }
        Insert: {
          department_id?: string | null
          faculty_advisor_id?: string | null
          head_user_id?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Update: {
          department_id?: string | null
          faculty_advisor_id?: string | null
          head_user_id?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clubs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_faculty_advisor_id_fkey"
            columns: ["faculty_advisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_head_user_id_fkey"
            columns: ["head_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string | null
          hod_user_id: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          hod_user_id?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string | null
          hod_user_id?: string | null
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_hod_user_id_fkey"
            columns: ["hod_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_posts: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          poster_url: string
          registration_url: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          poster_url: string
          registration_url?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          poster_url?: string
          registration_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_posts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          club_head_id: string | null
          club_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          expected_attendance: number | null
          id: string
          ktu_activity_points_category: string | null
          principal_meeting_reason: string | null
          principal_meeting_time: string | null
          special_requirements: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          category?: string | null
          club_head_id?: string | null
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          expected_attendance?: number | null
          id?: string
          ktu_activity_points_category?: string | null
          principal_meeting_reason?: string | null
          principal_meeting_time?: string | null
          special_requirements?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          category?: string | null
          club_head_id?: string | null
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          expected_attendance?: number | null
          id?: string
          ktu_activity_points_category?: string | null
          principal_meeting_reason?: string | null
          principal_meeting_time?: string | null
          special_requirements?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_club_head_id_fkey"
            columns: ["club_head_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          message: string | null
          read: boolean | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          attended: boolean | null
          event_id: string | null
          id: string
          registered_at: string | null
          status: string | null
          student_id: string | null
        }
        Insert: {
          attended?: boolean | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          status?: string | null
          student_id?: string | null
        }
        Update: {
          attended?: boolean | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          department_id: string | null
          email: string | null
          id: string
          name: string | null
          requested_role: string | null
          role: string[] | null
          roll_number: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          email?: string | null
          id: string
          name?: string | null
          requested_role?: string | null
          role?: string[] | null
          roll_number?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          email?: string | null
          id?: string
          name?: string | null
          requested_role?: string | null
          role?: string[] | null
          roll_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          capacity: number | null
          department_id: string | null
          features: Json | null
          id: string
          name: string | null
          svg_element_id: string | null
        }
        Insert: {
          capacity?: number | null
          department_id?: string | null
          features?: Json | null
          id?: string
          name?: string | null
          svg_element_id?: string | null
        }
        Update: {
          capacity?: number | null
          department_id?: string | null
          features?: Json | null
          id?: string
          name?: string | null
          svg_element_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

