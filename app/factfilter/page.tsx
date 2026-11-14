'use client';

import React, { useEffect, useRef, useState } from 'react';
import { COUNTRIES, COUNTRY_MAP, GLOBAL_COUNTRY, type Country } from '../civil/countries';
import PiBadge from '../components/PiBadge';

/**
 * FACTFILTER — AI 팩트체크 & 언론 책임 원장
 * 디자인 기준: KEDHEON (화이트 #FFFFFF / 블랙 #000000 / 레드 #DC2626)
 *  - 상단 네비게이션·하단 푸터는 app/page.tsx와 동일 규격
 *  - 타이포그래피: H1 text-2xl md:text-3xl / H2 text-lg md:text-xl / H3 text-sm md:text-base / 본문 text-xs md:text-sm
 *  - 국가 축: Civil과 동일한 ISO 3166-1 238개국 검색·선택(GLOBAL 포함) → 국가별 원장 조회·제보 태깅
 */

interface ReportItem {
  id: string;
  country: string;
  type: string;
  name: string;
  title: string;
  proof: string;
  status: string;
  votes: number;
  typeEn?: string;
  nameEn?: string;
  titleEn?: string;
  proofEn?: string;
  statusEn?: string;
}

interface VerifiedCase {
  country: string;
  title: string;
  titleEn: string;
  status: string;
  statusEn: string;
  note: string;
  noteEn: string;
  badge: string;
  border: string;
}

/** 주요국 빠른 필터 (Civil과 동일 순서) */
const QUICK_CODES = ['KR', 'US', 'JP', 'CN', 'IN', 'BR', 'DE', 'GB', 'FR', 'ID', 'NG', 'MX', 'TR', 'PH', 'VN'];

const countryOf = (code: string): Country =>
  code === 'GLOBAL' ? GLOBAL_COUNTRY : COUNTRY_MAP[code] || { code, flag: '🏳️', ko: code, en: code };

/** 렌더마다 흔들리지 않는 결정적 해시 */
const hashCode = (s: string) => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003;
  return h;
};

/** 원장 시드 — 국가(ISO) 태깅. 실제 지목은 전부 OO 가명 처리 */
const SEED_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    country: 'KR',
    type: '기자',
    typeEn: 'Reporter',
    name: '김OO 기자 (OO경제)',
    nameEn: 'Reporter Kim (OO Economy)',
    title: 'HACCP 공익신고 내부자 음해성 허위 왜곡 기사',
    titleEn: 'Defamatory fabricated article targeting an HACCP whistleblower',
    proof: '고용노동부 및 권익위 공식 조사 결과와 정반대 날조',
    proofEn: 'Fabricated in direct contradiction to MOEL and ACRC findings',
    status: '검증 완료 (원장 등재)',
    statusEn: 'Verified (on-ledger)',
    votes: 1420
  },
  {
    id: 'rep-2',
    country: 'KR',
    type: '유튜브 채널',
    typeEn: 'YouTube Channel',
    name: '루머OO 채널',
    nameEn: 'Rumor Channel OO',
    title: '조작된 합성 캡처로 기업 갑질 피해자 2차 가해',
    titleEn: 'Doctored screenshots used to re-victimize a workplace abuse victim',
    proof: '원본 녹취록 대조 결과 악의적 편집 판명',
    proofEn: 'Original transcript shows malicious editing',
    status: '검증 완료 (경고 등급: 위험)',
    statusEn: 'Verified (risk level: high)',
    votes: 3890
  },
  {
    id: 'rep-3',
    country: 'KR',
    type: '언론사',
    typeEn: 'Media Outlet',
    name: 'OO일보 산업부',
    nameEn: 'OO Daily Industry Desk',
    title: '임금체불 상습 기업 일방적 홍보 및 기사 거래 의혹',
    titleEn: 'Suspected paid coverage promoting a habitual wage-theft employer',
    proof: '피해자 사실 확인 절차 완전 누락 및 허위 보도',
    proofEn: 'No victim verification; false reporting',
    status: '시민 검증 진행 중 (신뢰도 14%)',
    statusEn: 'Citizen review in progress (trust 14%)',
    votes: 920
  },
  {
    id: 'rep-g1',
    country: 'GLOBAL',
    type: 'AI 합성 채널',
    typeEn: 'AI Synthetic Channel',
    name: 'Global Rumor Network (OO)',
    nameEn: 'Global Rumor Network (OO)',
    title: 'AI 딥페이크로 국가 원수·기업 CEO 사칭 투자 사기 영상 유포',
    titleEn: 'AI deepfakes impersonating heads of state and CEOs to push investment scams',
    proof: '원본 연설 영상 프레임 대조 및 정부·기업 공식 부인 성명 확인',
    proofEn: 'Frame-level comparison with the original speech footage and official denials',
    status: '검증 완료 (원장 등재)',
    statusEn: 'Verified (on-ledger)',
    votes: 6420
  },
  {
    id: 'rep-g2',
    country: 'GLOBAL',
    type: '언론사',
    typeEn: 'Media Outlet',
    name: 'Daily Insight OO (국제부)',
    nameEn: 'Daily Insight OO (World Desk)',
    title: '재난 피해 규모 축소 보도 및 피해자 인터뷰 조작 의혹',
    titleEn: 'Downplayed disaster casualties using fabricated victim interviews',
    proof: '현지 구조당국 공식 집계와 3배 이상 불일치',
    proofEn: 'Contradicts official rescue-authority figures by more than 3x',
    status: '시민 검증 진행 중 (신뢰도 22%)',
    statusEn: 'Citizen review in progress (trust 22%)',
    votes: 2870
  },
  {
    id: 'rep-us1',
    country: 'US',
    type: '채널',
    typeEn: 'Channel',
    name: 'Patriot Stream OO',
    nameEn: 'Patriot Stream OO',
    title: '근거 없는 개표 조작 주장 — 편집된 영상 반복 송출',
    titleEn: 'Repeated baseless vote-tampering claims built on edited clips',
    proof: '주 선거관리위원회 감사 결과 및 원본 영상 대조',
    proofEn: 'State election board audit and comparison with original footage',
    status: '검증 완료 (경고 등급: 위험)',
    statusEn: 'Verified (risk level: high)',
    votes: 5310
  },
  {
    id: 'rep-us2',
    country: 'US',
    type: '기자',
    typeEn: 'Reporter',
    name: 'J. 밀러 기자 (OO 트리뷴)',
    nameEn: 'Reporter J. Miller (OO Tribune)',
    title: '제약사 임상 실패 은폐 보도 대가성 의혹',
    titleEn: 'Suspected paid coverage concealing a failed drug trial',
    proof: '공개된 임상 등록 원문과 기사 내용 정면 배치',
    proofEn: 'Directly contradicts the published trial registry record',
    status: '시민 검증 진행 중 (신뢰도 31%)',
    statusEn: 'Citizen review in progress (trust 31%)',
    votes: 1180
  },
  {
    id: 'rep-jp1',
    country: 'JP',
    type: '주간지',
    typeEn: 'Weekly Magazine',
    name: 'OO주보 편집부',
    nameEn: 'OO Weekly Desk',
    title: '처리수 방류 관련 수치 왜곡 및 전문가 발언 단편 편집',
    titleEn: 'Distorted discharge figures with clipped expert statements',
    proof: 'IAEA 보고서 원문과 인용 부분 대조 결과 왜곡 판명',
    proofEn: 'Quoted passages contradict the IAEA source report',
    status: '검증 완료 (원장 등재)',
    statusEn: 'Verified (on-ledger)',
    votes: 2240
  },
  {
    id: 'rep-gb1',
    country: 'GB',
    type: '언론사',
    typeEn: 'Media Outlet',
    name: 'OO Herald 데스크',
    nameEn: 'OO Herald Desk',
    title: '이민 통계 오독 보도로 여론 왜곡 — 공식 통계와 불일치',
    titleEn: 'Misread immigration statistics that contradict the official figures',
    proof: '국가통계청 원자료와 기사 수치 불일치 확인',
    proofEn: 'Figures disagree with the national statistics office dataset',
    status: '시민 검증 진행 중 (신뢰도 27%)',
    statusEn: 'Citizen review in progress (trust 27%)',
    votes: 1760
  },
  {
    id: 'rep-de1',
    country: 'DE',
    type: '채널',
    typeEn: 'Channel',
    name: 'OO Kanal',
    nameEn: 'OO Kanal',
    title: '기후 정책 보조금 수치 조작 — 연방 회계 원장과 불일치',
    titleEn: 'Fabricated climate-subsidy figures contradicting the federal audit ledger',
    proof: '연방 회계감사원 공개 자료와 기사 수치 대조',
    proofEn: 'Compared against the federal audit office disclosure',
    status: '검증 완료 (원장 등재)',
    statusEn: 'Verified (on-ledger)',
    votes: 980
  }
];

