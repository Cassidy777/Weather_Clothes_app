import { useState, useEffect } from "react";
import API from "../lib/axios";

const WeatherDisplay = () => {
  const [prefectureId, setPrefectureId] = useState(1); // 初期値として北海道を設定
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    try {
      const response = await API.get(`/weather/${prefectureId}`);
      setWeather(response.data);
    } catch (error) {
      console.error("天気データの取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [prefectureId]);

  return (
    <div>
      <h3>都道府県の天気情報</h3>
      <select
        value={prefectureId}
        onChange={(e) => setPrefectureId(Number(e.target.value))}
      >
        <option value="1">北海道</option>
        <option value="2">青森県</option>
        <option value="3">岩手県</option>
        <option value="4">宮城県</option>
        <option value="5">秋田県</option>
        {/* 他の都道府県を追加 */}
      </select>
      {weather ? (
        <div>
          <h4>現在の天気:</h4>
          <p>気温: {weather.current_weather.temperature}℃</p>
          <p>降水量: {weather.current_weather.precipitation}mm</p>

          <h4>今日の予報:</h4>
          <p>最高気温: {weather.daily.temperature_2m_max[0]}℃</p>
          <p>最低気温: {weather.daily.temperature_2m_min[0]}℃</p>
          <p>降水量: {weather.daily.precipitation_sum[0]}mm</p>
        </div>
      ) : (
        <p>天気データを取得中...</p>
      )}
    </div>
  );
};

export default WeatherDisplay;
