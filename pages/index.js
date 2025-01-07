import WeatherDisplay from "../components/WeatherDisplay";
import UploadClothesForm from "../components/UploadClothingForm";

const Index = () => {
  return (
    <div>
      <h1>天気と服装アプリ</h1>
      <WeatherDisplay prefectureId={13} /> {/* デフォルトで東京 (ID=13) */}
      <UploadClothesForm />
    </div>
  );
};

export default Index;
