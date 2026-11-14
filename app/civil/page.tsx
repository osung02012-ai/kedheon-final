'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { COUNTRIES, COUNTRY_MAP, GLOBAL_COUNTRY } from './countries';
import type { Country } from './countries';
import PiBadge from '../components/PiBadge';
import PiPayButton from '../components/PiPayButton';

/**
 * CIVIL — KYC 실명 1인 1표 거버넌스 DApp (전 세계 238개국 지원)
 * 디자인 기준: KEDHEON (화이트 #FFFFFF / 블랙 #000000 / 레드 #DC2626)
 *  - 상단 네비게이션·하단 푸터는 app/page.tsx와 동일 규격
 *  - 타이포그래피: H1 text-2xl md:text-3xl / H2 text-lg md:text-xl / H3 text-sm md:text-base / 본문 text-xs md:text-sm
 *  - 주권 투표 락: 내 KYC 국가 안건만 투표, 타국 안건은 참관(읽기) 전용
 *  - 238개국 어디를 골라도 기본 의제가 자동 생성되어 빈 화면이 없고, 시민이 직접 안건을 제안해 즉시 투표할 수 있다.
 */

interface Agenda {
  id: string;
  country: string; // 'GLOBAL' 또는 ISO 3166-1 alpha-2
  tag: string;
  tagEn: string;
  title: string;
  titleEn: string;
  yes: number;
  no: number;
  deadline: string;
  baseVoters?: number;
  proposed?: boolean;
}

interface Mall { name: string; nameEn: string; tag: string; tagEn: string; signers: number; }

/** 상단 빠른 필터에 노출할 주요국 (나머지 238개국은 전체 검색 드롭다운에서 선택) */
const QUICK_CODES = ['KR', 'US', 'JP', 'CN', 'IN', 'BR', 'DE', 'GB', 'FR', 'ID', 'NG', 'MX', 'TR', 'PH', 'VN'];