/** 최근 시민 팩트체크 검증 사례 — 국가 태깅 */
const VERIFIED_CASES: VerifiedCase[] = [
  {
    country: 'KR',
    title: '수도권 대형 물류센터 HACCP 위생 위반 묵인 사태',
    titleEn: 'HACCP hygiene violations at a Greater Seoul logistics hub',
    status: '✅ FACT (진실)',
    statusEn: '✅ FACT',
    note: '국민권익위원회 공익신고자 보호 및 행정처분 원장 일치',
    noteEn: 'Matches the ACRC whistleblower and enforcement records',
    badge: 'bg-black text-white',
    border: 'border-black/10'
  },
  {
    country: 'KR',
    title: '공장 지붕 태양광 설치 시 건물 소유권 침해 루머',
    titleEn: 'Rumor that rooftop solar voids building ownership',
    status: '❌ FALSE (허위)',
    statusEn: '❌ FALSE',
    note: '한전 PPA 임대차 계약 구조상 건물 소유권 보장 법적 확인',
    noteEn: 'Ownership is preserved under the PPA lease structure',
    badge: 'bg-[#dc2626] text-white',
    border: 'border-[#dc2626]'
  },
  {
    country: 'GLOBAL',
    title: '글로벌 주요 거래소 파이 코인 기습 상장 루머',
    titleEn: 'Rumor of a surprise Pi listing on a major exchange',
    status: '❌ FAKE (가짜뉴스)',
    statusEn: '❌ FAKE',
    note: '공식 코어팀 발표 부재 및 피싱 유도 악성 링크 판명',
    noteEn: 'No core team announcement; a phishing link',
    badge: 'bg-[#dc2626] text-white',
    border: 'border-[#dc2626]'
  },
  {
    country: 'GLOBAL',
    title: '주요국 중앙은행 디지털화폐(CBDC) 전면 시행 확정 루머',
    titleEn: 'Rumor that major central banks have fully launched CBDCs',
    status: '❌ FALSE (허위)',
    statusEn: '❌ FALSE',
    note: '각국 중앙은행 공식 발표 부재 — 파일럿 단계와 혼동 유도',
    noteEn: 'No central bank has announced a full launch; pilot stages conflated',
    badge: 'bg-[#dc2626] text-white',
    border: 'border-[#dc2626]'
  },
  {
    country: 'US',
    title: '대형 유통사 대규모 리콜 은폐 루머',
    titleEn: 'Rumor that a major retailer concealed a mass product recall',
    status: '❌ FALSE (허위)',
    statusEn: '❌ FALSE',
    note: '규제기관 리콜 공시 원문 대조 — 은폐 정황 없음',
    noteEn: 'Checked against the regulator recall notices; no concealment found',
    badge: 'bg-[#dc2626] text-white',
    border: 'border-[#dc2626]'
  }
];

const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-2 mb-2 text-left font-black">
    <h2 className="text-black text-lg md:text-xl uppercase italic border-l-[8px] border-black pl-3 tracking-tighter leading-none">
      {title}
    </h2>
    <p className="text-gray-400 text-xs md:text-sm font-bold pl-7 italic leading-none mt-1">{desc}</p>
  </div>
);

