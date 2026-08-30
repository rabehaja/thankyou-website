export type GuestStatus = "active" | "pending" | "archived";
export type CardStatus = "draft" | "published" | "archived";

export type Settings = {
  id: number;
  couple_names: string;
  wedding_date: string | null;
  venue: string | null;
  thank_you_message: string | null;
  couple_photo_url: string | null;
  rsvp_active: boolean;
  updated_at: string;
}

export type Guest = {
  id: string;
  full_name: string;
  email: string | null;
  table_assignment: string | null;
  tags: string[];
  rsvp_received: boolean;
  status: GuestStatus;
  created_at: string;
  updated_at: string;
}

export type ThankYouCard = {
  id: string;
  guest_id: string;
  slug: string;
  greeting_message: string;
  status: CardStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type GalleryPhoto = {
  id: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
}

export type LiveCard = {
  greeting_message: string;
  guest_name: string;
}

export type Database = {
  public: {
    Tables: {
      settings: {
        Row: Settings;
        Insert: Partial<Settings>;
        Update: Partial<Settings>;
        Relationships: [];
      };
      guests: {
        Row: Guest;
        Insert: Partial<Guest> & Pick<Guest, "full_name">;
        Update: Partial<Guest>;
        Relationships: [];
      };
      thank_you_cards: {
        Row: ThankYouCard;
        Insert: Partial<ThankYouCard> & Pick<ThankYouCard, "guest_id" | "slug">;
        Update: Partial<ThankYouCard>;
        Relationships: [
          {
            foreignKeyName: "thank_you_cards_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: true;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
        ];
      };
      gallery_photos: {
        Row: GalleryPhoto;
        Insert: Partial<GalleryPhoto> & Pick<GalleryPhoto, "storage_path">;
        Update: Partial<GalleryPhoto>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_live_card: {
        Args: { card_slug: string };
        Returns: LiveCard[];
      };
    };
    Enums: {
      guest_status: GuestStatus;
      card_status: CardStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