const AGENDAS: Agenda[] = [
  // ── 글로벌 ──
  {
    id: 'global-kyc-vote', country: 'GLOBAL', tag: '선거 공정성', tagEn: 'Election Integrity',
    title: '부정선거 및 개표 조작 방지를 위한 블록체인 실명 KYC 투표 의무화',
    titleEn: 'Mandatory on-chain KYC voting to prevent election fraud and vote-count manipulation',
    yes: 88, no: 12, deadline: 'D-4', baseVoters: 4200
  },
  {
    id: 'global-pi-fund', country: 'GLOBAL', tag: '생태계 기금', tagEn: 'Ecosystem Fund',
    title: '1조 파이(Pi) 생태계 기금 운용 — 1인 1표 온체인 감사',
    titleEn: '1T Pi ecosystem fund governance — one person, one vote on-chain audit',
    yes: 91, no: 9, deadline: 'D-9', baseVoters: 6120
  },
  {
    id: 'global-public-budget', country: 'GLOBAL', tag: '예산 투명성', tagEn: 'Budget Transparency',
    title: '모든 국가의 공공예산·조달 계약 실시간 온체인 공개 표준 제정',
    titleEn: 'Global standard for real-time on-chain disclosure of public budgets and procurement',
    yes: 84, no: 16, deadline: 'D-14', baseVoters: 5310
  },
  // ── 대한민국 ──
  {
    id: 'kr-tax-hunter', country: 'KR', tag: 'Tax Hunter', tagEn: 'Tax Hunter',
    title: '세금 낭비 감시: 지자체 불요불급 전시성 공공 예산 100% 삭감 청원',
    titleEn: 'Tax Hunter: petition to cut 100% of wasteful exhibition-style local government budgets',
    yes: 94, no: 6, deadline: 'D-12', baseVoters: 4200
  },
  {
    id: 'kr-solar-power', country: 'KR', tag: '소상공인·에너지', tagEn: 'SME & Energy',
    title: '소상공인 전기료 부담 경감 및 공장·창고 지붕 태양광 규제 완화',
    titleEn: 'Relief on SME electricity bills and deregulation of rooftop solar on factories and warehouses',
    yes: 89, no: 11, deadline: 'D-7', baseVoters: 3870
  },
  // ── 미국 ──
  {
    id: 'us-onchain-audit', country: 'US', tag: '선거 검증', tagEn: 'Election Audit',
    title: '연방 선거 전자투표 온체인 검증 의무화',
    titleEn: 'Mandatory on-chain verification of federal electronic ballots',
    yes: 76, no: 24, deadline: 'D-15', baseVoters: 5120
  },
  {
    id: 'us-budget-open', country: 'US', tag: '예산 투명성', tagEn: 'Budget Transparency',
    title: '연방 예산 집행 실시간 공개 및 시민 감사 의무화',
    titleEn: 'Real-time public disclosure of federal spending with citizen audit rights',
    yes: 81, no: 19, deadline: 'D-21', baseVoters: 4760
  },
  // ── 일본 ──
  {
    id: 'jp-web3-tax', country: 'JP', tag: 'Web3 세제', tagEn: 'Web3 Tax',
    title: 'Web3 자산 양도차익 과세 체계 개편 및 스테이블코인 실명 결제 허용',
    titleEn: 'Reform of Web3 capital gains taxation and real-name stablecoin payments',
    yes: 73, no: 27, deadline: 'D-18', baseVoters: 3980
  },
  {
    id: 'jp-subsidy-ledger', country: 'JP', tag: '보조금 감사', tagEn: 'Subsidy Audit',
    title: '지방자치단체 보조금 집행 내역 온체인 공개',
    titleEn: 'On-chain disclosure of municipal subsidy spending',
    yes: 85, no: 15, deadline: 'D-25', baseVoters: 3540
  },
  // ── 베트남 ──
  {
    id: 'vn-budget-audit', country: 'VN', tag: '지방예산', tagEn: 'Local Budget',
    title: '지방 공공예산 시민 실시간 감사 공개',
    titleEn: 'Real-time citizen audit of local public budgets',
    yes: 87, no: 13, deadline: 'D-11', baseVoters: 3140
  },
  {
    id: 'vn-pi-fee', country: 'VN', tag: '디지털 행정', tagEn: 'Digital Admin',
    title: '디지털 행정 수수료 파이(Pi) 결제 도입',
    titleEn: 'Adoption of Pi payments for digital government service fees',
    yes: 79, no: 21, deadline: 'D-20', baseVoters: 2890
  },
  // ── 중국 ──
  {
    id: 'cn-local-budget', country: 'CN', tag: '지방예산', tagEn: 'Local Budget',
    title: '지방 공공사업 예산 집행 내역 실시간 온체인 공개',
    titleEn: 'Real-time on-chain disclosure of local public works spending',
    yes: 82, no: 18, deadline: 'D-16', baseVoters: 5210
  },
  // ── 인도 ──
  {
    id: 'in-evm-hash', country: 'IN', tag: '선거 검증', tagEn: 'Election Audit',
    title: '전자투표기(EVM) 결과 해시 공개 및 개표 독립 검증 의무화',
    titleEn: 'Public hashing of EVM results with mandatory independent count verification',
    yes: 86, no: 14, deadline: 'D-10', baseVoters: 6640
  },
  // ── 브라질 ──
  {
    id: 'br-procurement', country: 'BR', tag: '공공조달', tagEn: 'Procurement',
    title: '연방 공공입찰 결과 온체인 공개 및 시민 감사권 도입',
    titleEn: 'On-chain disclosure of federal tender results with citizen audit rights',
    yes: 83, no: 17, deadline: 'D-13', baseVoters: 4820
  },
  // ── 독일 ──
  {
    id: 'de-budget-ledger', country: 'DE', tag: '예산 투명성', tagEn: 'Budget Transparency',
    title: '연방·주 정부 예산 집행 온체인 공개 및 시민 감사 의무화',
    titleEn: 'On-chain disclosure of federal and state budget spending with citizen audit',
    yes: 80, no: 20, deadline: 'D-19', baseVoters: 3610
  },
  // ── 영국 ──
  {
    id: 'gb-vote-record', country: 'GB', tag: '의회 투명성', tagEn: 'Parliamentary Record',
    title: '의회 표결 기록·선거 지출 실시간 온체인 공개',
    titleEn: 'Real-time on-chain publication of parliamentary votes and election spending',
    yes: 78, no: 22, deadline: 'D-22', baseVoters: 3020
  },
  // ── 프랑스 ──
  {
    id: 'fr-budget-audit', country: 'FR', tag: '예산 투명성', tagEn: 'Budget Transparency',
    title: '국가 예산 집행 온체인 공개 및 공공정책 시민 검증',
    titleEn: 'On-chain disclosure of state spending with citizen policy verification',
    yes: 77, no: 23, deadline: 'D-17', baseVoters: 2950
  },
  // ── 인도네시아 ──
  {
    id: 'id-infra-budget', country: 'ID', tag: '지방예산', tagEn: 'Local Budget',
    title: '지방 인프라 예산 집행 온체인 공개 및 시민 감사',
    titleEn: 'On-chain disclosure of local infrastructure budgets with citizen audit',
    yes: 88, no: 12, deadline: 'D-8', baseVoters: 4210
  },
  // ── 나이지리아 ──
  {
    id: 'ng-budget-open', country: 'NG', tag: '예산 투명성', tagEn: 'Budget Transparency',
    title: '연방·주 예산 집행 실시간 공개 및 유권자 검증',
    titleEn: 'Real-time disclosure of federal and state spending with voter verification',
    yes: 90, no: 10, deadline: 'D-6', baseVoters: 3980
  },
  // ── 멕시코 ──
  {
    id: 'mx-procurement', country: 'MX', tag: '공공조달', tagEn: 'Procurement',
    title: '연방 공공조달 계약 온체인 투명성 및 시민 감사',
    titleEn: 'On-chain transparency of federal procurement contracts with citizen audit',
    yes: 85, no: 15, deadline: 'D-23', baseVoters: 3120
  },
  // ── 튀르키예 ──
  {
    id: 'tr-count-verify', country: 'TR', tag: '선거 검증', tagEn: 'Election Audit',
    title: '지방선거 개표 결과 온체인 검증 도입',
    titleEn: 'On-chain verification of local election vote counts',
    yes: 81, no: 19, deadline: 'D-24', baseVoters: 2740
  },
  // ── 필리핀 ──
  {
    id: 'ph-budget-audit', country: 'PH', tag: '예산 투명성', tagEn: 'Budget Transparency',
    title: '국가 예산 온체인 공개 및 공공사업 시민 감사',
    titleEn: 'On-chain national budget disclosure with citizen project audit',
    yes: 89, no: 11, deadline: 'D-9', baseVoters: 3460
  }
];

