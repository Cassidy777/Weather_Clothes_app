/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ダークモードのトリガーを class に設定

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // ページディレクトリ内のファイル
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // コンポーネントディレクトリ内のファイル
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // アプリディレクトリ内のファイル（Next.js特有の場合）
    "./pages/**/*.{js,ts,jsx,tsx}", // ルートのpagesディレクトリ
    "./components/**/*.{js,ts,jsx,tsx}", // ルートのcomponentsディレクトリ
  ],
  theme: {
    extend: {
      colors: {
        // ライトモードのカラースキーム
        lightBackground: "#ffffff", // ライトモードの背景色
        lightForeground: "#000000", // ライトモードの文字色
        lightCard: "#f8f9fa", // ライトモードのカード背景
        lightButton: "#007bff", // ライトモードのボタン背景
        lightButtonHover: "#0056b3", // ライトモードのボタンホバー

        // ダークモードのカラースキーム
        darkBackground: "#121212", // ダークモードの背景色
        darkForeground: "#ffffff", // ダークモードの文字色
        darkCard: "#1e1e1e", // ダークモードのカード背景
        darkButton: "#374151", // ダークモードのボタン背景
        darkButtonHover: "#1f2937", // ダークモードのボタンホバー

        // 既存のアクセントカラー
        accent: "#001f3f", // 深い青（ボタンやアクセントに使用）
        accentHover: "#004080", // ボタンホバー時の青
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"], // 高級感のあるフォント
        sans: ["Arial", "Helvetica", "sans-serif"], // 補助的なフォント
      },
      borderRadius: {
        md: "0.375rem", // Tailwindの `rounded-md` と一致
      },
      backgroundImage: {
        'custom-pattern': "url('/background.png')", // 背景画像を追加
      },
    },
  },
  plugins: [],
};
