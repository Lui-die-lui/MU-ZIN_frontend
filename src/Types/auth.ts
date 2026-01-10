// Artist Status enum - 아티스트 전환 제출 현황(제출 없을 시 none)
export type ArtistStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";


// 로그인 요청 바디 데이터
export type SigninPayload = {
  email: string;
  password: string;
};

// 회원가입 요청 바디 데이터
export type SignupPayload = {
  email: string;
  password: string;
  passwordConfirm: string;
};

// 회원가입 요청 시 Optional인 바디 데이터
export type SignupErrors = Partial<Record<keyof SignupPayload, string>>;

// 로그인 유저의 핵심 데이터 - 로그인 성공 시 반환된 유저 정보 json으로 담음
export interface Principal {
  userId: number;
  email: string;
  username: string;
  profileImgUrl: string | null;
  emailVerified: boolean;
  artistStatus: ArtistStatus;
  roles: string[];

  canChangePassword: boolean;
  oauth2Provider: string | null;
}

// 상태 타입
export interface PrincipalState {
  principal: Principal | null; // principal 있는지 없는지
  isAuthenticated: boolean; // 로그인 상태 표시 여부
  login: (userData: Principal) => void; // 로그인 상태
  logout: () => void; // 로그아웃 상태
  setPrincipal: (userData: Principal | null) => void;
}
