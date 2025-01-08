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
    formData.append("image", image); // UploadFileとして送信
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
    <form onSubmit={handleSubmit} className="bg-black/50 dark:bg-gray-800 p-4 rounded-md shadow-lg">
      <h2 className="text-xl font-serif mb-4">服装を登録</h2>
      <div className="mb-4">
        <label htmlFor="image" className="block font-serif mb-2">
          画像:
        </label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          required
          className="p-2 bg-background dark:bg-gray-700 text-foreground dark:text-white border border-foreground rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="warmth_level" className="block font-serif mb-2">
          暖かさレベル (1-5):
        </label>
        <select
          id="warmth_level"
          value={warmthLevel}
          onChange={(e) => setWarmthLevel(e.target.value)}
          className="p-2 bg-background dark:bg-gray-700 text-foreground dark:text-white border border-foreground rounded-md"
        >
          {[1, 2, 3, 4, 5].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="waterproof" className="block font-serif mb-2">
          防水性:
        </label>
        <input
          type="checkbox"
          id="waterproof"
          checked={waterproof}
          onChange={(e) => setWaterproof(e.target.checked)}
          className="bg-background dark:bg-gray-700 text-foreground dark:text-white border border-foreground rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="item_type" className="block font-serif mb-2">
          アイテムタイプ:
        </label>
        <select
          id="item_type"
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          className="p-2 bg-background dark:bg-gray-700 text-foreground dark:text-white border border-foreground rounded-md"
        >
          <option value="トップス">トップス</option>
          <option value="ボトムス">ボトムス</option>
          <option value="アウター">アウター</option>
          <option value="シューズ">シューズ</option>
          <option value="アクセサリー">アクセサリー</option>
        </select>
      </div>
      <button
        type="submit"
        className="py-2 bg-accent text-white rounded-md hover:bg-accentHover transition duration-200"
      >
        登録
      </button>
      {message && <p className="mt-4 text-center text-sm text-green-500">{message}</p>}
    </form>
  );
};

export default UploadClothingForm;
