import { Avatar } from "./styles";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

// 프로필 카드 전체 섹션
export const Card = styled.section`
  width: 100%;
  box-sizing: border-box;
  /* background: #eef3f7; */
  border-radius: 18px;
  padding: 34px 16px;
  margin-bottom: 30px;

  display: grid;
  justify-items: center;
  gap: 10px;
`;
// 프로필 사진 섹션
export const AvatarWrap = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
`;

// 프로필 사진 들어가는 자리
export const AvatarCircle = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  overflow: hidden;

  background: #5a4038;
  display: grid;
  place-items: center;
`;

// 아바타 텍스트(이미지 없을 때 이름이 들어감)
export const AvatarText = styled.span`
  color: #ffffff;
  font-weight: 900;
  font-size: 34px;
  letter-spacing: -0.6px;
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const EditPicBtn = styled.button`
  position: absolute;
  right: -2px;
  bottom: -2px;

  width: 30px;
  height: 30px;
  border-radius: 50px;

  display: grid;
  place-items: center;

  /* border: 2px solid #eef3f7; */
  border: none;
  background: #ffffff;
  /* color: #111827; */

  cursor: pointer;

  /* shadow */
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.08),
    0 6px 16px rgba(17, 24, 39, 0.10);


  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const EditIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;

export const UserName = styled.div`
  margin-top: 6px;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.6px;
  color: #111827;
`;

export const Email = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #374151;
`;

export const StateText = styled.div`
  font-size: 10px;
  color: red;
`
