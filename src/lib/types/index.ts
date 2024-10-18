export type Recommendation = {
  title: string;
  subtitle: string;
  link?: string;
  price?: string;
  thumbnail?: string;
};
export type Message = {
  id?: string;
  text: string;
  sender: "user" | "bot";
  recommendations?: Recommendation[];
  feedback?: "positive" | "negative" | null;
};
