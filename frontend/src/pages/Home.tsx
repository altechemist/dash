import ImageCard from "../components/ImageCard";
import RightImageCard from "../components/RightImageCard";
import TripleImageCard from "../components/TripleImageCard";

export default function Home() {
  return (
    <div className="container-fluid">
      {/* Two Cards */}
      <ImageCard />
      <RightImageCard />

      {/* Triple Cards */}
      <TripleImageCard />
    </div>
  );
}
