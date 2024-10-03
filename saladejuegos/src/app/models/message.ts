import { Timestamp } from "firebase/firestore";

export interface Message {
  user: string;
  text: string;
  timestamp: Timestamp;
}