
export interface ChatRoom {
  id: string;
  name: string;
  code: string;
  created_by: string;
  created_at: string;
  max_size: number;
  password: string | null;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
}

export interface RoomMember {
  room_id: string;
  user_id: string;
  joined_at: string;
}
