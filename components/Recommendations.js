import { useEffect, useState } from "react";
import API from "../lib/axios";

const Recommendations = ({ temperature, isRaining }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await API.get("/clothes/recommend-clothes", {
          params: { temperature, is_raining: isRaining },
        });
        setRecommendations(response.data);
      } catch (error) {
        console.error("服装提案の取得に失敗しました:", error.response || error.message);
      }
    };

    if (temperature !== undefined && isRaining !== undefined) {
      fetchRecommendations();
    }
  }, [temperature, isRaining]); // temperature と isRaining が変更されたら再取得

  return (
    <div>
      <h2>おすすめの服装</h2>
      <ul>
        {recommendations.map((item) => (
          <li key={item.id} style={{ marginBottom: "20px" }}>
            <p>アイテムタイプ: {item.item_type}</p>
            <p>暖かさレベル: {item.warmth_level}</p>
            <p>{item.waterproof ? "防水性あり" : "防水性なし"}</p>
            {item.image_url && (
              <img
                src={`http://127.0.0.1:8000/${item.image_url}`}
                alt={item.item_type}
                style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Recommendations;
