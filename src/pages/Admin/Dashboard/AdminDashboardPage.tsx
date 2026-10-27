/** @jsxImportSource @emotion/react */
import { Link, useSearchParams } from "react-router-dom";
import * as a from "../styles";
import * as s from "./styles";
import ColumnChart from "./ColumnChart";
import BarList from "./BarList";
import { useAdminDashboard } from "../../../hooks/admin/useAdmin";
import type { DashboardDays } from "../../../Types/adminTypes";

const DAYS: DashboardDays[] = [7, 30, 90];

const SOURCE_LABEL: Record<string, string> = {
  DIRECT: "직접 방문",
  SEARCH: "검색",
  SOCIAL: "SNS · 블로그",
  REFERRAL: "다른 사이트",
  CAMPAIGN: "광고 · 캠페인 링크",
};

const METHOD_LABEL: Record<string, string> = {
  EMAIL: "이메일",
  GOOGLE: "구글",
  KAKAO: "카카오",
  NAVER: "네이버",
};

const LANDING_LABEL: Record<string, string> = {
  "/": "메인",
  "/lessons": "레슨 찾기",
  "/artists": "아티스트 찾기",
  "/artists/:id": "아티스트 상세",
  "/hobby-finder": "내 음악 스타일 찾기",
  "/assistant": "AI 내비게이터",
  "/signin": "로그인",
  "/signup": "회원가입",
};

const num = (n: number) => n.toLocaleString("ko-KR");
const md = (iso: string) => `${Number(iso.slice(5, 7))}.${Number(iso.slice(8, 10))}`;

// 이전 기간 대비 (이전이 0이면 비교하지 않음)
function Delta({ now, prev }: { now: number; prev: number }) {
  if (prev === 0) return <span css={s.delta}>{now > 0 ? "이전 기간 기록 없음" : "-"}</span>;
  const diff = Math.round(((now - prev) / prev) * 100);
  const sign = diff > 0 ? "▲" : diff < 0 ? "▼" : "";
  return (
    <span css={s.delta}>
      {sign} {Math.abs(diff)}% <span css={s.deltaSub}>이전 {num(prev)}</span>
    </span>
  );
}