const MALLS: Mall[] = [
  { name: '쿠팡', nameEn: 'Coupang', tag: '한국 1위', tagEn: 'Korea #1', signers: 14205 },
  { name: '아마존', nameEn: 'Amazon', tag: '글로벌 1위', tagEn: 'Global #1', signers: 38920 },
  { name: '알리익스프레스', nameEn: 'AliExpress', tag: '해외직구', tagEn: 'Cross-border', signers: 21450 },
  { name: '이베이', nameEn: 'eBay', tag: '글로벌 P2P', tagEn: 'Global P2P', signers: 9840 },
  { name: '월마트', nameEn: 'Walmart', tag: '미국 리테일', tagEn: 'US Retail', signers: 18750 },
  { name: '쇼피', nameEn: 'Shopee', tag: '동남아 1위', tagEn: 'SEA #1', signers: 12600 },
  { name: '테무', nameEn: 'Temu', tag: '글로벌 커머스', tagEn: 'Global Commerce', signers: 15300 },
  { name: '메르카도리브레', nameEn: 'MercadoLibre', tag: '남미 1위', tagEn: 'LATAM #1', signers: 11200 },
  { name: '라쿠텐', nameEn: 'Rakuten', tag: '일본 1위', tagEn: 'Japan #1', signers: 8900 },
  { name: '파이체인몰', nameEn: 'PiChainMall', tag: 'Web3 생태계', tagEn: 'Web3 Ecosystem', signers: 45200 }
];

/** 국가 코드(또는 GLOBAL)를 국가 정보로 변환 */
const countryOf = (code: string): Country =>
  code === 'GLOBAL' ? GLOBAL_COUNTRY : COUNTRY_MAP[code] || { code, flag: '🏳️', ko: code, en: code };

const nameOf = (code: string, ko: boolean) => {
  const c = countryOf(code);
  return ko ? c.ko : c.en;
};

/** 렌더마다 흔들리지 않는 결정적 해시 (기본 안건 더미 데이터용) */
const hashCode = (s: string) => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003;
  return h;
};

/** 특정 국가에 전용 안건이 없을 때 자동 생성되는 기본 의제 2건 (200여 개국 빈 화면 방지) */
const defaultAgendas = (cc: string): Agenda[] => {
  const c = countryOf(cc);
  const h = hashCode(cc);
  const mk = (i: number, tag: string, tagEn: string, title: string, titleEn: string): Agenda => {
    const hh = hashCode(cc + i);
    const yes = 56 + (hh % 36);
    return {
      id: `auto-${cc}-${i}`,
      country: cc,
      tag,
      tagEn,
      title,
      titleEn,
      yes,
      no: 100 - yes,
      deadline: `D-${6 + (hh % 20)}`,
      baseVoters: 240 + (hh % 3600)
    };
  };
  return [
    mk(1, '예산 투명성', 'Budget Transparency',
      `${c.ko} 공공예산·조달 실시간 온체인 공개 및 시민 감사권 도입`,
      `${c.en}: real-time on-chain disclosure of public budgets and procurement with citizen audit rights`),
    mk(2, '선거 검증', 'Election Integrity',
      `${c.ko} 전자투표 개표 결과 온체인 검증 의무화`,
      `${c.en}: mandatory on-chain verification of electronic vote counts`),
    mk(3, '디지털 행정', 'Digital Public Service',
      `${c.ko} 공공 행정 수수료의 디지털 자산 결제 도입`,
      `${c.en}: adopt digital-asset payments for public administration fees`)
  ].map(a => ({ ...a, baseVoters: a.baseVoters! + (h % 100) }));
};

const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-2 mb-2 text-left font-black">
    <h2 className="text-black text-lg md:text-xl uppercase italic border-l-[8px] border-black pl-3 tracking-tighter leading-none">
      {title}
    </h2>
    <p className="text-gray-400 text-xs md:text-sm font-bold pl-7 italic leading-none mt-1">{desc}</p>
  </div>
);

