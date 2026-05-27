import { Deck } from "@/components/Deck";
import { slides } from "@/content/slides";

export default function Home() {
  return <Deck slides={slides} />;
}
