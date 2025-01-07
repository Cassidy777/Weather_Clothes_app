import { useState } from "react";
import API from "../lib/axios";

const UploadClothingForm = () => {
  const [image, setImage] = useState(null);
  const [warmthLevel, setWarmthLevel] = useState(1);
  const [waterproof, setWaterproof] = useState(false);
  const [itemType, setItemType] = useState("トップス");
  const [message, setMessage] = useState("");

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("user_id", 1); // 仮の user_id、ログインしたユーザーIDに変更
    formData.append("image", image); // `UploadFile`として送信
    formData.append("warmth_level", warmthLevel);
    formData.append("waterproof", waterproof);
    formData.append("item_type", itemType);

    try {
      const response = await API.post("/clothes/upload-clothes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("服装の登録に失敗しました:", error.response?.data || error.message);
      setMessage("服装の登録に失敗しました。");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>服装を登録</h2>
      <div>
        <label htmlFor="image">画像:</label>
        <input type="file" id="image" onChange={handleImageChange} required />
      </div>
      <div>
        <label htmlFor="warmth_level">暖かさレベル (1-5):</label>
        <input
          type="number"
          id="warmth_level"
          value={warmthLevel}
          onChange={(e) => setWarmthLevel(e.target.value)}
          min="1"
          max="5"
          required
        />
      </div>
      <div>
        <label htmlFor="waterproof">防水性:</label>
        <input
          type="checkbox"
          id="waterproof"
          checked={waterproof}
          onChange={(e) => setWaterproof(e.target.checked)}
        />
      </div>
      <div>
        <label htmlFor="item_type">アイテムタイプ:</label>
        <select
          id="item_type"
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
        >
          <option value="トップス">トップス</option>
          <option value="ボトムス">ボトムス</option>
          <option value="アウター">アウター</option>
          <option value="シューズ">シューズ</option>
          <option value="アクセサリー">アクセサリー</option>
        </select>
      </div>
      <button type="submit">登録</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UploadClothingForm;