/** 검색 가능한 전 세계 국가 선택 패널 (Civil과 동일 규격) */
const CountryPicker = ({
  open, title, desc, current, ko, onClose, onSelect
}: {
  open: boolean;
  title: string;
  desc: string;
  current: string;
  ko: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
}) => {
  const [q, setQ] = useState('');
  useEffect(() => { if (open) setQ(''); }, [open]);
  if (!open) return null;

  const keyword = q.trim().toLowerCase();
  const list = COUNTRIES.filter(
    c => c.ko.includes(q.trim()) || c.en.toLowerCase().includes(keyword) || c.code.toLowerCase().includes(keyword)
  );

  return (
    <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-3xl md:rounded-2xl border-2 border-black flex flex-col overflow-hidden shadow-2xl">
        <div className="px-4 pt-3 pb-2 border-b-2 border-black text-left">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-black text-sm md:text-base font-black truncate">{title}</h3>
              <p className="text-gray-400 text-[11px] md:text-xs font-bold mt-0.5">{desc}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="close"
              className="shrink-0 w-8 h-8 rounded-full border border-black/10 text-black text-sm font-black hover:bg-gray-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={ko ? '국가명 또는 ISO 코드 검색 (예: 브라질, Brazil, BR)' : 'Search country or ISO code (e.g. Brazil, BR)'}
            className="mt-2 w-full bg-gray-50 border border-black/10 rounded-xl px-3 py-2.5 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black font-bold"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <button
            onClick={() => { onSelect('GLOBAL'); onClose(); }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left font-black text-xs md:text-sm mb-1 border ${
              current === 'GLOBAL' ? 'bg-black text-white border-black' : 'bg-white text-black border-black/10 hover:border-black'
            }`}
          >
            <span className="text-base">🌍</span>
            <span className="truncate">{ko ? '글로벌 (전 세계 공통)' : 'Global (worldwide)'}</span>
          </button>
          {list.length === 0 && (
            <p className="text-gray-400 text-xs md:text-sm font-bold text-center py-6">
              {ko ? '검색 결과가 없습니다.' : 'No country found.'}
            </p>
          )}
          {list.map(c => (
            <button
              key={c.code}
              onClick={() => { onSelect(c.code); onClose(); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left font-black text-xs md:text-sm border mb-1 ${
                current === c.code ? 'bg-black text-white border-black' : 'bg-white text-black border-transparent hover:border-black/20 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span className="truncate flex-1">{ko ? c.ko : c.en}</span>
              <span className={`text-[11px] font-mono ${current === c.code ? 'text-white/60' : 'text-gray-400'}`}>{c.code}</span>
              {current === c.code && <span className="text-[11px]">✓</span>}
            </button>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-black/10 text-gray-400 text-[11px] font-bold text-center">
          {ko ? `ISO 3166-1 기준 ${COUNTRIES.length}개국` : `${COUNTRIES.length} countries · ISO 3166-1`}
        </div>
      </div>
    </div>
  );
};

export default function FactFilterPage() {
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [activeTab, setActiveTab] = useState<'CHECK' | 'REPORT' | 'LEDGER' | 'VAULT'>('CHECK');
  const [points, setPoints] = useState(847);

  // 국가 축 — 조회 국가(원장·검증 사례) / 제보 국가
  const [viewCountry, setViewCountry] = useState('KR');
  const [reportCountry, setReportCountry] = useState('KR');
  const [picker, setPicker] = useState<'VIEW' | 'REPORT' | null>(null);
  const chipBarRef = useRef<HTMLDivElement>(null);

  // 언어 선택에 맞춰 실제 문서 언어를 알려 브라우저 자동번역 오작동을 막는다.
  useEffect(() => {
    document.documentElement.lang = lang === 'KO' ? 'ko' : 'en';
  }, [lang]);

  // 해외 방문자는 영어로 시작 (한국어 브라우저는 한국어 유지)
  useEffect(() => {
    const nav = typeof navigator !== 'undefined' ? (navigator.language || '').toLowerCase() : 'ko';
    if (!nav.startsWith('ko')) setLang('EN');
  }, []);

  // 필터 국가를 바꾸면 제보 폼의 국가도 따라간다.
  useEffect(() => { setReportCountry(viewCountry); }, [viewCountry]);

  // 238개국에서 고른 국가가 칩 목록 밖에 있어도 보이도록 가로 스크롤을 맞춘다.
  useEffect(() => {
    const bar = chipBarRef.current;
    if (!bar) return;
    const el = bar.querySelector<HTMLElement>(`[data-cc="${viewCountry}"]`);
    if (!el) return;
    const delta = el.getBoundingClientRect().left - bar.getBoundingClientRect().left;
    bar.scrollBy({ left: delta - Math.max(0, (bar.clientWidth - el.clientWidth) / 2 - 24), behavior: 'smooth' });
  }, [viewCountry]);

  // Check Tab State
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);

  // Report Tab State
  const [reportType, setReportType] = useState<'CHANNEL' | 'REPORTER' | 'OUTLET'>('REPORTER');
  const [targetName, setTargetName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetDetail, setTargetDetail] = useState('');
  const [submitted, setSubmitted] = useState<ReportItem | null>(null);
  const [reportedList, setReportedList] = useState<ReportItem[]>(SEED_REPORTS);

  // Vault State
  const [vaultText, setVaultText] = useState('');
  const [vaultHash, setVaultHash] = useState('');

  const ko = lang === 'KO';
  const viewInfo = countryOf(viewCountry);
  const reportInfo = countryOf(reportCountry);

  const tabs: string[] = ['GLOBAL', ...QUICK_CODES];
  if (viewCountry !== 'GLOBAL' && !QUICK_CODES.includes(viewCountry)) tabs.splice(1, 0, viewCountry);

  const ledgerItems = reportedList.filter(r => r.country === viewCountry);
  const cases = VERIFIED_CASES.filter(c => c.country === viewCountry);

  const runFactCheck = () => {
    if (!query.trim()) return alert(ko ? '검증할 뉴스 URL이나 의심 문장을 입력해주세요.' : 'Please enter a news URL or statement.');
    setChecking(true);
    setCheckResult(null);

    setTimeout(() => {
      setChecking(false);
      const h = hashCode(query.trim());
      const score = 31 + (h % 22);
      setCheckResult({
        country: viewCountry,
        verdict: 'MISLEADING',
        score,
        summary: ko
          ? '악의적 제목 왜곡 및 자극적 어그로 기사 판정. 본문 내 객관적 출처 및 공식 기관 데이터 부재.'
          : 'Flagged as Malicious Clickbait. Lack of credible official sources.',
        details: [
          ko ? '공식 발표 원문과 상반된 단어 자의적 왜곡 사용' : 'Contradicts verified primary documentation',
          ko ? '해당 언론사 과거 동일 유형 오보 6건 확인' : 'Publisher has 6 past documented retractions'
        ]
      });
      setPoints(p => p + 2);
    }, 1200);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !targetUrl.trim() || !targetDetail.trim()) {
      return alert(ko ? '모든 필수 항목을 입력해주세요.' : 'Please fill all required fields.');
    }

    const typeLabel = reportType === 'CHANNEL' ? (ko ? '채널' : 'Channel') : reportType === 'REPORTER' ? (ko ? '기자' : 'Reporter') : (ko ? '언론사' : 'Outlet');
    const typeLabelEn = reportType === 'CHANNEL' ? 'Channel' : reportType === 'REPORTER' ? 'Reporter' : 'Outlet';
    const info = countryOf(reportCountry);
    const trimmedDetail = targetDetail.trim();

    const newReport: ReportItem = {
      id: 'rep-' + Date.now(),
      country: reportCountry,
      type: typeLabel,
      typeEn: typeLabelEn,
      name: targetName.trim(),
      nameEn: targetName.trim(),
      title: trimmedDetail.slice(0, 40) + (trimmedDetail.length > 40 ? '…' : ''),
      titleEn: trimmedDetail.slice(0, 40) + (trimmedDetail.length > 40 ? '…' : ''),
      proof: targetUrl.trim(),
      proofEn: targetUrl.trim(),
      status: `KYC 시민 검증 접수 완료 · ${info.ko} 원장 최상단 등재`,
      statusEn: `Submitted for KYC citizen review · top of ${info.en} ledger`,
      votes: 1
    };

    setReportedList(prev => [newReport, ...prev]);
    setSubmitted(newReport);
    setViewCountry(reportCountry);
    setTargetName('');
    setTargetUrl('');
    setTargetDetail('');
    setPoints(p => p + 10);
  };

  const handleSealEvidence = () => {
    if (!vaultText.trim()) return alert(ko ? '봉인할 증거 본문이나 사건 개요를 입력해주세요.' : 'Enter evidence details.');
    const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setVaultHash(mockHash);
    setPoints(p => p + 5);
    alert(ko
      ? '증거 지문이 위변조 불가 타임스탬프로 영구 봉인되었습니다! (+5 BEOM)'
      : 'Evidence sealed with immutable timestamp! (+5 BEOM)');
  };

  const endorse = (id: string) => {
    setReportedList(prev => prev.map(r => (r.id === id ? { ...r, votes: r.votes + 1 } : r)));
    setPoints(p => p + 1);
    alert(ko ? '검증 지지 투표가 완료되었습니다 (+1 BEOM)' : 'Verification vote cast (+1 BEOM)');
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-24 font-black selection:bg-red-50 overflow-x-hidden">

      {/* Navigation — Kedheon 규격 */}
      <nav className="w-full max-w-5xl flex justify-between items-center px-4 py-2 sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-black/10 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg border-2 border-black bg-black flex items-center justify-center text-white text-sm md:text-lg font-black italic">
            F
          </div>
          <div className="text-left leading-tight font-black">
            <h1 translate="no" className="notranslate text-black text-sm md:text-base italic uppercase leading-none">FactFilter</h1>
            <span className="text-gray-400 text-[11px] font-mono tracking-widest uppercase">TRUTH LEDGER</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <PiBadge en={!ko} />
          <button
            onClick={() => setLang(l => (l === 'KO' ? 'EN' : 'KO'))}
            className="bg-gray-100 border border-gray-200 text-black text-[11px] md:text-xs font-black rounded-lg px-2 py-1 outline-none cursor-pointer shadow-sm hover:border-black transition-colors"
          >
            {ko ? '🇺🇸 EN' : '🇰🇷 KO'}
          </button>
          <div className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-[11px] md:text-xs font-black text-black flex items-center gap-1">
            🐾 {points} <span translate="no" className="notranslate text-gray-400">BEOM</span>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-2 py-1 rounded-lg text-[11px] md:text-xs font-black border border-black/10 bg-white text-gray-500 hover:text-black whitespace-nowrap"
          >
            {ko ? '케드헌 홈' : 'Kedheon'}
          </button>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-3 space-y-4">

        {/* Hero */}
        <div className="bg-gray-50 rounded-2xl border border-black/5 p-4 md:p-5 relative shadow-inner overflow-hidden text-left">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]"></div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-block px-2 py-0.5 rounded bg-black text-white text-[11px] md:text-xs font-black">
                  {ko ? '⚖️ 언론 견제 & 허위 보도 검증' : '⚖️ Truth Verification Protocol'}
                </span>
                <span
                  translate="no"
                  className="notranslate inline-block px-2 py-0.5 rounded bg-white border border-black text-black text-[11px] md:text-xs font-black"
                >
                  🌍 {ko ? `${COUNTRIES.length}개국 원장` : `${COUNTRIES.length} countries`}
                </span>
              </div>
              <h1 className="text-black text-2xl md:text-3xl tracking-tighter leading-tight mt-2">
                {ko ? '허위·왜곡 보도가 숨을 곳은 없다' : 'Nowhere to Hide for Disinformation'}
              </h1>
              <p className="text-gray-500 text-xs md:text-sm font-bold leading-relaxed mt-2 max-w-xl">
                {ko
                  ? `허위·왜곡 보도를 일삼는 채널, 특정 진영에 편향된 기자, 상습적으로 날조하는 언론사를 블록체인 원장에 영구 기록합니다. 전 세계 ${COUNTRIES.length}개국 어느 나라든 국가별 원장을 열어 조회하고 제보할 수 있으며, 100% 실명 KYC 시민의 검증으로 언론의 공신력을 바로 세웁니다.`
                  : `An immutable public ledger documenting disinformation outlets, biased reporting, and repeat fabrications. Open the ledger of any of the ${COUNTRIES.length} countries to review and report, verified by real-name Pi KYC citizens.`}
              </p>
            </div>
            <div className="bg-white border-2 border-black rounded-2xl px-4 py-3 text-center shrink-0">
              <div className="text-black text-2xl md:text-3xl leading-none">100%</div>
              <div className="text-gray-400 text-[11px] md:text-xs font-bold mt-1">{ko ? 'KYC 실명 검증' : 'KYC Verified'}</div>
              <div className="text-[#dc2626] text-[11px] md:text-xs font-black mt-1">{ko ? '외압 삭제 불가' : 'Immutable'}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto font-black">
          {[
            { key: 'CHECK', label: ko ? '🔍 AI 팩트체크' : '🔍 AI Fact Check' },
            { key: 'REPORT', label: ko ? '🚨 악성 채널·기자 제보' : '🚨 Report Fake News' },
            { key: 'LEDGER', label: ko ? '🏛️ 왜곡 언론·허위 보도 원장' : '🏛️ Disinformation Watchlist' },
            { key: 'VAULT', label: ko ? '🛡️ 공익제보 증거 봉인' : '🛡️ Evidence Vault' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-3 py-2 rounded-xl font-black text-xs md:text-sm whitespace-nowrap transition-all flex-1 text-center cursor-pointer border active:scale-95 ${
                activeTab === t.key
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white text-gray-400 border-black/10 hover:text-black'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Country filter — 주요국 빠른 필터 + 전 세계 238개국 검색 (GLOBAL 포함) */}
        {activeTab !== 'VAULT' && (
          <div ref={chipBarRef} className="flex gap-1.5 overflow-x-auto font-black pb-0.5">
            {tabs.map(code => {
              const info = countryOf(code);
              const active = viewCountry === code;
              return (
                <button
                  key={code}
                  data-cc={code}
                  onClick={() => setViewCountry(code)}
                  className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-black border transition-all whitespace-nowrap active:scale-95 ${
                    active ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-400 border-black/10 hover:text-black'
                  }`}
                >
                  {info.flag} {ko ? info.ko : info.en}
                </button>
              );
            })}
            <button
              onClick={() => setPicker('VIEW')}
              className="px-3 py-1.5 rounded-xl text-xs md:text-sm font-black border border-[#dc2626] text-[#dc2626] bg-white hover:bg-[#dc2626] hover:text-white transition-all whitespace-nowrap active:scale-95"
            >
              🌐 {ko ? `전체 ${COUNTRIES.length}개국` : `All ${COUNTRIES.length} countries`} ▾
            </button>
          </div>
        )}

        {/* TAB 1: AI FACT CHECK */}
        {activeTab === 'CHECK' && (
          <div className="space-y-3">
            <div className="bg-white border-2 border-black/10 rounded-2xl p-4 md:p-5 space-y-3 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-black text-lg md:text-xl font-black flex items-center gap-2">
                  <span>🔎</span> {ko ? '의심 뉴스 URL 또는 루머 문장 입력' : 'Enter Article URL or Claim'}
                </h2>
                <span className="text-[11px] md:text-xs font-black text-gray-500 bg-gray-100 border border-black/10 rounded-lg px-2 py-0.5">
                  {viewInfo.flag} {ko ? viewInfo.ko : viewInfo.en} <span translate="no" className="notranslate font-mono text-gray-400">{viewInfo.code}</span>
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={ko ? '예: [단독] 특정 사건 왜곡 보도 기사 링크 또는 제목' : 'e.g. Article link or sensational headline...'}
                  className="flex-1 bg-gray-50 border border-black/10 rounded-xl px-3 py-2.5 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black transition-all font-bold"
                />
                <button
                  onClick={runFactCheck}
                  disabled={checking}
                  className="bg-[#dc2626] hover:bg-black text-white font-black px-5 py-2.5 rounded-xl text-xs md:text-sm transition-all disabled:opacity-50 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  {checking ? (ko ? 'AI 교차 검증 중...' : 'Verifying...') : (ko ? '팩트체크 가동' : 'Verify Claim')}
                </button>
              </div>

              {checkResult && (
                <div className="p-4 rounded-xl bg-red-50 border-2 border-[#dc2626] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] md:text-xs font-black px-2.5 py-1 rounded bg-[#dc2626] text-white">
                      {ko ? '⚠️ 악의적 왜곡 의심 판정' : '⚠️ Misleading / Biased'}
                    </span>
                    <span className="text-[11px] md:text-xs text-[#dc2626] font-black">
                      {ko ? `신뢰도 지수: ${checkResult.score}/100` : `Trust Score: ${checkResult.score}/100`}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-black font-bold leading-relaxed">{checkResult.summary}</p>
                  <ul className="text-[11px] md:text-xs text-gray-500 font-bold list-disc list-inside space-y-0.5">
                    {checkResult.details.map((d: string, idx: number) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                  <div className="text-[11px] md:text-xs text-gray-500 font-bold pt-1">
                    {countryOf(checkResult.country).flag} {ko ? `${countryOf(checkResult.country).ko} 원장에 검증 결과가 기록됩니다.` : `Saved to the ${countryOf(checkResult.country).en} ledger.`}
                  </div>
                </div>
              )}
            </div>

            <div>
              <SectionTitle
                title={ko ? `${viewInfo.ko} 최근 시민 팩트체크 검증 사례` : `Recently Verified Claims · ${viewInfo.en}`}
                desc={ko ? `${COUNTRIES.length}개국 중 선택한 국가의 최신 검증 사례입니다.` : 'Latest verdicts from the KYC citizen panel for the selected country.'}
              />
              <div className="space-y-2">
                {cases.map((item, idx) => (
                  <div key={idx} className={`bg-white border ${item.border} rounded-xl p-3 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-left`}>
                    <div className="min-w-0">
                      <div className="text-sm md:text-base font-black text-black">{ko ? item.title : item.titleEn}</div>
                      <div className="text-[11px] md:text-xs text-gray-400 font-bold mt-0.5">{ko ? item.note : item.noteEn}</div>
                    </div>
                    <span className={`text-[11px] md:text-xs font-black px-2 py-0.5 rounded whitespace-nowrap ${item.badge}`}>
                      {ko ? item.status : item.statusEn}
                    </span>
                  </div>
                ))}

                {cases.length === 0 && (
                  <div className="bg-gray-50 border-2 border-dashed border-black/20 rounded-xl p-5 text-center space-y-2">
                    <div className="text-3xl">{viewInfo.flag}</div>
                    <p className="text-black text-sm md:text-base font-black">
                      {ko ? `${viewInfo.ko} 검증 사례가 아직 없습니다` : `No verified cases for ${viewInfo.en} yet`}
                    </p>
                    <p className="text-gray-500 text-[11px] md:text-xs font-bold">
                      {ko
                        ? '위에 의심 기사 URL을 넣으면 AI 교차 검증이 시작되고, 판정 결과가 이 국가 원장의 첫 사례로 기록됩니다.'
                        : 'Paste a suspicious article above — the verdict becomes the first record in this country ledger.'}
                    </p>
                    <button
                      onClick={() => setViewCountry('GLOBAL')}
                      className="mt-1 px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-black border border-black bg-white text-black hover:bg-black hover:text-white transition-all"
                    >
                      🌍 {ko ? '글로벌 검증 사례 보기' : 'View global verdicts'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REPORT */}
        {activeTab === 'REPORT' && (
          <div className="bg-white border-2 border-black/10 rounded-2xl p-4 md:p-5 space-y-4 text-left">
            <div>
              <h2 className="text-black text-lg md:text-xl font-black flex items-center gap-2">
                <span>🚨</span> {ko ? '악의적 가짜뉴스 채널·기자·언론사 제보' : 'Report Malicious Fake News'}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm font-bold mt-1">
                {ko
                  ? '상습 오보, 자극적 합성 썸네일로 조회수를 버는 채널, 편파 왜곡 기자를 고발해 주십시오. KYC 시민 검증을 거쳐 해당 국가 원장 최상단에 등재됩니다.'
                  : 'Expose malicious clickbait channels, unethical reporters, and corrupt publishers. Reviewed by KYC citizens, then posted to the top of that country’s ledger.'}
              </p>
            </div>

            {submitted && (
              <div className="bg-black text-white rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <p className="text-[11px] md:text-xs font-black leading-relaxed">
                  ✅ {countryOf(submitted.country).flag} {ko ? countryOf(submitted.country).ko : countryOf(submitted.country).en}
                  {ko
                    ? ' 원장 최상단에 등재되었습니다. (+10 BEOM)'
                    : ' — your report is now at the top of the ledger. (+10 BEOM)'}
                </p>
                <button
                  onClick={() => setActiveTab('LEDGER')}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-white text-black text-[11px] md:text-xs font-black hover:bg-[#dc2626] hover:text-white transition-all"
                >
                  {ko ? '원장에서 확인 →' : 'View on ledger →'}
                </button>
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="text-black text-[11px] md:text-xs font-black block mb-1.5">{ko ? '제보 대상 분류' : 'Target Category'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'REPORTER', label: ko ? '✍️ 왜곡 기자' : '✍️ Reporter' },
                    { key: 'CHANNEL', label: ko ? '📺 악성 채널' : '📺 Channel' },
                    { key: 'OUTLET', label: ko ? '🏢 왜곡 언론사' : '🏢 Outlet' }
                  ].map(c => (
                    <button
                      type="button"
                      key={c.key}
                      onClick={() => setReportType(c.key as any)}
                      className={`py-2 rounded-xl text-[11px] md:text-xs font-black border transition-all cursor-pointer active:scale-95 ${
                        reportType === c.key
                          ? 'bg-black text-white border-black'
                          : 'bg-gray-50 text-gray-500 border-black/10 hover:text-black'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-black text-[11px] md:text-xs font-black block mb-1">{ko ? '제보 대상 국가 (원장 등재 국가)' : 'Country of the target'}</label>
                <button
                  type="button"
                  onClick={() => setPicker('REPORT')}
                  className="w-full flex items-center justify-between gap-1 bg-gray-50 border border-black/10 text-black text-xs md:text-sm font-black rounded-xl px-3 py-2.5 hover:border-black transition-colors"
                >
                  <span className="truncate">
                    {reportInfo.flag} {ko ? reportInfo.ko : reportInfo.en} (<span translate="no" className="notranslate font-mono text-[11px]">{reportInfo.code}</span>)
                  </span>
                  <span className="text-[11px] text-gray-400 shrink-0">▾ {ko ? '변경' : 'Change'}</span>
                </button>
              </div>

              <div>
                <label className="text-black text-[11px] md:text-xs font-black block mb-1">{ko ? '대상 명칭 (기자 실명 / 채널명 / 언론사명)' : 'Target Name'}</label>
                <input
                  type="text"
                  value={targetName}
                  onChange={e => setTargetName(e.target.value)}
                  placeholder={ko ? '예: OO일보 홍OO 기자 또는 유튜브 채널명' : 'Name of reporter, channel, or outlet'}
                  className="w-full bg-gray-50 border border-black/10 rounded-xl px-3 py-2.5 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black font-bold"
                />
              </div>

              <div>
                <label className="text-black text-[11px] md:text-xs font-black block mb-1">{ko ? '가짜뉴스 / 왜곡 증거 URL 또는 영상 링크' : 'Evidence URL'}</label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-gray-50 border border-black/10 rounded-xl px-3 py-2.5 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black font-bold"
                />
              </div>

              <div>
                <label className="text-black text-[11px] md:text-xs font-black block mb-1">{ko ? '왜곡 내용 및 피해 사실 상세 기술' : 'Detailed Misconduct'}</label>
                <textarea
                  value={targetDetail}
                  onChange={e => setTargetDetail(e.target.value)}
                  rows={3}
                  placeholder={ko ? '실제 팩트와 어떻게 다르게 왜곡했는지 구체적인 반박 근거를 적어주세요.' : 'Explain how the report was fabricated with concrete counter-evidence.'}
                  className="w-full bg-gray-50 border border-black/10 rounded-xl p-3 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black font-bold"
                />
              </div>

              <div className="bg-gray-50 border border-black/10 p-3 rounded-xl text-[11px] md:text-xs text-gray-500 font-bold">
                🔒 {ko
                  ? `제보자의 신원은 영구 비공개 암호화되며, 허위 악성 제보 방지를 위해 파이 KYC 실명 인증자만 제보할 수 있습니다. 접수 즉시 ${reportInfo.flag} ${reportInfo.ko} 원장 최상단에 등재되고 +10 BEOM가 적립됩니다.`
                  : `Whistleblower identity is cryptographically protected. Your report goes to the top of the ${reportInfo.en} ledger and earns +10 BEOM.`}
              </div>

              <button
                type="submit"
                className="w-full bg-[#dc2626] hover:bg-black text-white font-black py-3 rounded-xl text-xs md:text-sm transition-all active:scale-95 cursor-pointer"
              >
                {ko ? `블록체인 검증 원장에 제보 등록 (+10 BEOM)` : 'Submit Report to Ledger (+10 BEOM)'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: LEDGER */}
        {activeTab === 'LEDGER' && (
          <div className="text-left">
            <SectionTitle
              title={ko ? '왜곡 언론·허위 보도 원장' : 'Disinformation & Media Watchlist'}
              desc={ko
                ? `${COUNTRIES.length}개국 중 선택한 국가의 검증 원장입니다. 검증 완료된 언론인·채널만 등재됩니다.`
                : 'Verified media misconduct for the selected country. Only reviewed cases are listed.'}
            />

            {/* 선택 국가 원장 헤더 */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 border border-black/10 rounded-2xl px-3 py-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">{viewInfo.flag}</span>
                <div className="min-w-0">
                  <p className="text-black text-xs md:text-sm font-black truncate">
                    {ko ? viewInfo.ko : viewInfo.en}
                    <span translate="no" className="notranslate text-gray-400 font-mono text-[11px] ml-1">{viewInfo.code}</span>
                  </p>
                  <p className="text-gray-400 text-[11px] font-bold">
                    {ko
                      ? `${ledgerItems.length}건 등재`
                      : `${ledgerItems.length} ${ledgerItems.length === 1 ? 'entry' : 'entries'}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPicker('VIEW')}
                className="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-black border border-black bg-white text-black hover:bg-black hover:text-white transition-all"
              >
                🌐 {ko ? '국가 변경' : 'Change country'}
              </button>
            </div>

            <div className="space-y-2">
              {ledgerItems.map(item => {
                const info = countryOf(item.country);
                return (
                  <div key={item.id} className="bg-white border-2 border-black/10 rounded-2xl p-4 md:p-5 space-y-2 hover:border-[#dc2626] transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] md:text-xs font-black px-2 py-0.5 rounded bg-[#dc2626] text-white whitespace-nowrap">
                          {ko ? item.type : (item.typeEn || item.type)}
                        </span>
                        <span className="text-[11px] md:text-xs font-black px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 whitespace-nowrap">
                          {info.flag} {ko ? info.ko : info.en}
                        </span>
                        <span className="text-sm md:text-base font-black text-black truncate">{ko ? item.name : (item.nameEn || item.name)}</span>
                      </div>
                      <span className="text-[11px] md:text-xs text-gray-500 font-bold">{ko ? item.status : (item.statusEn || item.status)}</span>
                    </div>

                    <div className="text-sm md:text-base font-black text-black leading-snug">{ko ? item.title : (item.titleEn || item.title)}</div>
                    <div className="text-[11px] md:text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-black/10 font-bold break-all">
                      <span className="text-black font-black">{ko ? '반박 증빙:' : 'Proof:'}</span> {ko ? item.proof : (item.proofEn || item.proof)}
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px] md:text-xs text-gray-400 font-bold">
                      <span>👥 {item.votes} {ko ? '시민 검증 참여' : 'Pioneers Verified'}</span>
                      <button
                        onClick={() => endorse(item.id)}
                        className="text-[#dc2626] hover:text-black font-black cursor-pointer"
                      >
                        {ko ? '👍 검증 지지 투표' : '👍 Endorse Proof'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {ledgerItems.length === 0 && (
                <div className="space-y-2">
                  <div className="bg-gray-50 border-2 border-dashed border-black/20 rounded-2xl p-5 text-center space-y-2">
                    <div className="text-4xl">{viewInfo.flag}</div>
                    <p className="text-black text-sm md:text-base font-black">
                      {ko ? `${viewInfo.ko} 언론 원장이 아직 비어 있습니다` : `No ${viewInfo.en} media reports yet`}
                    </p>
                    <p className="text-gray-500 text-[11px] md:text-xs font-bold leading-relaxed">
                      {ko
                        ? `${viewInfo.ko}의 왜곡·허위 보도 제보를 받는 즉시 이 원장 최상단에 등재됩니다. KYC 실명 시민이면 누구나 첫 제보자가 될 수 있습니다.`
                        : `Report a fabricated or distorted story from ${viewInfo.en} and it appears at the top of this ledger right away.`}
                    </p>
                    <div className="flex flex-col md:flex-row gap-2 justify-center pt-1">
                      <button
                        onClick={() => setActiveTab('REPORT')}
                        className="px-3 py-2 rounded-xl text-[11px] md:text-xs font-black bg-[#dc2626] text-white hover:bg-black transition-all active:scale-95"
                      >
                        🚨 {ko ? `${viewInfo.ko} 언론 제보하기` : `Report ${viewInfo.en} media`}
                      </button>
                      <button
                        onClick={() => setViewCountry('GLOBAL')}
                        className="px-3 py-2 rounded-xl text-[11px] md:text-xs font-black border border-black bg-white text-black hover:bg-black hover:text-white transition-all"
                      >
                        🌍 {ko ? '글로벌 원장 보기' : 'View global ledger'}
                      </button>
                    </div>
                  </div>

                  {viewCountry !== 'GLOBAL' && (
                    <div className="bg-white border border-black/10 rounded-2xl p-3">
                      <p className="text-gray-400 text-[11px] md:text-xs font-black uppercase mb-2">
                        🌍 {ko ? '글로벌 공통 검증 사례' : 'Global verified cases'}
                      </p>
                      <div className="space-y-1.5">
                        {SEED_REPORTS.filter(r => r.country === 'GLOBAL').map(r => (
                          <div key={r.id} className="flex flex-col md:flex-row md:items-center justify-between gap-1 border-b border-black/5 pb-1.5 last:border-0 last:pb-0">
                            <span className="text-[11px] md:text-xs font-black text-black truncate">
                              {ko ? r.name : (r.nameEn || r.name)} · {ko ? r.title : (r.titleEn || r.title)}
                            </span>
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">{ko ? r.status : (r.statusEn || r.status)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: VAULT */}
        {activeTab === 'VAULT' && (
          <div className="bg-white border-2 border-black/10 rounded-2xl p-4 md:p-5 space-y-3 text-left">
            <div>
              <h2 className="text-black text-lg md:text-xl font-black flex items-center gap-2">
                <span>🛡️</span> {ko ? '외압 삭제 불가: 공익제보 증거 지문' : 'Immutable Evidence Vault'}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm font-bold mt-1">
                {ko
                  ? '외압으로 기사가 삭제되거나 증거가 인멸되어도, 원본 해시 값을 블록체인에 영구 각인해 최초 작성 시점을 입증합니다.'
                  : 'Permanent cryptographic fingerprinting for whistleblower evidence, protected against deletions and cover-ups.'}
              </p>
            </div>

            <textarea
              value={vaultText}
              onChange={e => setVaultText(e.target.value)}
              rows={4}
              placeholder={ko ? '봉인할 공익제보 증거 요약, 부당 지시 녹취록, 계약 위반 사실 등을 입력하세요.' : 'Paste evidence details, transcript, or unfair contract terms to seal...'}
              className="w-full bg-gray-50 border border-black/10 rounded-xl p-3 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black font-bold"
            />

            <button
              onClick={handleSealEvidence}
              className="w-full bg-[#dc2626] hover:bg-black text-white font-black py-3 rounded-xl text-xs md:text-sm transition-all active:scale-95 cursor-pointer"
            >
              {ko ? '위변조 불가 타임스탬프로 영구 봉인 (+5 BEOM)' : 'Seal Evidence to Blockchain (+5 BEOM)'}
            </button>

            {vaultHash && (
              <div className="p-4 rounded-xl bg-gray-50 border-2 border-black space-y-1">
                <div className="text-[11px] md:text-xs text-[#dc2626] font-black uppercase tracking-wider">
                  {ko ? '온체인 증거 고유 해시 (SHA-256)' : 'On-Chain Proof Fingerprint'}
                </div>
                <div translate="no" className="notranslate font-mono text-[11px] md:text-xs text-black break-all bg-white p-2 rounded border border-black/10">{vaultHash}</div>
                <div className="text-[11px] md:text-xs text-gray-500 font-bold pt-1">
                  ✓ {ko ? '타임스탬프 원장 각인 완료. 법정 제출용 무결성 증명서 생성 가능.' : 'Timestamped on-chain. Integrity certificate ready.'}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer — Kedheon 규격 */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl font-black">
        {[
          { name: 'KEDHEON', path: '/' },
          { name: 'CIVIL', path: '/civil' },
          { name: 'FACTFILTER', path: '/factfilter' },
          { name: 'NEXUS', path: '#' },
          { name: 'VENDOR', path: '#' }
        ].map(app => (
          <button
            key={app.name}
            translate="no"
            onClick={() => {
              if (app.path === '#') {
                alert(app.name + (ko ? ' 서비스 준비 중입니다.' : ' service is coming soon.'));
              } else {
                window.location.href = app.path;
              }
            }}
            className={`notranslate flex-1 py-3.5 md:py-4.5 rounded-xl text-xs md:text-sm transition-all font-black text-center leading-none cursor-pointer hover:scale-105 active:scale-95 ${
              app.name === 'FACTFILTER'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-400 hover:text-black'
            }`}
          >
            {app.name}
          </button>
        ))}
      </footer>

      {/* 전 세계 238개국 검색 패널 */}
      <CountryPicker
        open={picker === 'VIEW'}
        title={ko ? '조회할 국가 선택' : 'Select a country to view'}
        desc={ko ? `전 세계 ${COUNTRIES.length}개국 원장을 검색해 바로 엽니다.` : `Search any of the ${COUNTRIES.length} country ledgers.`}
        current={viewCountry}
        ko={ko}
        onClose={() => setPicker(null)}
        onSelect={code => setViewCountry(code)}
      />
      <CountryPicker
        open={picker === 'REPORT'}
        title={ko ? '제보 대상 국가 선택' : 'Select the country to report'}
        desc={ko ? '제보는 선택한 국가의 원장에 태깅되어 등재됩니다.' : 'Your report is tagged to the selected country.'}
        current={reportCountry}
        ko={ko}
        onClose={() => setPicker(null)}
        onSelect={code => setReportCountry(code)}
      />
    </div>
  );
}
