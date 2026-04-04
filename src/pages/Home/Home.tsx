// /** @jsxImportSource @emotion/react */
// import * as s from "./styles";
import { Map, useKakaoLoader } from "react-kakao-maps-sdk";

function Home() {
  const [loading, error] = useKakaoLoader({
    // appkey: import.meta.env.VITE_KAKAO_MAP_JS_KEY,
  });

  if (loading) return <div>지도 불러오는 중...</div>;
  if (error) return <div>지도 불러오기 실패</div>;

  return (
    <Map
      center={{ lat: 35.1379222, lng: 129.05562775 }}
      style={{ width: "100%", height: "420px" }}
      level={4}
    />
  );
}

export default Home;
