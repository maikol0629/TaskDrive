export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          username?: string | null
        }
        Relationships: []
      }
      project: {
        Row: {
          createdat: string | null
          description: string | null
          enddate: string | null
          id: string
          is_team_project: boolean | null
          name: string
          priority: Database["public"]["Enums"]["project_priority"] | null
          startdate: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updatedat: string | null
          userid: string
        }
        Insert: {
          createdat?: string | null
          description?: string | null
          enddate?: string | null
          id?: string
          is_team_project?: boolean | null
          name: string
          priority?: Database["public"]["Enums"]["project_priority"] | null
          startdate?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updatedat?: string | null
          userid: string
        }
        Update: {
          createdat?: string | null
          description?: string | null
          enddate?: string | null
          id?: string
          is_team_project?: boolean | null
          name?: string
          priority?: Database["public"]["Enums"]["project_priority"] | null
          startdate?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updatedat?: string | null
          userid?: string
        }
        Relationships: []
      }
      project_teams: {
        Row: {
          assigned_at: string | null
          assigned_by: string
          id: string
          project_id: string
          team_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by: string
          id?: string
          project_id: string
          team_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string
          id?: string
          project_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_teams_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_teams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_teams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_accessible_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      Task: {
        Row: {
          assigned_to: string | null
          createdat: string | null
          description: string | null
          duedate: string | null
          id: string
          priority: Database["public"]["Enums"]["priority_enum"]
          projectid: string | null
          status: Database["public"]["Enums"]["task_status_enum"]
          title: string
          updatedat: string | null
          userid: string
        }
        Insert: {
          assigned_to?: string | null
          createdat?: string | null
          description?: string | null
          duedate?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_enum"]
          projectid?: string | null
          status?: Database["public"]["Enums"]["task_status_enum"]
          title: string
          updatedat?: string | null
          userid: string
        }
        Update: {
          assigned_to?: string | null
          createdat?: string | null
          description?: string | null
          duedate?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_enum"]
          projectid?: string | null
          status?: Database["public"]["Enums"]["task_status_enum"]
          title?: string
          updatedat?: string | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "Task_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "user_accessible_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          responded_at: string | null
          role: Database["public"]["Enums"]["team_role"] | null
          status: Database["public"]["Enums"]["invitation_status"] | null
          team_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by: string
          responded_at?: string | null
          role?: Database["public"]["Enums"]["team_role"] | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          team_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          responded_at?: string | null
          role?: Database["public"]["Enums"]["team_role"] | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          invited_by: string
          joined_at: string | null
          role: Database["public"]["Enums"]["team_role"] | null
          status: Database["public"]["Enums"]["member_status"] | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_role"] | null
          status?: Database["public"]["Enums"]["member_status"] | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_role"] | null
          status?: Database["public"]["Enums"]["member_status"] | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_accessible_projects: {
        Row: {
          createdat: string | null
          description: string | null
          enddate: string | null
          id: string | null
          is_team_project: boolean | null
          name: string | null
          priority: Database["public"]["Enums"]["project_priority"] | null
          startdate: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updatedat: string | null
          userid: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_team_invitation: {
        Args: { invitation_id: string }
        Returns: boolean
      }
      auth_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      cleanup_expired_invitations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_owners: {
        Args: { team_id_to_check: string }
        Returns: number
      }
      create_team_with_owner: {
        Args: { team_name: string; team_description?: string }
        Returns: string
      }
      get_user_projects: {
        Args: { user_id: string }
        Returns: {
          id: string
          name: string
          description: string
          status: Database["public"]["Enums"]["project_status"]
          priority: Database["public"]["Enums"]["project_priority"]
          startdate: string
          enddate: string
          userid: string
          createdat: string
          updatedat: string
          is_team_project: boolean
        }[]
      }
      get_user_team_role_simple: {
        Args: { team_uuid: string; user_uuid: string }
        Returns: string
      }
      is_admin_of: {
        Args: { team_id_to_check: string }
        Returns: boolean
      }
      is_member_of: {
        Args: { team_id_to_check: string }
        Returns: boolean
      }
      is_owner_of: {
        Args: { team_id_to_check: string }
        Returns: boolean
      }
      is_team_admin: {
        Args: { user_id: string; team_id: string }
        Returns: boolean
      }
      is_team_admin_for_policies: {
        Args: { user_id: string; team_id: string }
        Returns: boolean
      }
      is_team_admin_safe: {
        Args: { user_id: string; team_id: string }
        Returns: boolean
      }
      is_team_member_simple: {
        Args: { team_uuid: string; user_uuid: string }
        Returns: boolean
      }
      user_is_team_member: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: boolean
      }
      user_team_role: {
        Args: { p_team_id: string; p_user_id: string }
        Returns: string
      }
      user_team_role_safe: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: string
      }
      user_team_role_simple: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: string
      }
    }
    Enums: {
      invitation_status: "pending" | "accepted" | "rejected" | "expired"
      member_status: "active" | "inactive" | "pending"
      Priority: "LOW" | "MEDIUM" | "HIGH"
      priority_enum: "LOW" | "MEDIUM" | "HIGH"
      project_priority: "low" | "medium" | "high"
      project_status: "active" | "completed" | "on_hold" | "cancelled"
      task_status_enum: "TODO" | "IN_PROGRESS" | "COMPLETED"
      TaskStatus: "TODO" | "IN_PROGRESS" | "COMPLETED"
      team_role: "owner" | "admin" | "member" | "viewer"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invitation_status: ["pending", "accepted", "rejected", "expired"],
      member_status: ["active", "inactive", "pending"],
      Priority: ["LOW", "MEDIUM", "HIGH"],
      priority_enum: ["LOW", "MEDIUM", "HIGH"],
      project_priority: ["low", "medium", "high"],
      project_status: ["active", "completed", "on_hold", "cancelled"],
      task_status_enum: ["TODO", "IN_PROGRESS", "COMPLETED"],
      TaskStatus: ["TODO", "IN_PROGRESS", "COMPLETED"],
      team_role: ["owner", "admin", "member", "viewer"],
    },
  },
} as const
