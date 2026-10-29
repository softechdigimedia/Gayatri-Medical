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
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          booking_ref: string
          clinic_id: string | null
          consultation_notes: string | null
          created_at: string
          created_by: string | null
          department_id: string | null
          discount: number
          doctor_id: string
          end_time: string
          fee: number
          id: string
          patient_id: string
          reason: string | null
          start_time: string
          status: string
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_type?: string
          booking_ref?: string
          clinic_id?: string | null
          consultation_notes?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          discount?: number
          doctor_id: string
          end_time: string
          fee?: number
          id?: string
          patient_id: string
          reason?: string | null
          start_time: string
          status?: string
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          booking_ref?: string
          clinic_id?: string | null
          consultation_notes?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          discount?: number
          doctor_id?: string
          end_time?: string
          fee?: number
          id?: string
          patient_id?: string
          reason?: string | null
          start_time?: string
          status?: string
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_holidays: {
        Row: {
          clinic_id: string | null
          holiday_date: string
          id: string
          name: string
        }
        Insert: {
          clinic_id?: string | null
          holiday_date: string
          id?: string
          name: string
        }
        Update: {
          clinic_id?: string | null
          holiday_date?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_holidays_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string
          city: string
          closes_at: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          opens_at: string
          phone: string | null
          slug: string
        }
        Insert: {
          address: string
          city: string
          closes_at?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          opens_at?: string
          phone?: string | null
          slug: string
        }
        Update: {
          address?: string
          city?: string
          closes_at?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          opens_at?: string
          phone?: string | null
          slug?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      doctor_breaks: {
        Row: {
          doctor_id: string
          end_time: string
          id: string
          label: string | null
          start_time: string
          weekday: number
        }
        Insert: {
          doctor_id: string
          end_time: string
          id?: string
          label?: string | null
          start_time: string
          weekday: number
        }
        Update: {
          doctor_id?: string
          end_time?: string
          id?: string
          label?: string | null
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "doctor_breaks_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_leave: {
        Row: {
          created_at: string
          doctor_id: string
          end_date: string
          id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_leave_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_schedules: {
        Row: {
          doctor_id: string
          end_time: string
          id: string
          is_active: boolean
          max_appointments: number | null
          slot_minutes: number
          start_time: string
          weekday: number
        }
        Insert: {
          doctor_id: string
          end_time: string
          id?: string
          is_active?: boolean
          max_appointments?: number | null
          slot_minutes?: number
          start_time: string
          weekday: number
        }
        Update: {
          doctor_id?: string
          end_time?: string
          id?: string
          is_active?: boolean
          max_appointments?: number | null
          slot_minutes?: number
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "doctor_schedules_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          about: string | null
          clinic_id: string | null
          consultation_fee: number
          created_at: string
          department_id: string | null
          experience_years: number
          expertise: string[]
          full_name: string
          gender: string
          id: string
          is_active: boolean
          languages: string[]
          photo_url: string | null
          qualification: string
          rating: number
          registration_no: string | null
          review_count: number
          slug: string
          specialty: string
          supports_clinic: boolean
          supports_online: boolean
          user_id: string | null
        }
        Insert: {
          about?: string | null
          clinic_id?: string | null
          consultation_fee?: number
          created_at?: string
          department_id?: string | null
          experience_years?: number
          expertise?: string[]
          full_name: string
          gender?: string
          id?: string
          is_active?: boolean
          languages?: string[]
          photo_url?: string | null
          qualification: string
          rating?: number
          registration_no?: string | null
          review_count?: number
          slug: string
          specialty: string
          supports_clinic?: boolean
          supports_online?: boolean
          user_id?: string | null
        }
        Update: {
          about?: string | null
          clinic_id?: string | null
          consultation_fee?: number
          created_at?: string
          department_id?: string | null
          experience_years?: number
          expertise?: string[]
          full_name?: string
          gender?: string
          id?: string
          is_active?: boolean
          languages?: string[]
          photo_url?: string | null
          qualification?: string
          rating?: number
          registration_no?: string | null
          review_count?: number
          slug?: string
          specialty?: string
          supports_clinic?: boolean
          supports_online?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          appointment_id: string | null
          content: string | null
          created_at: string
          doctor_id: string | null
          file_url: string | null
          id: string
          kind: string
          patient_id: string
          title: string
        }
        Insert: {
          appointment_id?: string | null
          content?: string | null
          created_at?: string
          doctor_id?: string | null
          file_url?: string | null
          id?: string
          kind?: string
          patient_id: string
          title: string
        }
        Update: {
          appointment_id?: string | null
          content?: string | null
          created_at?: string
          doctor_id?: string | null
          file_url?: string | null
          id?: string
          kind?: string
          patient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          kind: string
          patient_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          patient_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          patient_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          blood_group: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          gender: string | null
          id: string
          phone: string
          profile_id: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          id?: string
          phone: string
          profile_id?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string
          profile_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string
          created_at: string
          id: string
          method: string
          reference: string | null
          status: string
        }
        Insert: {
          amount: number
          appointment_id: string
          created_at?: string
          id?: string
          method?: string
          reference?: string | null
          status?: string
        }
        Update: {
          amount?: number
          appointment_id?: string
          created_at?: string
          id?: string
          method?: string
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          doctor_id: string
          id: string
          patient_name: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          doctor_id: string
          id?: string
          patient_name: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          doctor_id?: string
          id?: string
          patient_name?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_set_role: {
        Args: {
          _grant: boolean
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      book_appointment: {
        Args: {
          _appointment_type: string
          _date: string
          _doctor_id: string
          _patient: Json
          _payment_method: string
          _reason: string
          _start: string
        }
        Returns: Json
      }
      cancel_appointment: {
        Args: { _appointment_id: string; _reason?: string }
        Returns: Json
      }
      claim_first_admin: { Args: never; Returns: boolean }
      get_doctor_slots: {
        Args: { _date: string; _doctor_id: string }
        Returns: {
          is_available: boolean
          reason: string
          slot_time: string
        }[]
      }
      next_available_slot: {
        Args: { _doctor_id: string }
        Returns: {
          slot_date: string
          slot_time: string
        }[]
      }
      reschedule_appointment: {
        Args: { _appointment_id: string; _date: string; _start: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "manager" | "admin" | "staff"
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
    Enums: {
      app_role: ["patient", "doctor", "manager", "admin", "staff"],
    },
  },
} as const
