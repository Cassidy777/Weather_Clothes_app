import { useEffect, useState } from "react";
import axios from "axios";
import UploadClothingForm from "../components/UploadClothingForm";
import Recommendations from "../components/Recommendations";

// 環境変数から API URL を取得
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// 天気APIのエンドポイント
const openMeteoApiBase = "https://api.open-meteo.com/v1/forecast";

// 天気コードを記号にマッピング
const weatherCodeToSymbol = (code) => {
  if (code === 0) return "☀"; // 晴れ
  if (code >= 1 && code <= 3) return "☁"; // 曇り
  if (code >= 61 && code <= 67) return "☂"; // 雨
  if (code >= 71 && code <= 77) return "☃"; // 雪
  return "☁"; // その他は曇り
};

const Dashboard = () => {
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [dailyWeather, setDailyWeather] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // 都道府県リストを取得
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/locations`);
        setLocationList(response.data);
        setLocation(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // 天気情報を取得
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

  return (
    <div>
      <h1>ダッシュボード</h1>

      <div>
        <h2>都道府県の天気</h2>
        <select
          onChange={(e) =>
            setLocation(locationList.find((loc) => loc.id === parseInt(e.target.value)))
          }
          value={location?.id || ""}
        >
          {locationList.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <div>
          <h3>一週間の天気</h3>
          <select onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
            {dailyWeather.map((day) => (
              <option key={day.date} value={day.date}>
                {day.date} - 最高気温: {day.maxTemp}°C, 最低気温: {day.minTemp}°C, 降水量:{" "}
                {day.precipitation}mm, 天気: {weatherCodeToSymbol(day.weatherCode)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3>{selectedDate} の一時間ごとの天気</h3>
          {filteredHourlyWeather.length > 0 ? (
            filteredHourlyWeather.map((weather, index) => (
              <div key={index}>
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
      </div>

      <div>
        <UploadClothingForm />
      </div>

      <div>
        <Recommendations
          temperature={
            filteredHourlyWeather.length > 0
              ? filteredHourlyWeather[0].temperature
              : dailyWeather[0]?.maxTemp
          }
          isRaining={
            filteredHourlyWeather.length > 0
              ? filteredHourlyWeather[0].precipitation > 0
              : dailyWeather[0]?.precipitation > 0
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;
