import React, { useState } from "react";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";

function ServiceRegionField() {
  const serviceRegions = useArtistApplyFormStore((s) => s.serviceRegions);
  const setField = useArtistApplyFormStore((s) => s.setField);

  const [region1DepthName, setRegion1DepthName] = useState("");
  const [region2DepthName, setRegion2DepthName] = useState("");

  // console.log("ServiceRegionField render");
  // console.log("serviceRegions:", serviceRegions);

  const handleAddRegion = () => {
    const region1 = region1DepthName.trim();
    const region2 = region2DepthName.trim();

    if (!region1 || !region2) return;
    if (serviceRegions.length >= 5) {
      alert("최대 5개까지 지정 가능합니다.");
      setRegion1DepthName("");
      setRegion2DepthName("");
      return;
    }

    const isDuplicate = serviceRegions.some(
      (region) =>
        region.region1DepthName === region1 &&
        region.region2DepthName === region2,
    );

    if (isDuplicate) return;

    const next = [
      ...serviceRegions,
      {
        region1DepthName: region1,
        region2DepthName: region2,
      },
    ];

    // console.log("next serviceRegions:", next);
    setField("serviceRegions", next);

    setRegion1DepthName("");
    setRegion2DepthName("");
  };

  const handleRemoveRegion = (
    region1DepthName: string,
    region2DepthName: string,
  ) => {
    const next = serviceRegions.filter(
      (region) =>
        !(
          region.region1DepthName === region1DepthName &&
          region.region2DepthName === region2DepthName
        ),
    );

    // console.log("after remove:", next);
    setField("serviceRegions", next);
  };

  return (
    <div>
      <h4>서비스 가능 지역</h4>

      <div>
        <input
          type="text"
          placeholder="시/도"
          value={region1DepthName}
          onChange={(e) => setRegion1DepthName(e.target.value)}
        />
        <input
          type="text"
          placeholder="시/군/구"
          value={region2DepthName}
          onChange={(e) => setRegion2DepthName(e.target.value)}
        />
        <button type="button" onClick={handleAddRegion}>
          지역 추가
        </button>
      </div>

      <div>
        {serviceRegions.length === 0 ? (
          <p>선택된 서비스 지역이 없습니다.</p>
        ) : (
          serviceRegions.map((region) => {
            const key = `${region.region1DepthName}-${region.region2DepthName}`;

            return (
              <div key={key}>
                <span>
                  {region.region1DepthName} {region.region2DepthName}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveRegion(
                      region.region1DepthName,
                      region.region2DepthName,
                    )
                  }
                >
                  삭제
                </button>
              </div>
            );
          })
        )}
      </div>

      <p>{serviceRegions.length}/5</p>
    </div>
  );
}

export default ServiceRegionField;
