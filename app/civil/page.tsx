'use client';

import React, { useEffect, useState } from 'react';

/**
 * CIVIL — KYC 실명 1인 1표 거버넌스 DApp
 * 디자인 기준: KEDHEON (화이트 #FFFFFF / 블랙 #000000 / 레드 #DC2626)
 *  - 상단 네비게이션·하단 푸터는 app/page.tsx와 동일 규격
 *  - 타이포그래피: H1 text-2xl md:text-3xl / H2 text-lg md:text-xl / H3 text-sm md:text-base / 본문 text-xs md:text-sm
 *  - 주권 투표 락: 내 KYC 국가 안건만 투표, 타국 안건은 참관(읽기) 전용
 */

type CountryCode = 'GLOBAL' | 'KR' | 'US' | 'JP' | 'VN';

interface Agenda {
  id: string;
  country: CountryCode;
  tag: string;
  tagEn: string;
  title: string;
  titleEn: string;
  yes: number;
  no: number;
  deadline: string;
}

interface Mall { name: string; nameEn: string; tag: string; tagEn: string; signers: number; }

const COUNTRIES: { code: CountryCode; flag: string; name: string; nameEn: string }[] = [
  { code: 'GLOBAL', flag: '🌍', name: '글로벌', nameEn: 'Global' },
  { code: 'KR', flag: '🇰🇷', name: '대한민국', nameEn: 'Korea' },
  { code: 'US', flag: '🇺🇸', name: '미국', nameEn: 'United States' },
  { code: 'JP', flag: '🇯🇵', name: '일본', nameEn: 'Japan' },
  { code: 'VN', flag: '🇻🇳', name: '베트남', nameEn: 'Vietnam' }
];

