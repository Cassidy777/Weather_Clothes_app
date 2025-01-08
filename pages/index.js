import { useEffect, useState } from "react";
import axios from "axios";
import UploadClothingForm from "../components/UploadClothingForm";
import Recommendations from "../components/Recommendations";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const openMeteoApiBase = "https://api.open-meteo.com/v1/forecast";

const weatherCodeToSymbol = (code) => {
  if (code === 0) return "☀";
  if (code >= 1 && code <= 3) return "☁";
  if (code >= 61 && code <= 67) return "☂";
  if (code >= 71 && code <= 77) return "☃";
  return "☁";
};

const Dashboard = () => {
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [dailyWeather, setDailyWeather] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [interval, setInterval] = useState(1); // 時間間隔 (1, 3, 6, 12)
  const [darkMode, setDarkMode] = useState(false); // ダークモードの状態
  const [showUpload, setShowUpload] = useState(false); // 服装登録画面の表示切り替え

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/locations/`);
        setLocationList(response.data);
        setLocation(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `${openMeteoApiBase}?latitude=${location.latitude}&longitude=${location.longitude}&timezone=Asia/Tokyo&hourly=weather_code,temperature_2m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true`
        );

        const hourlyData = res.data.hourly;
        const formattedHourlyData = hourlyData.time.map((time, index) => ({
          datetime: time,
          temperature: hourlyData.temperature_2m[index],
          precipitation: hourlyData.precipitation[index],
          weatherCode: hourlyData.weather_code[index],
        }));
        setHourlyWeather(formattedHourlyData);

        const dailyData = res.data.daily;
        const formattedDailyData = dailyData.time.map((date, index) => ({
          date,
          maxTemp: dailyData.temperature_2m_max[index],
          minTemp: dailyData.temperature_2m_min[index],
          precipitation: dailyData.precipitation_sum[index],
          weatherCode: dailyData.weather_code[index],
        }));
        setDailyWeather(formattedDailyData);

        setSelectedDate(dailyData.time[0]);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
    };

    fetchWeather();
  }, [location]);

  const filteredHourlyWeather = hourlyWeather.filter((weather) =>
    weather.datetime.startsWith(selectedDate)
  );

  const filteredByInterval = filteredHourlyWeather.filter((_, index) => index % interval === 0);

  const recommendationTemperature =
    filteredHourlyWeather.length > 0 ? filteredHourlyWeather[0].temperature : dailyWeather[0]?.maxTemp;

  const recommendationIsRaining =
    filteredHourlyWeather.length > 0
      ? filteredHourlyWeather[0].precipitation > 0
      : dailyWeather[0]?.precipitation > 0;

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="bg-background dark:bg-gray-900 text-foreground dark:text-white min-h-screen p-6">
        {/* ヘッダー */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif">服装提案アプリ</h1>
          <button
            className="p-2 bg-gray-800 text-white rounded-full"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀" : "🌙"}
          </button>
        </header>

        {/* 左上の服装登録ボタン */}
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="mb-6 px-4 py-2 bg-accent text-white rounded-md"
        >
          服装登録
        </button>

        {/* 服装登録画面 */}
        {showUpload && (
          <section className="mb-6">
            <UploadClothingForm />
          </section>
        )}

        {/* メインエリア */}
        <main className="grid grid-cols-1 md:grid-cols-8 gap-6">
          {/* 左カラム: 都道府県、日付、時間間隔選択 */}
          <div className="md:col-span-2 bg-black/50 dark:bg-gray-800 p-4 rounded-md shadow-lg">
            <h2 className="text-xl font-serif mb-4">設定</h2>
            <div className="mb-4">
              <h3 className="font-serif mb-2">都道府県を選択</h3>
              <select
                onChange={(e) =>
                  setLocation(locationList.find((loc) => loc.id === parseInt(e.target.value)))
                }
                value={location?.id || ""}
                className="w-full p-2 bg-background dark:bg-gray-800 text-foreground dark:text-white border border-foreground rounded-md"
              >
                {locationList.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <h3 className="font-serif mb-2">日付を選択</h3>
              <select
                onChange={(e) => setSelectedDate(e.target.value)}
                value={selectedDate}
                className="w-full p-2 bg-background dark:bg-gray-800 text-foreground dark:text-white border border-foreground rounded-md"
              >
                {dailyWeather.map((day) => (
                  <option key={day.date} value={day.date}>
                    {day.date} - 最高気温: {day.maxTemp}°C, 最低気温: {day.minTemp}°C
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="font-serif mb-2">時間間隔を選択</h3>
              <select
                onChange={(e) => setInterval(parseInt(e.target.value))}
                value={interval}
                className="w-full p-2 bg-background dark:bg-gray-800 text-foreground dark:text-white border border-foreground rounded-md"
              >
                <option value={1}>1時間ごと</option>
                <option value={3}>3時間ごと</option>
                <option value={6}>6時間ごと</option>
                <option value={12}>12時間ごと</option>
              </select>
            </div>
          </div>

          {/* 中央カラム: 天気情報 */}
          <div className="md:col-span-3 bg-black/50 dark:bg-gray-800 p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-serif mb-4">{selectedDate} の天気</h2>
            {filteredByInterval.length > 0 ? (
              filteredByInterval.map((weather, index) => (
                <div key={index} className="mb-4">
                  <p>時間: {new Date(weather.datetime).toLocaleTimeString()}</p>
                  <p>気温: {weather.temperature}°C</p>
                  <p>降水量: {weather.precipitation}mm</p>
                  <p>天気: {weatherCodeToSymbol(weather.weatherCode)}</p>
                </div>
              ))
            ) : (
              <p>天気データを取得中...</p>
            )}
          </div>

          {/* 右カラム: おすすめの服装 */}
          <div className="md:col-span-3 bg-black/50 dark:bg-gray-800 p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-serif mb-4">おすすめの服装</h2>
            <Recommendations
              temperature={recommendationTemperature}
              isRaining={recommendationIsRaining}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