/** 검색 가능한 전 세계 국가 선택 패널 */
const CountryPicker = ({
  open, title, desc, current, ko, allowGlobal, onClose, onSelect
}: {
  open: boolean;
  title: string;
  desc: string;
  current: string;
  ko: boolean;
  allowGlobal?: boolean;
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
            placeholder={ko ? '국가명 또는 ISO 코드 검색 (예: 독일, Germany, DE)' : 'Search country or ISO code (e.g. Germany, DE)'}
            className="mt-2 w-full bg-gray-50 border border-black/10 rounded-xl px-3 py-2.5 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black font-bold"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {allowGlobal && (
            <button
              onClick={() => { onSelect('GLOBAL'); onClose(); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left font-black text-xs md:text-sm mb-1 border ${
                current === 'GLOBAL' ? 'bg-black text-white border-black' : 'bg-white text-black border-black/10 hover:border-black'
              }`}
            >
              <span className="text-base">🌍</span>
              <span className="truncate">{ko ? '글로벌 (전 세계 공통)' : 'Global (worldwide)'}</span>
            </button>
          )}
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

export default function CivilPage() {
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [checkedIn, setCheckedIn] = useState(false);
  const [points, setPoints] = useState(847);
  const [myCountry, setMyCountry] = useState('KR');
  const [viewCountry, setViewCountry] = useState('GLOBAL');
  const [voted, setVoted] = useState<Record<string, 'YES' | 'NO'>>({});
  const [demanded, setDemanded] = useState<Record<string, boolean>>({});
  const [linkAgenda, setLinkAgenda] = useState('global-kyc-vote');

  // 시민 제안 안건 (국가 코드별)
  const [proposals, setProposals] = useState<Record<string, Agenda[]>>({});
  const [showPropose, setShowPropose] = useState(false);
  const [propKo, setPropKo] = useState('');
  const [propEn, setPropEn] = useState('');

  // 국가 선택 패널
  const [picker, setPicker] = useState<'MY' | 'VIEW' | null>(null);

  // 언어 선택에 맞춰 실제 문서 언어를 알려 브라우저 자동번역 오작동을 막는다.
  useEffect(() => {
    document.documentElement.lang = lang === 'KO' ? 'ko' : 'en';
  }, [lang]);

  // 해외 방문자는 영어로 시작 (한국어 브라우저는 한국어 유지)
  useEffect(() => {
    const nav = typeof navigator !== 'undefined' ? (navigator.language || '').toLowerCase() : 'ko';
    if (!nav.startsWith('ko')) setLang('EN');
  }, []);

  const ko = lang === 'KO';
  const T = {
    subtitle: ko ? 'KYC 실명 1인 1표 거버넌스' : 'KYC One Person One Vote Governance',
    heroTitle: ko ? '1인 1표 직접민주주의' : 'One Person, One Vote',
    heroDesc: ko
      ? `파이 KYC 실명 인증을 통과한 시민만 1표를 행사합니다. 전 세계 ${COUNTRIES.length}개국 어디에서나 자기 나라 투표방을 열고 안건을 올릴 수 있습니다 — 봇·알바가 판치는 Web2 투표의 한계를 블록체인 원장으로 넘어섭니다.`
      : `Only Pi KYC-verified humans cast a vote. Citizens of all ${COUNTRIES.length} countries can open their own national room and raise agendas — an immutable ledger replaces the bot-ridden ballots of Web2.`,
    myCountry: ko ? '내 KYC 인증 국가' : 'My KYC Country',
    change: ko ? '변경' : 'Change',
    verified: ko ? 'KYC 인증 확인' : 'KYC Verified',
    globalCoverage: ko ? `${COUNTRIES.length}개국 지원` : `${COUNTRIES.length} countries`,
    pointLabel: ko ? '보유 BEOM 포인트' : 'BEOM Points',
    checkin: ko ? '⚡ 출석체크 (+5 BEOM)' : '⚡ Daily Check-in (+5 BEOM)',
    checkedIn: ko ? '출석 완료' : 'Checked in',
    agenda: ko ? '국가별 주권 투표 안건' : 'Sovereign Agendas by Country',
    agendaDesc: ko
      ? '내 KYC 국가와 글로벌 안건은 1표를 행사할 수 있고, 다른 나라 안건은 참관만 가능합니다.'
      : 'Vote on global and your own country agendas. Other countries are read-only.',
    allCountries: ko ? `전체 ${COUNTRIES.length}개국` : `All ${COUNTRIES.length} countries`,
    roomTitle: ko ? '투표방 (선택 국가)' : 'Voting Room',
    roomCount: ko ? '개 안건' : ' agendas',
    propose: ko ? '✍️ 안건 제안 (+10 BEOM)' : '✍️ Propose Agenda (+10 BEOM)',
    proposeDesc: ko
      ? '어느 나라든 그 나라 시민이 직접 안건을 올릴 수 있습니다. 제안 즉시 이 투표방 목록에 등록됩니다.'
      : 'Any citizen can file an agenda for their country. It appears in this room immediately.',
    propKoLabel: ko ? '안건 제목 (한국어)' : 'Agenda title (Korean, optional)',
    propEnLabel: ko ? 'Agenda title (English)' : 'Agenda title (English)',
    propSubmit: ko ? '안건 등록 (+10 BEOM)' : 'File Agenda (+10 BEOM)',
    propCancel: ko ? '취소' : 'Cancel',
    noAgenda: ko ? '아직 등록된 안건이 없습니다. 첫 안건을 제안해 보세요.' : 'No agenda yet. File the first one.',
    yes: ko ? '찬성' : 'YES',
    no: ko ? '반대' : 'NO',
    noVotesYet: ko ? '아직 투표가 없습니다 — 첫 1표를 남겨 주세요.' : 'No votes yet — cast the first vote.',
    voteYes: ko ? '👍 찬성 투표' : '👍 Vote YES',
    voteNo: ko ? '👎 반대 투표' : '👎 Vote NO',
    locked: ko ? '🔒 해당 국가 KYC 시민만 투표 가능 (참관 모드)' : '🔒 Only that country’s KYC citizens can vote (view only)',
    voters: ko ? '명 참여' : 'voters',
    ends: ko ? '마감' : 'Ends',
    onchain: ko ? '위변조 불가 온체인 각인' : 'Immutable on-chain record',
    malls: ko ? '글로벌 쇼핑몰 파이 결제 도입 청원' : 'Demand Pi Payment at Global Malls',
    mallsDesc: ko ? '10대 글로벌 쇼핑몰에 파이 결제 도입을 요구하는 시민 서명입니다.' : 'Citizen petition asking the top 10 global malls to accept Pi.',
    signers: ko ? '서명 참여' : 'Signatures',
    demand: '+1 Demand Pi',
    demanded: ko ? '서명완료 ✓' : 'Signed ✓',
    linkTitle: ko ? '공인 투표 링크 생성기' : 'Official Ballot Link Generator',
    linkDesc: ko
      ? '기업·코어팀·지자체가 공인 투표를 개설할 때 쓰는 링크입니다. 생성된 링크로 들어온 KYC 시민만 집계됩니다.'
      : 'For companies, the core team, and public bodies to open an official ballot. Only KYC citizens arriving through the link are counted.',
    generate: ko ? '링크 복사' : 'Copy Link',
    copied: ko ? '공인 투표 링크가 복사되었습니다!' : 'Official ballot link copied!',
    pickMyTitle: ko ? '내 KYC 인증 국가 선택' : 'Select your KYC country',
    pickMyDesc: ko ? '여권·생체인증 KYC 국가와 같은 나라를 고르세요.' : 'Choose the country that issued your verified KYC identity.',
    pickViewTitle: ko ? '국가별 투표방 열기' : 'Open a national voting room',
    pickViewDesc: ko ? `전 세계 ${COUNTRIES.length}개국 중 원하는 나라를 검색해 바로 투표방을 엽니다.` : `Search any of the ${COUNTRIES.length} countries to open its room instantly.`,
    citizen: ko ? '시민 제안' : 'Citizen Proposal'
  };

  const handleCheckin = () => {
    if (checkedIn) return alert(ko ? '오늘은 이미 출석체크를 완료했습니다.' : 'You already checked in today.');
    setCheckedIn(true);
    setPoints(p => p + 5);
    alert(ko ? '출석체크 완료! +5 BEOM가 적립되었습니다.' : 'Checked in! +5 BEOM added.');
  };

  const canVote = (a: Agenda) => a.country === 'GLOBAL' || a.country === myCountry;

  const handleVote = (a: Agenda, choice: 'YES' | 'NO') => {
    if (!canVote(a)) {
      return alert(ko
        ? '주권 투표 락: 해당 국가 KYC 시민만 투표할 수 있습니다.'
        : 'Sovereignty Lock: only KYC citizens of that country can vote.');
    }
    if (voted[a.id]) return alert(ko ? '이미 투표에 참여하셨습니다 (1인 1표 보장).' : 'You already voted (one person, one vote).');
    setVoted(v => ({ ...v, [a.id]: choice }));
    setPoints(p => p + 1);
    alert(ko ? '소중한 1표가 블록체인 원장에 안전하게 각인되었습니다! (+1 BEOM)' : 'Your vote is sealed on-chain! (+1 BEOM)');
  };

  const handleDemand = (m: Mall) => {
    if (demanded[m.name]) return alert(ko ? '이미 서명에 참여하셨습니다.' : 'You already signed.');
    setDemanded(d => ({ ...d, [m.name]: true }));
    setPoints(p => p + 1);
    alert(ko ? `[${m.name}] 파이 결제 도입 청원 서명 완료! (+1 BEOM)` : `[${m.nameEn}] petition signed! (+1 BEOM)`);
  };

  const handleGenerateLink = () => {
    const url = `https://kedheon.com/civil?vote=${linkAgenda}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(url);
    alert(`${T.copied}\n${url}`);
  };

  const handlePropose = () => {
    const titleKo = propKo.trim();
    const titleEn = propEn.trim() || titleKo;
    if (!titleKo && !titleEn) {
      return alert(ko ? '안건 제목을 입력해 주세요.' : 'Please enter an agenda title.');
    }
    const room = viewCountry;
    const newAgenda: Agenda = {
      id: `prop-${room}-${Date.now()}`,
      country: room,
      tag: T.citizen,
      tagEn: 'Citizen Proposal',
      title: titleKo || titleEn,
      titleEn: titleEn,
      yes: 0,
      no: 0,
      deadline: 'D-30',
      baseVoters: 0,
      proposed: true
    };
    setProposals(p => ({ ...p, [room]: [newAgenda, ...(p[room] || [])] }));
    setLinkAgenda(newAgenda.id);
    setPropKo('');
    setPropEn('');
    setShowPropose(false);
    setPoints(p => p + 10);
    alert(ko
      ? `[${nameOf(room, true)}] 안건이 온체인 투표 목록에 등록되었습니다! (+10 BEOM)`
      : `Agenda filed for [${nameOf(room, false)}]! (+10 BEOM)`);
  };

  // 선택 국가의 안건: 정적 안건 → 시민 제안 → 기본 자동 의제
  const roomAgendas = useMemo<Agenda[]>(() => {
    const staticList = AGENDAS.filter(a => a.country === viewCountry);
    const proposalList = proposals[viewCountry] || [];
    if (viewCountry === 'GLOBAL') return [...proposalList, ...staticList];
    if (staticList.length === 0 && proposalList.length === 0) {
      return [...proposalList, ...defaultAgendas(viewCountry)];
    }
    return [...proposalList, ...staticList];
  }, [viewCountry, proposals]);

  const allLinkableAgendas = useMemo<Agenda[]>(() => {
    const proposed = Object.values(proposals).flat();
    const autoForRoom = roomAgendas.filter(a => a.id.startsWith('auto-'));
    return [...AGENDAS, ...proposed, ...autoForRoom];
  }, [proposals, roomAgendas]);

  // 현재 목록에 없는 안건이 선택돼 있으면 첫 안건으로 되돌린다 (셀렉트 빈칸 방지)
  useEffect(() => {
    if (allLinkableAgendas.length > 0 && !allLinkableAgendas.some(a => a.id === linkAgenda)) {
      setLinkAgenda(allLinkableAgendas[0].id);
    }
  }, [allLinkableAgendas, linkAgenda]);

  const viewInfo = countryOf(viewCountry);
  const myCountryInfo = countryOf(myCountry);
  const lockActive = viewCountry !== 'GLOBAL' && viewCountry !== myCountry;

  const tabs: string[] = ['GLOBAL', ...QUICK_CODES];
  if (viewCountry !== 'GLOBAL' && !QUICK_CODES.includes(viewCountry)) tabs.splice(1, 0, viewCountry);

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-24 font-black selection:bg-red-50 overflow-x-hidden">

      {/* Navigation — Kedheon 규격 */}
      <nav className="w-full max-w-5xl flex justify-between items-center px-4 py-2 sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-black/10 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg border-2 border-black bg-black flex items-center justify-center text-white text-sm md:text-lg font-black italic">
            C
          </div>
          <div className="text-left leading-tight font-black">
            <h1 translate="no" className="notranslate text-black text-sm md:text-base italic uppercase leading-none">Civil</h1>
            <span className="text-gray-400 text-[11px] font-mono tracking-widest uppercase">KYC VOTING</span>
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
            onClick={handleCheckin}
            className={`px-2 py-1 rounded-lg text-[11px] md:text-xs font-black border transition-all whitespace-nowrap ${checkedIn ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-[#dc2626] text-white border-[#dc2626] active:scale-95'}`}
          >
            {checkedIn ? T.checkedIn : T.checkin}
          </button>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-3 space-y-4">

        {/* Hero */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="flex-1 bg-gray-50 rounded-2xl border border-black/5 p-4 md:p-5 relative shadow-inner overflow-hidden text-left flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]"></div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#dc2626] text-[11px] md:text-xs font-bold uppercase tracking-widest">{T.subtitle}</span>
              <span translate="no" className="notranslate bg-black text-white text-[11px] font-black px-1.5 py-0.5 rounded">🌍 {T.globalCoverage}</span>
            </div>
            <h1 className="text-black text-2xl md:text-3xl uppercase tracking-tighter leading-none mt-1">{T.heroTitle}</h1>
            <p className="text-gray-500 text-xs md:text-sm font-bold leading-relaxed mt-2">{T.heroDesc}</p>
          </div>

          <div className="md:w-64 bg-white rounded-2xl border-2 border-black p-4 md:p-5 text-left flex flex-col justify-between">
            <div>
              <p className="text-gray-400 text-[11px] md:text-xs font-bold uppercase">{T.pointLabel}</p>
              <p className="text-black text-2xl md:text-3xl leading-none mt-1">
                {points.toLocaleString()} <span translate="no" className="notranslate text-sm md:text-base text-[#dc2626] italic">BEOM</span>
              </p>
            </div>
            <div className="mt-3 space-y-1">
              <label className="text-black text-[11px] md:text-xs font-bold block">{T.myCountry}</label>
              <button
                onClick={() => setPicker('MY')}
                className="w-full flex items-center justify-between gap-1 bg-gray-50 border border-black/10 text-black text-xs md:text-sm font-black rounded-xl px-2 py-2 hover:border-black transition-colors"
              >
                <span className="truncate">
                  {myCountryInfo.flag} {ko ? myCountryInfo.ko : myCountryInfo.en} ({myCountryInfo.code})
                </span>
                <span className="text-[11px] text-gray-400 shrink-0">▾ {T.change}</span>
              </button>
              <p className="text-gray-500 text-[11px] md:text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                {T.verified}: {myCountryInfo.flag} {ko ? myCountryInfo.ko : myCountryInfo.en}
              </p>
            </div>
          </div>
        </div>

        {/* Country room filter — 주요국 빠른 필터 + 전 세계 238개국 검색 */}
        <div className="space-y-1.5">
          <div className="flex gap-1.5 overflow-x-auto font-black pb-0.5">
            {tabs.map(code => {
              const info = countryOf(code);
              const active = viewCountry === code;
              return (
                <button
                  key={code}
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
              🌐 {T.allCountries} ▾
            </button>
          </div>
        </div>

        {/* Sovereign agendas */}
        <div>
          <SectionTitle title={T.agenda} desc={T.agendaDesc} />

          {/* 선택 국가 투표방 헤더 */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 border border-black/10 rounded-2xl px-3 py-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg">{viewInfo.flag}</span>
              <div className="min-w-0 text-left">
                <p className="text-black text-xs md:text-sm font-black truncate">
                  {ko ? viewInfo.ko : viewInfo.en}
                  <span className="text-gray-400 font-mono text-[11px] ml-1">{viewInfo.code}</span>
                </p>
                <p className="text-gray-400 text-[11px] font-bold">{roomAgendas.length}{T.roomCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPicker('VIEW')}
                className="px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-black border border-black/10 bg-white text-gray-500 hover:text-black hover:border-black"
              >
                🔎 {ko ? '국가 변경' : 'Change'}
              </button>
              <button
                onClick={() => setShowPropose(v => !v)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-black border border-[#dc2626] bg-[#dc2626] text-white hover:bg-black hover:border-black"
              >
                {T.propose}
              </button>
            </div>
          </div>

          {/* 안건 제안 폼 */}
          {showPropose && (
            <div className="bg-white border-2 border-[#dc2626] rounded-2xl p-3 md:p-4 mb-2 space-y-2 text-left">
              <p className="text-black text-xs md:text-sm font-black">
                {viewInfo.flag} {ko ? viewInfo.ko : viewInfo.en} — {ko ? '안건 제안' : 'Propose an agenda'}
              </p>
              <p className="text-gray-400 text-[11px] md:text-xs font-bold">{T.proposeDesc}</p>
              <input
                value={propKo}
                onChange={e => setPropKo(e.target.value)}
                placeholder={ko ? '예: 지방선거 개표 결과 온체인 검증 의무화' : 'e.g. 온체인 개표 검증'}
                className="w-full bg-gray-50 border border-black/10 rounded-xl px-3 py-2.5 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black font-bold"
              />
              <input
                value={propEn}
                onChange={e => setPropEn(e.target.value)}
                placeholder="e.g. Mandatory on-chain verification of vote counts"
                className="w-full bg-gray-50 border border-black/10 rounded-xl px-3 py-2.5 text-xs md:text-sm text-black placeholder-gray-400 outline-none focus:border-black font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePropose}
                  className="py-2.5 rounded-xl text-xs md:text-sm font-black bg-[#dc2626] text-white hover:bg-black transition-all active:scale-95"
                >
                  {T.propSubmit}
                </button>
                <button
                  onClick={() => setShowPropose(false)}
                  className="py-2.5 rounded-xl text-xs md:text-sm font-black bg-white text-black border-2 border-black hover:text-[#dc2626] hover:border-[#dc2626] transition-all active:scale-95"
                >
                  {T.propCancel}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {roomAgendas.length === 0 && (
              <p className="text-gray-400 text-xs md:text-sm font-bold text-center py-6">{T.noAgenda}</p>
            )}
            {roomAgendas.map(a => {
              const myVote = voted[a.id];
              const yesVotes = a.yes + (myVote === 'YES' ? 1 : 0);
              const noVotes = a.no + (myVote === 'NO' ? 1 : 0);
              const total = yesVotes + noVotes;
              const yesPct = total === 0 ? 0 : Math.round((yesVotes / total) * 100);
              const noPct = total === 0 ? 0 : 100 - yesPct;
              const locked = !canVote(a);
              const countryInfo = countryOf(a.country);
              return (
                <div key={a.id} className="bg-white border-2 border-black/10 rounded-2xl p-4 md:p-5 space-y-3 text-left">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-black text-white text-[11px] md:text-xs font-black px-2 py-0.5 rounded notranslate" translate="no">
                          {countryInfo.flag} {a.country}
                        </span>
                        <span className={`text-[11px] md:text-xs font-black px-2 py-0.5 rounded border ${(a.tag === 'Tax Hunter' || a.proposed) ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'bg-gray-50 text-gray-600 border-black/10'}`}>
                          {ko ? a.tag : a.tagEn}
                        </span>
                      </div>
                      <h3 className="text-black text-sm md:text-base font-black leading-snug mt-2">{ko ? a.title : a.titleEn}</h3>
                    </div>
                    <span className="text-gray-400 text-[11px] md:text-xs font-mono shrink-0">{T.ends} {a.deadline}</span>
                  </div>

                  <div className="space-y-1">
                    {total === 0 ? (
                      <p className="text-gray-400 text-[11px] md:text-xs font-bold">{T.noVotesYet}</p>
                    ) : (
                      <div className="flex justify-between text-[11px] md:text-xs font-bold">
                        <span className="text-black">{T.yes} {yesPct}%</span>
                        <span className="text-[#dc2626]">{T.no} {noPct}%</span>
                      </div>
                    )}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-black h-full" style={{ width: `${yesPct}%` }}></div>
                      <div className="bg-[#dc2626] h-full" style={{ width: `${noPct}%` }}></div>
                    </div>
                    <p className="text-gray-400 text-[11px] md:text-xs font-bold">
                      {(total + (a.baseVoters ?? 0)).toLocaleString()} {T.voters}
                    </p>
                  </div>

                  {locked ? (
                    <div className="bg-gray-50 border border-dashed border-black/20 rounded-xl px-3 py-2.5 text-center">
                      <p className="text-gray-500 text-xs md:text-sm font-bold">{T.locked}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleVote(a, 'YES')}
                        className={`py-2.5 rounded-xl text-xs md:text-sm font-black transition-all active:scale-95 ${myVote === 'YES' ? 'bg-[#dc2626] text-white' : 'bg-black text-white hover:bg-[#dc2626]'}`}
                      >
                        {T.voteYes}
                      </button>
                      <button
                        onClick={() => handleVote(a, 'NO')}
                        className={`py-2.5 rounded-xl text-xs md:text-sm font-black transition-all active:scale-95 border-2 ${myVote === 'NO' ? 'bg-white text-[#dc2626] border-[#dc2626]' : 'bg-white text-black border-black hover:text-[#dc2626] hover:border-[#dc2626]'}`}
                      >
                        {T.voteNo}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {lockActive && (
            <p className="text-[#dc2626] text-[11px] md:text-xs font-bold mt-2">
              🔒 {ko ? '내 KYC 국가' : 'My KYC country'}: {myCountryInfo.flag} {ko ? myCountryInfo.ko : myCountryInfo.en} — {ko ? '다른 나라 안건은 참관만 가능합니다.' : 'other countries are view only.'}
            </p>
          )}
        </div>

        {/* 시민 검증 풀 후원 — Pi 결제 */}
        <div className="bg-white border-2 border-black rounded-2xl p-4 md:p-5 text-left space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-black text-sm md:text-base font-black">
                <span translate="no" className="notranslate text-[#7d4698]">π</span> {ko ? '시민 검증 풀 후원' : 'Citizen verification pool'}
              </h2>
              <p className="text-gray-400 text-[11px] md:text-xs font-bold mt-0.5 leading-relaxed">
                {ko
                  ? '후원한 파이는 238개국 안건의 KYC 검증·감사 비용으로만 쓰이고, 지출 내역은 온체인에 공개됩니다.'
                  : 'Support funds KYC verification and audits across 238 countries — every spend is published on-chain.'}
              </p>
            </div>
            <span className="shrink-0 text-[10px] md:text-[11px] font-black bg-gray-50 border border-black/10 rounded-full px-2 py-0.5 text-gray-500">
              {ko ? 'Pi 결제' : 'Pi payment'}
            </span>
          </div>
          <PiPayButton
            amount={1}
            memo="Civil citizen verification pool"
            label={ko ? '1 Pi 후원' : 'Support with 1 Pi'}
            doneLabel={ko ? '후원 완료' : 'Supported'}
            webHint={ko ? '파이 결제는 Pi Browser 앱 안에서만 진행됩니다.' : 'Pi payments open inside the Pi Browser app.'}
            cancelHint={ko ? '결제를 취소했습니다.' : 'Payment cancelled.'}
            failHint={ko ? '결제가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.' : 'Payment did not complete. Please try again.'}
          />
        </div>

        {/* 10 malls petition */}
        <div>
          <SectionTitle title={T.malls} desc={T.mallsDesc} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {MALLS.map(m => (
              <div key={m.name} className="bg-white border border-black/10 rounded-xl p-3 md:p-4 flex justify-between items-center gap-2 text-left">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] md:text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded font-bold border border-black/5">{ko ? m.tag : m.tagEn}</span>
                    <h3 className="text-black text-sm md:text-base font-black truncate">{ko ? m.name : m.nameEn}</h3>
                  </div>
                  <p className="text-gray-400 text-[11px] md:text-xs font-bold mt-0.5">
                    {T.signers}: {(m.signers + (demanded[m.name] ? 1 : 0)).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDemand(m)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] md:text-xs font-black whitespace-nowrap active:scale-95 transition-all ${demanded[m.name] ? 'bg-gray-100 text-gray-400 border border-black/10' : 'bg-[#dc2626] text-white hover:bg-black'}`}
                >
                  {demanded[m.name] ? T.demanded : T.demand}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Official ballot link generator */}
        <div>
          <SectionTitle title={T.linkTitle} desc={T.linkDesc} />
          <div className="bg-black rounded-2xl p-4 md:p-5 border-[4px] border-[#dc2626] space-y-3 text-left">
            <select
              value={linkAgenda}
              onChange={e => setLinkAgenda(e.target.value)}
              className="w-full bg-white text-black text-xs md:text-sm font-black rounded-xl px-3 py-2.5 outline-none cursor-pointer"
            >
              {allLinkableAgendas.map(a => (
                <option key={a.id} value={a.id}>
                  {countryOf(a.country).flag} {ko ? a.title : a.titleEn}
                </option>
              ))}
            </select>
            <p translate="no" className="notranslate text-gray-400 text-[11px] md:text-xs font-mono break-all bg-white/10 rounded-lg px-3 py-2">
              https://kedheon.com/civil?vote={linkAgenda}
            </p>
            <button
              onClick={handleGenerateLink}
              className="w-full bg-[#dc2626] text-white py-3 rounded-xl text-xs md:text-sm font-black hover:bg-white hover:text-black transition-all active:scale-95"
            >
              {T.generate}
            </button>
          </div>
        </div>

      </main>

      {/* 국가 선택 패널 */}
      <CountryPicker
        open={picker === 'MY'}
        title={T.pickMyTitle}
        desc={T.pickMyDesc}
        current={myCountry}
        ko={ko}
        onClose={() => setPicker(null)}
        onSelect={code => { setMyCountry(code); setViewCountry(code); }}
      />
      <CountryPicker
        open={picker === 'VIEW'}
        title={T.pickViewTitle}
        desc={T.pickViewDesc}
        current={viewCountry}
        ko={ko}
        allowGlobal
        onClose={() => setPicker(null)}
        onSelect={code => setViewCountry(code)}
      />

      {/* Footer — Kedheon 규격 */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl font-black">
        {[
          { label: 'KEDHEON', path: '/' },
          { label: 'CIVIL', path: '/civil' },
          { label: 'FACTFILTER', path: '/factfilter' },
          { label: 'HANGANG', path: '/hangang' },
          { label: 'NEXUS', path: '#' },
          { label: 'VENDOR', path: '#' }
        ].map(item => (
          <button
            key={item.label}
            translate="no"
            onClick={() => {
              if (item.path === '#') alert(item.label + (ko ? ' 서비스 준비 중입니다.' : ' service is coming soon.'));
              else window.location.href = item.path;
            }}
            className={`notranslate flex-1 min-w-0 px-0.5 py-3.5 md:py-4.5 rounded-xl transition-all font-black text-center leading-none whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${item.label === 'CIVIL' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
            style={{ fontSize: 'clamp(7px, 2.05vw, 14px)' }}
          >
            {item.label}
          </button>
        ))}
      </footer>
    </div>
  );
}