const AGENDAS: Agenda[] = [
  {
    id: 'global-kyc-vote', country: 'GLOBAL', tag: '선거 공정성', tagEn: 'Election Integrity',
    title: '부정선거 및 개표 조작 방지를 위한 블록체인 실명 KYC 투표 의무화',
    titleEn: 'Mandatory on-chain KYC voting to prevent election fraud and vote-count manipulation',
    yes: 88, no: 12, deadline: 'D-4'
  },
  {
    id: 'global-pi-fund', country: 'GLOBAL', tag: '생태계 기금', tagEn: 'Ecosystem Fund',
    title: '1조 파이(Pi) 생태계 기금 운용 — 1인 1표 온체인 감사',
    titleEn: '1T Pi ecosystem fund governance — one person, one vote on-chain audit',
    yes: 91, no: 9, deadline: 'D-9'
  },
  {
    id: 'kr-tax-hunter', country: 'KR', tag: 'Tax Hunter', tagEn: 'Tax Hunter',
    title: '세금 낭비 감시: 지자체 불요불급 전시성 공공 예산 100% 삭감 청원',
    titleEn: 'Tax Hunter: petition to cut 100% of wasteful exhibition-style local government budgets',
    yes: 94, no: 6, deadline: 'D-12'
  },
  {
    id: 'kr-solar-power', country: 'KR', tag: '소상공인·에너지', tagEn: 'SME & Energy',
    title: '소상공인 전기료 부담 경감 및 공장·창고 지붕 태양광 규제 완화',
    titleEn: 'Relief on SME electricity bills and deregulation of rooftop solar on factories and warehouses',
    yes: 89, no: 11, deadline: 'D-7'
  },
  {
    id: 'us-onchain-audit', country: 'US', tag: '선거 검증', tagEn: 'Election Audit',
    title: '연방 선거 전자투표 온체인 검증 의무화',
    titleEn: 'Mandatory on-chain verification of federal electronic ballots',
    yes: 76, no: 24, deadline: 'D-15'
  },
  {
    id: 'us-budget-open', country: 'US', tag: '예산 투명성', tagEn: 'Budget Transparency',
    title: '연방 예산 집행 실시간 공개 및 시민 감사 의무화',
    titleEn: 'Real-time public disclosure of federal spending with citizen audit rights',
    yes: 81, no: 19, deadline: 'D-21'
  },
  {
    id: 'jp-web3-tax', country: 'JP', tag: 'Web3 세제', tagEn: 'Web3 Tax',
    title: 'Web3 자산 양도차익 과세 체계 개편 및 스테이블코인 실명 결제 허용',
    titleEn: 'Reform of Web3 capital gains taxation and real-name stablecoin payments',
    yes: 73, no: 27, deadline: 'D-18'
  },
  {
    id: 'jp-subsidy-ledger', country: 'JP', tag: '보조금 감사', tagEn: 'Subsidy Audit',
    title: '지방자치단체 보조금 집행 내역 온체인 공개',
    titleEn: 'On-chain disclosure of municipal subsidy spending',
    yes: 85, no: 15, deadline: 'D-25'
  },
  {
    id: 'vn-budget-audit', country: 'VN', tag: '지방예산', tagEn: 'Local Budget',
    title: '지방 공공예산 시민 실시간 감사 공개',
    titleEn: 'Real-time citizen audit of local public budgets',
    yes: 87, no: 13, deadline: 'D-11'
  },
  {
    id: 'vn-pi-fee', country: 'VN', tag: '디지털 행정', tagEn: 'Digital Admin',
    title: '디지털 행정 수수료 파이(Pi) 결제 도입',
    titleEn: 'Adoption of Pi payments for digital government service fees',
    yes: 79, no: 21, deadline: 'D-20'
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

const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-2 mb-2 text-left font-black">
    <h2 className="text-black text-lg md:text-xl uppercase italic border-l-[8px] border-black pl-3 tracking-tighter leading-none">
      {title}
    </h2>
    <p className="text-gray-400 text-xs md:text-sm font-bold pl-7 italic leading-none mt-1">{desc}</p>
  </div>
);

export default function CivilPage() {
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [checkedIn, setCheckedIn] = useState(false);
  const [points, setPoints] = useState(847);
  const [myCountry, setMyCountry] = useState<CountryCode>('KR');
  const [viewCountry, setViewCountry] = useState<CountryCode>('GLOBAL');
  const [voted, setVoted] = useState<Record<string, 'YES' | 'NO'>>({});
  const [demanded, setDemanded] = useState<Record<string, boolean>>({});
  const [linkAgenda, setLinkAgenda] = useState('global-kyc-vote');

  // 언어 선택에 맞춰 실제 문서 언어를 알려 브라우저 자동번역 오작동을 막는다.
  useEffect(() => {
    document.documentElement.lang = lang === 'KO' ? 'ko' : 'en';
  }, [lang]);

  const ko = lang === 'KO';
  const T = {
    subtitle: ko ? 'KYC 실명 1인 1표 거버넌스' : 'KYC One Person One Vote Governance',
    heroTitle: ko ? '1인 1표 직접민주주의' : 'One Person, One Vote',
    heroDesc: ko
      ? '파이 KYC 실명 인증을 통과한 시민만 1표를 행사합니다. 봇·알바가 판치는 Web2 투표의 한계를 블록체인 원장으로 넘어섭니다.'
      : 'Only Pi KYC-verified humans cast a vote. An immutable ledger replaces the bot-ridden ballots of Web2.',
    myCountry: ko ? '내 KYC 인증 국가' : 'My KYC Country',
    verified: ko ? 'KYC 인증 확인' : 'KYC Verified',
    pointLabel: ko ? '보유 BEOM 포인트' : 'BEOM Points',
    checkin: ko ? '⚡ 출석체크 (+5 BEOM)' : '⚡ Daily Check-in (+5 BEOM)',
    checkedIn: ko ? '출석 완료' : 'Checked in',
    agenda: ko ? '국가별 주권 투표 안건' : 'Sovereign Agendas by Country',
    agendaDesc: ko
      ? '내 KYC 국가와 글로벌 안건은 1표를 행사할 수 있고, 다른 나라 안건은 참관만 가능합니다.'
      : 'Vote on global and your own country agendas. Other countries are read-only.',
    yes: ko ? '찬성' : 'YES',
    no: ko ? '반대' : 'NO',
    voteYes: ko ? '👍 찬성 투표' : '👍 Vote YES',
    voteNo: ko ? '👎 반대 투표' : '👎 Vote NO',
    locked: ko ? '🔒 해당 국가 KYC 시민만 투표 가능 (참관 모드)' : '🔒 Only that country’s KYC citizens can vote (view only)',
    onchain: ko ? '위변조 불가 온체인 각인' : 'Immutable on-chain record',
    malls: ko ? '글로벌 쇼핑몰 파이 결제 도입 청원' : 'Demand Pi Payment at Global Malls',
    mallsDesc: ko ? '10대 글로벌 쇼핑몰에 파이 결제 도입을 요구하는 시민 서명입니다.' : 'Citizen petition asking the top 10 global malls to accept Pi.',
    signers: ko ? '서명 참여' : 'Signatures',
    demand: '+1 Demand Pi',
    demanded: ko ? '서명완료 ✓' : 'Signed ✓',
    hunter: ko ? '세금 낭비 감시' : 'Tax Waste Watch',
    linkTitle: ko ? '공인 투표 링크 생성기' : 'Official Ballot Link Generator',
    linkDesc: ko
      ? '기업·코어팀·지자체가 공인 투표를 개설할 때 쓰는 링크입니다. 생성된 링크로 들어온 KYC 시민만 집계됩니다.'
      : 'For companies, the core team, and public bodies to open an official ballot. Only KYC citizens arriving through the link are counted.',
    generate: ko ? '링크 복사' : 'Copy Link',
    copied: ko ? '공인 투표 링크가 복사되었습니다!' : 'Official ballot link copied!'
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

  const visibleAgendas = AGENDAS.filter(a => a.country === viewCountry);
  const myCountryInfo = COUNTRIES.find(c => c.code === myCountry)!;
  const lockActive = viewCountry !== 'GLOBAL' && viewCountry !== myCountry;

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
            <span className="text-[#dc2626] text-[11px] md:text-xs font-bold uppercase tracking-widest">{T.subtitle}</span>
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
              <select
                value={myCountry}
                onChange={e => { const c = e.target.value as CountryCode; setMyCountry(c); setViewCountry(c); }}
                className="w-full bg-gray-50 border border-black/10 text-black text-xs md:text-sm font-black rounded-xl px-2 py-2 outline-none cursor-pointer focus:border-black"
              >
                {COUNTRIES.filter(c => c.code !== 'GLOBAL').map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {ko ? c.name : c.nameEn} ({c.code})</option>
                ))}
              </select>
              <p className="text-gray-500 text-[11px] md:text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                {T.verified}: {myCountryInfo.flag} {ko ? myCountryInfo.name : myCountryInfo.nameEn}
              </p>
            </div>
          </div>
        </div>

        {/* Country filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto font-black">
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              onClick={() => setViewCountry(c.code)}
              className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-black border transition-all whitespace-nowrap active:scale-95 ${
                viewCountry === c.code ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-400 border-black/10 hover:text-black'
              }`}
            >
              {c.flag} {ko ? c.name : c.nameEn}
            </button>
          ))}
        </div>

        {/* Sovereign agendas */}
        <div>
          <SectionTitle title={T.agenda} desc={T.agendaDesc} />
          <div className="space-y-2">
            {visibleAgendas.map(a => {
              const myVote = voted[a.id];
              const yesVotes = a.yes + (myVote === 'YES' ? 1 : 0);
              const noVotes = a.no + (myVote === 'NO' ? 1 : 0);
              const total = yesVotes + noVotes;
              const yesPct = Math.round((yesVotes / total) * 100);
              const noPct = 100 - yesPct;
              const locked = !canVote(a);
              const countryInfo = COUNTRIES.find(c => c.code === a.country)!;
              return (
                <div key={a.id} className="bg-white border-2 border-black/10 rounded-2xl p-4 md:p-5 space-y-3 text-left">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-black text-white text-[11px] md:text-xs font-black px-2 py-0.5 rounded notranslate" translate="no">
                          {countryInfo.flag} {a.country}
                        </span>
                        <span className={`text-[11px] md:text-xs font-black px-2 py-0.5 rounded border ${a.tag === 'Tax Hunter' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'bg-gray-50 text-gray-600 border-black/10'}`}>
                          {ko ? a.tag : a.tagEn}
                        </span>
                      </div>
                      <h3 className="text-black text-sm md:text-base font-black leading-snug mt-2">{ko ? a.title : a.titleEn}</h3>
                    </div>
                    <span className="text-gray-400 text-[11px] md:text-xs font-mono shrink-0">{ko ? '마감' : 'Ends'} {a.deadline}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] md:text-xs font-bold">
                      <span className="text-black">{T.yes} {yesPct}%</span>
                      <span className="text-[#dc2626]">{T.no} {noPct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-black h-full" style={{ width: `${yesPct}%` }}></div>
                      <div className="bg-[#dc2626] h-full" style={{ width: `${noPct}%` }}></div>
                    </div>
                    <p className="text-gray-400 text-[11px] md:text-xs font-bold">{(total + 4200).toLocaleString()} {ko ? '명 참여' : 'voters'}</p>
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
              🔒 {ko ? '내 KYC 국가' : 'My KYC country'}: {myCountryInfo.flag} {ko ? myCountryInfo.name : myCountryInfo.nameEn} — {ko ? '다른 나라 안건은 참관만 가능합니다.' : 'other countries are view only.'}
            </p>
          )}
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
              {AGENDAS.map(a => (
                <option key={a.id} value={a.id}>
                  {COUNTRIES.find(c => c.code === a.country)!.flag} {ko ? a.title : a.titleEn}
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

      {/* Footer — Kedheon 규격 */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl font-black">
        {[
          { label: 'KEDHEON', path: '/' },
          { label: 'CIVIL', path: '/civil' },
          { label: 'FACTFILTER', path: '/factfilter' },
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
            className={`notranslate flex-1 py-3.5 md:py-4.5 rounded-xl text-xs md:text-sm transition-all font-black text-center leading-none cursor-pointer hover:scale-105 active:scale-95 ${item.label === 'CIVIL' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
          >
            {item.label}
          </button>
        ))}
      </footer>
    </div>
  );
}