// 관리자 > 대시보드 (?days=7|30|90)
//  방문자는 브라우저 기준(하루 1번), 샘플 계정은 회원 수치에서 빠져요
function AdminDashboardPage() {
  const [params, setParams] = useSearchParams();
  const raw = Number(params.get("days"));
  const days: DashboardDays = (DAYS as number[]).includes(raw) ? (raw as DashboardDays) : 30;
  const q = useAdminDashboard(days);
  const d = q.data;

  const k = d?.kpis;
  const conversion = k && k.newVisitors > 0 ? Math.round((k.newUsers / k.newVisitors) * 1000) / 10 : null;
  const todo = k ? k.openFlags + k.openReports + k.pendingArtists : 0;

  return (
    <div css={a.page}>
      <div css={s.topRow}>
        <div css={a.header}>
          <h1 css={a.title}>대시보드</h1>
          <p css={a.desc}>
            {d ? `${d.from.replaceAll("-", ".")} ~ ${d.to.replaceAll("-", ".")}` : "가입자와 방문·유입 현황이에요."}
          </p>
        </div>
        <div css={s.segment} role="group" aria-label="기간">
          {DAYS.map((v) => (
            <button
              key={v}
              type="button"
              css={s.segBtn(v === days)}
              aria-pressed={v === days}
              onClick={() => setParams(v === 30 ? {} : { days: String(v) })}
            >
              {v}일
            </button>
          ))}
        </div>
      </div>

      {q.isLoading ? (
        <div css={a.stateBox}>불러오는 중...</div>
      ) : q.isError || !d || !k ? (
        <div css={a.stateBox}>
          대시보드를 불러오지 못했어요.
          <button type="button" css={a.textBtn} onClick={() => q.refetch()}>
            다시 불러오기
          </button>
        </div>
      ) : (
        <div css={s.stack} aria-busy={q.isFetching}>
          {todo > 0 && (
            <div css={s.todo} role="note">
              <strong>확인할 일</strong>
              {k.openFlags > 0 && <Link to="/admin/moderation">이상행동 감지 {num(k.openFlags)}건</Link>}
              {k.openReports > 0 && <Link to="/admin/moderation?tab=reports">신고 {num(k.openReports)}건</Link>}
              {k.pendingArtists > 0 && <Link to="/admin/artist-applications">아티스트 심사 {num(k.pendingArtists)}건</Link>}
            </div>
          )}

          <section css={s.tiles} aria-label="주요 수치">
            <div css={s.tile}>
              <span css={s.tileLabel}>방문자</span>
              <strong css={s.tileValue}>{num(k.visitors)}</strong>
              <Delta now={k.visitors} prev={k.visitorsPrev} />
            </div>
            <div css={s.tile}>
              <span css={s.tileLabel}>신규 가입</span>
              <strong css={s.tileValue}>{num(k.newUsers)}</strong>
              <Delta now={k.newUsers} prev={k.newUsersPrev} />
            </div>
            <div css={s.tile}>
              <span css={s.tileLabel}>가입 전환율</span>
              <strong css={s.tileValue}>{conversion == null ? "-" : `${conversion}%`}</strong>
              <span css={s.delta}>처음 온 방문자 {num(k.newVisitors)}명 중 가입</span>
            </div>
            <div css={s.tile}>
              <span css={s.tileLabel}>전체 회원</span>
              <strong css={s.tileValue}>{num(k.totalUsers)}</strong>
              <span css={s.delta}>
                아티스트 {num(k.approvedArtists)} · 정지 {num(k.suspendedUsers)}
              </span>
            </div>
          </section>

          <div css={s.grid2}>
            <section css={s.card}>
              <h2 css={s.cardTitle}>날짜별 방문자</h2>
              <ColumnChart
                title="날짜별 방문자"
                unit="명"
                data={d.daily.map((p) => ({ key: p.date, label: md(p.date), value: p.visitors }))}
              />
            </section>
            <section css={s.card}>
              <h2 css={s.cardTitle}>날짜별 신규 가입</h2>
              <ColumnChart
                title="날짜별 신규 가입"
                unit="명"
                data={d.daily.map((p) => ({ key: p.date, label: md(p.date), value: p.signups }))}
              />
            </section>
          </div>

          <div css={s.grid3}>
            <section css={s.card}>
              <h2 css={s.cardTitle}>유입 경로</h2>
              <p css={s.cardDesc}>방문(브라우저·날짜별 1번)을 어디서 들어왔는지로 나눴어요.</p>
              <BarList items={d.sources} label={(n) => SOURCE_LABEL[n] ?? n} />
            </section>
            <section css={s.card}>
              <h2 css={s.cardTitle}>들어온 사이트</h2>
              <p css={s.cardDesc}>검색·SNS·다른 사이트 중 많이 들어온 곳이에요.</p>
              <BarList items={d.referrers} emptyText="다른 사이트에서 들어온 방문이 아직 없어요." />
            </section>
            <section css={s.card}>
              <h2 css={s.cardTitle}>처음 연 페이지</h2>
              <p css={s.cardDesc}>방문자가 처음 도착한 화면이에요.</p>
              <BarList items={d.landings} label={(n) => LANDING_LABEL[n] ?? n} />
            </section>
          </div>

          <div css={s.grid2}>
            <section css={s.card}>
              <h2 css={s.cardTitle}>가입 방식</h2>
              <BarList items={d.signupMethods} label={(n) => METHOD_LABEL[n] ?? n} emptyText="이 기간에 가입한 회원이 없어요." />
            </section>
            <section css={s.card}>
              <h2 css={s.cardTitle}>활동</h2>
              <dl css={s.activity}>
                <div>
                  <dt>예약 요청</dt>
                  <dd>{num(d.activity.reservationRequests)}</dd>
                </div>
                <div>
                  <dt>완료된 레슨</dt>
                  <dd>{num(d.activity.reservationsCompleted)}</dd>
                </div>
                <div>
                  <dt>취소된 예약</dt>
                  <dd>{num(d.activity.reservationsCanceled)}</dd>
                </div>
                <div>
                  <dt>채팅 메시지</dt>
                  <dd>{num(d.activity.chatMessages)}</dd>
                </div>
                <div>
                  <dt>문의</dt>
                  <dd>{num(d.activity.inquiries)}</dd>
                </div>
                <div>
                  <dt>리뷰</dt>
                  <dd>{num(d.activity.reviews)}</dd>
                </div>
                <div>
                  <dt>로그인 실패</dt>
                  <dd>{num(k.loginFailures)}</dd>
                </div>
              </dl>
            </section>
          </div>

          <p css={a.muted}>
            방문 기록은 IP·쿠키 없이 브라우저마다 임의 번호로 하루 한 번만 남겨요. 같은 사람이 다른 기기로 오면 따로 세어져요.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
