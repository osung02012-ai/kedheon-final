'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PiBadge from '../components/PiBadge';

/* ------------------------------------------------------------------
 * Hangang — K-Culture all-in-one Pi pass (Kedheon ecosystem)
 * 디자인 시스템: 케데헌과 동일 (White #FFFFFF / Black #000000 / Red #DC2626)
 * 구성: 히어로 · 4대 권역 콘서트 패키지 빌더 · K-굿즈/짐보관/치맥 보드 · 서울 세이프티 실드
 * ------------------------------------------------------------------ */

type Lang = 'KR' | 'EN';
type ZoneKey = 'JAMSIL' | 'SANGAM' | 'GOCHEOK' | 'YONGSAN';
type PickKey = 'stay' | 'culture' | 'food' | 'transit';

interface Opt {
  kr: string;
  en: string;
  pi: number;
}

interface Zone {
  label: string;
  venues: string;
  spot: string;
  picks: Record<PickKey, Opt[]>;
}

const ZONES: Record<ZoneKey, Zone> = {
  JAMSIL: {
    label: 'JAMSIL',
    venues: 'KSPO DOME · 잠실종합운동장',
    spot: 'Songpa · Jamsil',
    picks: {
      stay: [
        { kr: '잠실역 도보 5분 호텔 · 콘서트 종료 후 도보 귀가', en: 'Hotel 5 min walk from Jamsil Stn · walk home after the show', pi: 18 },
        { kr: '석촌·방이 게스트하우스 · KYC 호스트 실명 매칭', en: 'Seokchon/Bangi guesthouse · KYC-verified host', pi: 9 },
        { kr: '강남 연계 4성 · 택시 15분', en: 'Gangnam 4-star · 15 min by taxi', pi: 24 }
      ],
      culture: [
        { kr: 'KSPO DOME 콘서트 입장권 매칭 · 1인 1매 실명', en: 'KSPO DOME ticket match · 1 verified human, 1 seat', pi: 40 },
        { kr: '공식 굿즈 패키지 사전 픽업', en: 'Official merch package, pre-pickup', pi: 6 },
        { kr: '사운드체크 리허설 입장', en: 'Soundcheck rehearsal entry', pi: 12 }
      ],
      food: [
        { kr: '잠실 야구장 치맥 세트', en: 'Jamsil ballpark chicken & beer set', pi: 4 },
        { kr: '석촌호수 브런치', en: 'Seokchon Lake brunch', pi: 5 },
        { kr: '한강 치맥 대행 (송정·광나루)', en: 'Hangang chimaek delivery (Songjeong/Gwangnaru)', pi: 3 }
      ],
      transit: [
        { kr: '김포공항 → 잠실 · 공항철도+2호선 가이드', en: 'Gimpo Airport to Jamsil · airport rail + Line 2 guide', pi: 2 },
        { kr: '심야 올빼미버스 N13·N32 안내', en: 'Night Owl bus N13 / N32 guide', pi: 1 },
        { kr: '귀가 쉐어 · KYC 동승자 매칭', en: 'Ride share home · KYC-matched passengers', pi: 3 }
      ]
    }
  },
  SANGAM: {
    label: 'SANGAM',
    venues: '서울월드컵경기장 · DMC',
    spot: 'Mapo · Sangam',
    picks: {
      stay: [
        { kr: '상암 DMC 호텔 · 경기장 도보 10분', en: 'Sangam DMC hotel · 10 min walk to stadium', pi: 16 },
        { kr: '연남·홍대 게스트하우스', en: 'Yeonnam / Hongdae guesthouse', pi: 11 },
        { kr: '마포 한강뷰 스테이 · 에어비앤비 권역', en: 'Mapo riverside stay · Airbnb zone', pi: 21 }
      ],
      culture: [
        { kr: '스타디움 콘서트 입장권 매칭', en: 'Stadium concert ticket match', pi: 38 },
        { kr: 'DMC 미디어아트 야경 투어', en: 'DMC media-art night tour', pi: 5 },
        { kr: '공식 굿즈 픽업', en: 'Official merch pickup', pi: 6 }
      ],
      food: [
        { kr: '망원시장 로컬 푸드 투어', en: 'Mangwon Market local food tour', pi: 4 },
        { kr: '한강 망원 치맥', en: 'Mangwon Hangang chimaek', pi: 3 },
        { kr: '연남동 브런치', en: 'Yeonnam-dong brunch', pi: 5 }
      ],
      transit: [
        { kr: '인천공항 → 상암 · 리무진+6호선 가이드', en: 'Incheon Airport to Sangam · limousine + Line 6 guide', pi: 2 },
        { kr: '심야 올빼미버스 N72·N26 안내', en: 'Night Owl bus N72 / N26 guide', pi: 1 },
        { kr: '귀가 쉐어 · 합정·홍대 방면', en: 'Ride share home toward Hapjeong / Hongdae', pi: 3 }
      ]
    }
  },
  GOCHEOK: {
    label: 'GOCHEOK',
    venues: '고척스카이돔',
    spot: 'Guro · Gocheok',
    picks: {
      stay: [
        { kr: '고척돔 도보권 호텔', en: 'Hotel within walking distance of Gocheok Dome', pi: 14 },
        { kr: '영등포·신도림 비즈니스 호텔', en: 'Yeongdeungpo / Sindorim business hotel', pi: 12 },
        { kr: '구로 게스트하우스 · KYC 호스트', en: 'Guro guesthouse · KYC host', pi: 8 }
      ],
      culture: [
        { kr: '돔 콘서트 입장권 매칭', en: 'Dome concert ticket match', pi: 36 },
        { kr: '굿즈 사전예약 픽업', en: 'Merch pre-order pickup', pi: 6 },
        { kr: '야구·K리그 관람 (시즌)', en: 'Baseball / K-League match (in season)', pi: 8 }
      ],
      food: [
        { kr: '오류시장·영등포 먹자골목', en: 'Oryu Market / Yeongdeungpo food alley', pi: 4 },
        { kr: '여의도 한강 치맥', en: 'Yeouido Hangang chimaek', pi: 3 },
        { kr: '야식 · 구로 찜질방 세트', en: 'Late-night set · Guro jjimjilbang', pi: 2 }
      ],
      transit: [
        { kr: '김포공항 → 고척 · 9호선 가이드', en: 'Gimpo Airport to Gocheok · Line 9 guide', pi: 2 },
        { kr: '심야 올빼미버스 N62·N61 안내', en: 'Night Owl bus N62 / N61 guide', pi: 1 },
        { kr: '귀가 쉐어 · 야간', en: 'Ride share home · late night', pi: 3 }
      ]
    }
  },
  YONGSAN: {
    label: 'YONGSAN',
    venues: '국립중앙박물관 · 노들섬',
    spot: 'Yongsan · Hangang',
    picks: {
      stay: [
        { kr: '용산역·이촌 호텔 · 한강 도보권', en: 'Yongsan Stn / Ichon hotel · walk to Hangang', pi: 17 },
        { kr: '한남·이태원 부티크 스테이', en: 'Hannam / Itaewon boutique stay', pi: 19 },
        { kr: '노들섬 인근 게스트하우스', en: 'Guesthouse near Nodeul Island', pi: 10 }
      ],
      culture: [
        { kr: '국립박물관 뮷즈 대행 · 반가사유상 미니어처', en: 'Museum goods proxy · Pensive Bodhisattva miniature', pi: 5 },
        { kr: '노들섬 루프탑 콘서트 입장', en: 'Nodeul Island rooftop concert entry', pi: 22 },
        { kr: '박물관 야간개장 가이드', en: 'Museum night-opening guide', pi: 4 }
      ],
      food: [
        { kr: '노들섬 한강 치맥', en: 'Nodeul Island Hangang chimaek', pi: 3 },
        { kr: '이태원 로컬 다이닝', en: 'Itaewon local dining', pi: 6 },
        { kr: '이촌동 국수·냉면', en: 'Ichon-dong noodles', pi: 3 }
      ],
      transit: [
        { kr: '서울역 → 용산 · 공항철도+1호선 가이드', en: 'Seoul Stn to Yongsan · airport rail + Line 1 guide', pi: 2 },
        { kr: '심야 올빼미버스 N15·N75 안내', en: 'Night Owl bus N15 / N75 guide', pi: 1 },
        { kr: '귀가 쉐어 · 한강 북단', en: 'Ride share home · north of Hangang', pi: 3 }
      ]
    }
  }
};

const ZONE_ORDER: ZoneKey[] = ['JAMSIL', 'SANGAM', 'GOCHEOK', 'YONGSAN'];
const PICK_ORDER: PickKey[] = ['stay', 'culture', 'food', 'transit'];

const PICK_LABEL: Record<PickKey, { kr: string; en: string; icon: string }> = {
  stay: { kr: '숙박', en: 'STAY', icon: '🏨' },
  culture: { kr: '문화', en: 'CULTURE', icon: '🎫' },
  food: { kr: '음식', en: 'FOOD', icon: '🍗' },
  transit: { kr: '교통', en: 'TRANSIT', icon: '🚌' }
};

interface GoodsItem {
  id: string;
  kr: string;
  en: string;
  pi: number;
  icon: string;
  grade: string;
}

const GOODS: GoodsItem[] = [
  { id: 'pensive', kr: '국립박물관 뮷즈 · 반가사유상 미니어처 대행', en: 'National Museum goods · Pensive Bodhisattva miniature', pi: 4, icon: '🗿', grade: 'A' },
  { id: 'magpie', kr: '까치호랑이 배지 · 뮷즈 대행', en: 'Magpie and Tiger badge · museum goods proxy', pi: 2, icon: '🐯', grade: 'A' },
  { id: 'locker', kr: '공연장 짐보관 (3시간) · KYC 운영자', en: 'Venue luggage storage (3h) · KYC operator', pi: 2, icon: '🧳', grade: 'A' },
  { id: 'battery', kr: '보조배터리 대여 · 공연장 픽업', en: 'Power bank rental · venue pickup', pi: 1, icon: '🔋', grade: 'B' },
  { id: 'chimaek', kr: '한강 치맥 배달 대리 주문', en: 'Hangang chicken & beer proxy order', pi: 3, icon: '🍺', grade: 'A' }
];

const LINKS = [
  {
    kr: '서울시 안심이 앱 · 안심귀가 모니터링',
    en: 'Seoul Ansimi app · safe-return monitoring',
    dkr: 'CCTV 관제·긴급신고·안심귀가 스카우트. 영어·중국어·일본어 지원.',
    den: 'CCTV monitoring, SOS report, safe-return escort. English, Chinese and Japanese supported.',
    url: 'https://news.seoul.go.kr/welfare/archives/517373',
    tag: 'SEOUL'
  },
  {
    kr: '경찰청 안전Dream',
    en: 'Korean National Police Safety Dream',
    dkr: '실종아동·가출인 신고와 보호 시설 안내.',
    den: 'Missing child and runaway reporting, protection facility guide.',
    url: 'https://www.safe182.go.kr',
    tag: 'POLICE'
  },
  {
    kr: '서울 교통정보 TOPIS · 심야 올빼미버스',
    en: 'Seoul TOPIS · Night Owl bus routes',
    dkr: 'N13~N75 14개 노선 실시간 운행 정보. 23:00~06:00 운행.',
    den: 'Live info for 14 Night Owl routes N13-N75. Runs 23:00-06:00.',
    url: 'https://topis.seoul.go.kr',
    tag: 'TRANSIT'
  },
  {
    kr: '서울시 공식 포털 · 관광·치안 안내',
    en: 'Seoul Metropolitan Government · tourism and safety',
    dkr: '지구대·안심지킴이집(24시 편의점) 위치와 관광 안내.',
    den: 'Police box and safe-zone convenience store locations, visitor information.',
    url: 'https://www.seoul.go.kr',
    tag: 'SEOUL'
  }
];

function fmtPi(n: number) {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

function SectionHead({ no, title, desc }: { no: string; title: string; desc: string }) {
  return (
    <div className="mt-6 mb-2 text-left">
      <div className="flex items-center gap-2">
        <span className="text-[#dc2626] text-[11px] md:text-xs font-black italic leading-none">{no}</span>
        <h2 className="text-black text-base md:text-xl font-black italic uppercase tracking-tighter leading-none">{title}</h2>
      </div>
      <p className="text-gray-400 text-[11px] md:text-xs font-bold mt-1.5 leading-snug">{desc}</p>
    </div>
  );
}

export default function HangangPage() {
  const [lang, setLang] = useState<Lang>('KR');
  const [mounted, setMounted] = useState(false);
  const [zone, setZone] = useState<ZoneKey>('JAMSIL');
  const [pick, setPick] = useState<Record<PickKey, number>>({ stay: 0, culture: 0, food: 0, transit: 0 });
  const [inquiry, setInquiry] = useState(false);
  const [booked, setBooked] = useState<{ zone: ZoneKey; total: number; id: string }[]>([]);
  const [beom, setBeom] = useState(0);
  const [reqType, setReqType] = useState('pensive');
  const [reqZone, setReqZone] = useState<ZoneKey>('YONGSAN');
  const [reqNote, setReqNote] = useState('');
  const [requests, setRequests] = useState<{ id: string; type: string; zone: ZoneKey; note: string }[]>([]);

  const ko = lang === 'KR';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = ko ? 'ko' : 'en';
  }, [ko]);

  const z = ZONES[zone];
  const total = useMemo(
    () => PICK_ORDER.reduce((sum, k) => sum + z.picks[k][pick[k]].pi, 0),
    [z, pick]
  );

  const selectZone = (k: ZoneKey) => {
    setZone(k);
    setPick({ stay: 0, culture: 0, food: 0, transit: 0 });
  };

  const confirmBooking = () => {
    setBooked(prev => [{ zone, total, id: `${zone}-${Date.now().toString().slice(-6)}` }, ...prev]);
    setBeom(v => v + 5);
    setInquiry(false);
  };

  const submitRequest = () => {
    if (!reqNote.trim()) {
      alert(ko ? '요청 내용을 적어 주세요.' : 'Please describe your request.');
      return;
    }
    setRequests(prev => [{ id: Date.now().toString().slice(-6), type: reqType, zone: reqZone, note: reqNote.trim() }, ...prev]);
    setBeom(v => v + 2);
    setReqNote('');
  };

  if (!mounted) return <div className="bg-white min-h-screen" />;

  const goodsOf = (id: string) => GOODS.find(g => g.id === id) || GOODS[0];

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-24 font-black selection:bg-red-50 overflow-x-hidden">

      {/* ── 상단 네비게이션 (케데헌 규격) ───────────────────────── */}
      <nav className="w-full max-w-5xl flex justify-between items-center px-4 py-2 sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-black/10 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg border-2 border-black bg-black flex items-center justify-center shrink-0">
            <span className="text-white text-sm md:text-lg font-black italic leading-none" translate="no">H</span>
          </div>
          <div className="text-left leading-tight font-black min-w-0">
            <h1 className="notranslate text-black text-sm md:text-base italic uppercase leading-none truncate" translate="no">Hangang</h1>
            <span className="text-gray-400 text-[10px] md:text-[11px] font-mono tracking-widest uppercase">K-CULTURE PASS</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <PiBadge en={!ko} />
          <div className="flex bg-gray-100 border border-gray-200 rounded-lg p-0.5">
            {(['KR', 'EN'] as Lang[]).map(l => (
              <button
                key={l}
                translate="no"
                onClick={() => setLang(l)}
                className={`notranslate px-2 py-1 rounded-md text-[10px] md:text-[11px] font-black transition-all ${lang === l ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-black'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-3">

        {/* ── 1. 히어로 & 핵심 가치 ────────────────────────────── */}
        <section className="relative bg-gray-50 rounded-2xl border border-black/5 shadow-inner overflow-hidden px-4 py-7 md:px-8 md:py-9">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#dc2626]/5" />

          <div className="relative grid grid-cols-1 md:grid-cols-[1.08fr_0.92fr] gap-5 md:gap-7 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <p translate="no" className="notranslate inline-block text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-[#dc2626] uppercase mb-2">
                hangang.pi · K-Culture Pass
              </p>
              <h2 className="text-black text-xl md:text-4xl font-black tracking-tighter leading-tight">
                {ko ? (
                  <>한국 번호도, 한국 카드도 없이 —<br className="hidden md:block" /> 서울 콘서트부터 한강 치맥까지</>
                ) : (
                  <>No Korean number. No Korean card.<br className="hidden md:block" /> From Seoul concerts to Hangang chimaek.</>
                )}
              </h2>
              <p className="text-gray-500 text-[11px] md:text-sm font-bold mt-3 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                {ko
                  ? 'Pi KYC 실명 안전망으로 콘서트·숙박·뮷즈·치안까지 한 번에 연결합니다. 수수료 0% 직거래, 모든 예약은 실명 1인 1건.'
                  : 'Pi KYC identity links concerts, stays, museum goods and safety in one pass. 0% direct-deal fee, one verified human per booking.'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-3">
                <span className="text-[9px] md:text-[10px] font-mono font-black tracking-[0.14em] uppercase bg-black text-white rounded-md px-2 py-1">
                  {ko ? '서울 · 한강' : 'Seoul · Hangang'}
                </span>
                <span className="text-[9px] md:text-[10px] font-mono font-black tracking-[0.14em] uppercase bg-white border border-black/10 text-gray-500 rounded-md px-2 py-1">
                  {ko ? 'Pi KYC 1인 1실명' : 'Pi KYC verified human'}
                </span>
              </div>
            </div>

            {/* 대표 이미지 · 황금 메달 민화 까치호랑이 */}
            <figure className="order-1 md:order-2 mx-auto w-full max-w-[280px] md:max-w-[360px]">
              <img
                src="/hangang-hero.jpg"
                alt={ko
                  ? '한강 수호신 까치호랑이 — 황금 원형 메달에 갓과 붉은 한복을 입은 범, 소나무 가지의 까치와 한강 물결을 그린 한국 민화'
                  : 'Hangang tiger guardian in Korean minhwa style — a golden medal with a tiger in a gat and red hanbok, a magpie on a pine branch and Han River waves'}
                width={1024}
                height={1024}
                fetchPriority="high"
                className="w-full aspect-square object-cover rounded-full shadow-xl ring-1 ring-black/5 bg-white"
              />
              <figcaption className="mt-2.5 text-center text-[9px] md:text-[10px] font-mono font-black tracking-[0.14em] uppercase text-gray-400">
                <span translate="no" className="notranslate">까치호랑이</span> · Hangang Guardian
              </figcaption>
            </figure>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2 mt-5 max-w-3xl mx-auto">
            {[
              { v: '0%', kr: '직거래 수수료', en: 'direct-deal fee' },
              { v: '4', kr: '서울 권역 콘서트', en: 'Seoul venue zones' },
              { v: '24h', kr: '1330 관광 통역', en: '1330 travel hotline' },
              { v: `🐾 ${beom}`, kr: 'BEOM 리워드', en: 'BEOM rewards' }
            ].map((s, i) => (
              <div key={i} className="bg-white border border-black/10 rounded-xl px-2 py-2.5">
                <p translate="no" className="notranslate text-black text-sm md:text-lg font-black leading-none">{s.v}</p>
                <p className="text-gray-400 text-[10px] md:text-[11px] font-bold mt-1 leading-none">{ko ? s.kr : s.en}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. 4대 권역 콘서트 올인원 패키지 빌더 ─────────────── */}
        <SectionHead
          no="01"
          title={ko ? '콘서트 올인원 패키지 빌더' : 'Concert all-in-one builder'}
          desc={ko
            ? '권역을 고르고 숙박·문화·음식·교통을 한 번에 조합하세요. 합계는 Pi로, 결제는 KYC 실명 지갑으로.'
            : 'Pick a zone, combine stay, culture, food and transit. Priced in Pi, paid from your KYC wallet.'}
        />

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ZONE_ORDER.map(k => (
            <button
              key={k}
              translate="no"
              onClick={() => selectZone(k)}
              className={`notranslate shrink-0 px-3 py-2 rounded-xl border text-left transition-all ${zone === k ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-400 border-black/10 hover:text-black'}`}
            >
              <span className="block text-[11px] md:text-sm font-black italic leading-none">{ZONES[k].label}</span>
              <span className={`block text-[9px] md:text-[10px] font-bold mt-1 leading-none ${zone === k ? 'text-white/60' : 'text-gray-300'}`}>{ZONES[k].spot}</span>
            </button>
          ))}
        </div>

        <div className="mt-2 bg-white border-2 border-black/10 rounded-2xl p-3 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
            <div className="text-left">
              <p className="text-black text-xs md:text-sm font-black">{z.venues}</p>
              <p className="text-gray-400 text-[10px] md:text-[11px] font-bold mt-0.5">
                {ko ? '공연장 기준 도보·차량 동선으로 묶은 4개 옵션' : 'Four options bundled around the venue'}
              </p>
            </div>
            <span className="text-[10px] md:text-[11px] font-black bg-gray-100 px-2 py-1 rounded-full text-gray-500">
              {ko ? 'KYC 1인 1예약' : 'KYC 1 human / 1 booking'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
            {PICK_ORDER.map(k => (
              <div key={k} className="bg-gray-50 rounded-xl border border-black/5 p-2.5">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                  <span className="mr-1">{PICK_LABEL[k].icon}</span>
                  {ko ? PICK_LABEL[k].kr : PICK_LABEL[k].en}
                </p>
                <div className="space-y-1">
                  {z.picks[k].map((o, i) => {
                    const on = pick[k] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setPick(p => ({ ...p, [k]: i }))}
                        className={`w-full text-left flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 border transition-all ${on ? 'bg-white border-[#dc2626] shadow-sm' : 'bg-white/60 border-black/5 hover:border-black/20'}`}
                      >
                        <span className="min-w-0">
                          <span className={`block text-[11px] md:text-xs font-black leading-snug ${on ? 'text-black' : 'text-gray-500'}`}>
                            {ko ? o.kr : o.en}
                          </span>
                        </span>
                        <span translate="no" className={`notranslate shrink-0 text-[11px] md:text-xs font-black ${on ? 'text-[#dc2626]' : 'text-gray-400'}`}>
                          {fmtPi(o.pi)} <span className="text-[9px]">Pi</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-black rounded-xl px-3 py-3">
            <div className="text-left">
              <p className="text-white/50 text-[10px] md:text-[11px] font-bold leading-none">
                {ko ? '패키지 합계 · 부가 수수료 0%' : 'Package total · 0% added fee'}
              </p>
              <p className="text-white text-lg md:text-2xl font-black leading-none mt-1">
                <span translate="no" className="notranslate">{fmtPi(total)}</span>
                <span translate="no" className="notranslate text-[#dc2626] text-xs md:text-sm ml-1">Pi</span>
                <span className="notranslate text-white/60 text-[10px] md:text-xs ml-2">+ 🐾 5</span>
              </p>
            </div>
            <button
              onClick={() => setInquiry(true)}
              className="bg-[#dc2626] hover:bg-white hover:text-black text-white text-xs md:text-sm font-black px-4 py-2.5 rounded-lg transition-all active:scale-95"
            >
              {ko ? '예약·문의 (보안 QR)' : 'Book / inquire (secure QR)'}
            </button>
          </div>
          <p className="text-gray-400 text-[10px] md:text-[11px] font-bold mt-2 leading-snug">
            {ko
              ? '결제 전 호스트 KYC 실명과 FactFilter 안전 등급을 확인합니다. 예약 확정 시 +5 BEOM 적립.'
              : 'Host KYC identity and FactFilter safety grade are shown before payment. +5 BEOM on confirmation.'}
          </p>
        </div>

        {booked.length > 0 && (
          <div className="mt-2 space-y-1">
            {booked.map(b => (
              <div key={b.id} className="flex items-center justify-between gap-2 bg-gray-50 border-l-[4px] border-[#dc2626] rounded-lg px-2.5 py-2">
                <p className="text-[10px] md:text-[11px] font-black text-black truncate">
                  <span className="notranslate" translate="no">{b.zone}</span> · {ko ? '예약 접수' : 'reservation received'} · <span className="notranslate" translate="no">#{b.id}</span>
                </p>
                <p className="text-[10px] md:text-[11px] font-black text-[#dc2626] shrink-0">
                  <span translate="no" className="notranslate">{fmtPi(b.total)} Pi</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── 3. K-굿즈 · 짐보관 · 한강 치맥 대행 보드 ──────────── */}
        <SectionHead
          no="02"
          title={ko ? 'K-굿즈 · 짐보관 · 치맥 대행 보드' : 'K-goods · luggage · chimaek board'}
          desc={ko
            ? '국립박물관 뮷즈부터 공연장 짐보관, 한강 치맥 배달까지 KYC 호스트가 대신합니다. 요청 시 +2 BEOM.'
            : 'Museum goods, venue luggage storage and Hangang delivery, handled by KYC hosts. +2 BEOM per request.'}
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 md:gap-2">
          {GOODS.map(g => (
            <div key={g.id} className="bg-white border border-black/10 rounded-xl p-2.5 flex flex-col justify-between hover:border-[#dc2626] transition-colors">
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-lg md:text-xl leading-none">{g.icon}</span>
                  <span className="notranslate text-[9px] font-black bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">{g.grade}</span>
                </div>
                <p className="text-[10px] md:text-[11px] font-black text-black leading-snug mt-1.5">{ko ? g.kr : g.en}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span translate="no" className="notranslate text-[11px] md:text-xs font-black text-[#dc2626]">{fmtPi(g.pi)} Pi</span>
                <span className="text-[9px] font-bold text-gray-300">FactFilter {g.grade}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 bg-white border-2 border-black/10 rounded-2xl p-3 md:p-4">
          <p className="text-[11px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
            {ko ? '직접 요청 등록 · KYC 호스트 매칭' : 'Register a request · KYC host matching'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <select
              value={reqType}
              onChange={e => setReqType(e.target.value)}
              className="bg-gray-50 border border-black/5 rounded-lg px-2.5 py-2 text-[11px] md:text-xs font-black outline-none focus:border-black"
            >
              {GOODS.map(g => (
                <option key={g.id} value={g.id}>{ko ? g.kr : g.en}</option>
              ))}
            </select>
            <select
              value={reqZone}
              onChange={e => setReqZone(e.target.value as ZoneKey)}
              className="bg-gray-50 border border-black/5 rounded-lg px-2.5 py-2 text-[11px] md:text-xs font-black outline-none focus:border-black"
            >
              {ZONE_ORDER.map(k => (
                <option key={k} value={k} translate="no" className="notranslate">{ZONES[k].label} · {ZONES[k].spot}</option>
              ))}
            </select>
          </div>
          <textarea
            value={reqNote}
            onChange={e => setReqNote(e.target.value)}
            placeholder={ko ? '예: 11월 18일 18시 고척돔 공연, 짐보관 3시간 + 반가사유상 미니어처 1개' : 'e.g. Nov 18 18:00 Gocheok Dome show, 3h luggage storage + one Pensive Bodhisattva miniature'}
            className="w-full mt-1.5 bg-gray-50 border border-black/5 rounded-lg p-2.5 text-[11px] md:text-xs font-bold h-16 outline-none focus:border-black leading-relaxed"
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2">
            <p className="text-gray-400 text-[10px] md:text-[11px] font-bold leading-snug">
              {ko
                ? '요청 즉시 실명 KYC 호스트에게만 공개되고, FactFilter 안전 등급 A 호스트가 우선 매칭됩니다.'
                : 'Visible only to KYC-verified hosts; FactFilter grade A hosts are matched first.'}
            </p>
            <button
              onClick={submitRequest}
              className="shrink-0 bg-black hover:bg-[#dc2626] text-white text-xs md:text-sm font-black px-4 py-2.5 rounded-lg transition-all active:scale-95"
            >
              {ko ? '요청 등록 (+2 BEOM)' : 'Submit (+2 BEOM)'}
            </button>
          </div>

          {requests.length > 0 && (
            <div className="mt-2 space-y-1">
              {requests.map(r => (
                <div key={r.id} className="flex items-start justify-between gap-2 bg-gray-50 rounded-lg px-2.5 py-2 border-l-[4px] border-black">
                  <div className="min-w-0 text-left">
                    <p className="text-[10px] md:text-[11px] font-black text-black truncate">{ko ? goodsOf(r.type).kr : goodsOf(r.type).en}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate">{r.note}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="notranslate text-[9px] font-black text-gray-400" translate="no">{r.zone} #{r.id}</p>
                    <p className="text-[9px] font-black text-[#dc2626]">{ko ? '호스트 매칭 중' : 'matching host'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 4. 서울 세이프티 실드 ─────────────────────────────── */}
        <SectionHead
          no="03"
          title={ko ? '서울 세이프티 실드' : 'Seoul safety shield'}
          desc={ko
            ? '공연이 끝난 심야에도 혼자 남지 않도록 — 긴급 핫라인과 공식 안전망을 한 화면에 모았습니다.'
            : 'So no one is left alone after the show: emergency hotlines and official safety networks in one screen.'}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2">
          {[
            { num: '112', tel: '112', kr: '경찰 신고', en: 'Police', dkr: '24시간', den: '24h' },
            { num: '119', tel: '119', kr: '응급·구조', en: 'Ambulance', dkr: '24시간', den: '24h' },
            { num: '1330', tel: '1330', kr: '관광 통역·관광경찰', en: 'Travel hotline', dkr: '24시간 다국어', den: '24h, multilingual' },
            { num: '120', tel: '02120', kr: '다산콜센터', en: 'Seoul 120', dkr: '야간·공휴일', den: 'nights & holidays' }
          ].map(h => (
            <a
              key={h.num}
              href={`tel:${h.tel}`}
              className="bg-black rounded-xl p-3 text-left border-2 border-black hover:border-[#dc2626] transition-colors group"
            >
              <p translate="no" className="notranslate text-white text-xl md:text-2xl font-black leading-none group-hover:text-[#dc2626]">{h.num}</p>
              <p className="text-white/70 text-[10px] md:text-[11px] font-black mt-1 leading-none">{ko ? h.kr : h.en}</p>
              <p className="text-white/40 text-[9px] font-bold mt-1 leading-none">{ko ? h.dkr : h.den}</p>
            </a>
          ))}
        </div>

        <div className="mt-2 space-y-1.5">
          {LINKS.map(l => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-2 bg-white border border-black/10 rounded-xl px-3 py-2.5 hover:border-black transition-colors"
            >
              <div className="min-w-0 text-left">
                <p className="text-[11px] md:text-xs font-black text-black leading-snug">{ko ? l.kr : l.en}</p>
                <p className="text-[10px] md:text-[11px] font-bold text-gray-400 leading-snug mt-0.5">{ko ? l.dkr : l.den}</p>
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                <span translate="no" className="notranslate text-[9px] font-black bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">{l.tag}</span>
                <span className="text-gray-300 text-sm">↗</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-2 bg-gray-50 border-l-[4px] border-[#dc2626] rounded-lg px-3 py-2.5">
          <p className="text-[10px] md:text-[11px] font-bold text-gray-500 leading-relaxed text-left">
            {ko
              ? '가까운 지구대와 24시간 편의점(안심지킴이집) 위치는 안심이 앱 지도에서 확인할 수 있습니다. 심야 이동은 올빼미버스 N13~N75, 귀가가 어려우면 120으로 안심귀가 스카우트(평일 22시~01시)를 요청하세요. 응급 상황에서는 112·119가 최우선입니다.'
              : 'Nearby police boxes and 24h safe-zone convenience stores are mapped in the Ansimi app. Use Night Owl buses N13-N75 after midnight, and call 120 for the safe-return escort (weekdays 22:00-01:00). In an emergency, 112 and 119 come first.'}
          </p>
        </div>

        <p className="text-center text-gray-300 text-[10px] font-bold mt-6 mb-2">
          <span translate="no" className="notranslate">Hangang</span> · <span translate="no" className="notranslate">hangang.pi</span> · {ko ? '케데헌 생태계 실물 경제 레이어' : 'real-world economy layer of the Kedheon ecosystem'}
        </p>
      </main>

      {/* ── 예약·문의 모달 (케데헌 보안 QR 데모) ─────────────────── */}
      {inquiry && (
        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4" onClick={() => setInquiry(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl border-2 border-black p-4 md:p-5 space-y-3 text-left shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-black text-sm md:text-base font-black">{ko ? '예약·문의 확인' : 'Confirm booking'}</h3>
                <p translate="no" className="notranslate text-gray-400 text-[11px] font-bold mt-0.5">{ZONES[zone].label} · {ZONES[zone].venues}</p>
              </div>
              <button onClick={() => setInquiry(false)} aria-label="close" className="shrink-0 w-8 h-8 rounded-full border border-black/10 text-black text-sm font-black hover:bg-gray-100">✕</button>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 border border-black/10 rounded-xl p-3">
              <img src="/qr-personal.png" alt="Kedheon secure QR" className="w-20 h-20 object-contain bg-white rounded-lg border border-black/10" />
              <div className="min-w-0">
                <p className="text-[11px] md:text-xs font-black text-black">{ko ? '케데헌 보안 QR' : 'Kedheon secure QR'}</p>
                <p className="text-[10px] md:text-[11px] font-bold text-gray-500 leading-snug mt-1">
                  {ko ? 'Pi Browser에서 스캔하면 KYC 실명 지갑으로 결제·확인이 이어집니다.' : 'Scan in Pi Browser to pay and confirm with your KYC wallet.'}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {PICK_ORDER.map(k => (
                <div key={k} className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1">
                  <p className="text-[10px] md:text-[11px] font-bold text-gray-500 min-w-0">
                    <span className="text-gray-300 mr-1">{PICK_LABEL[k].icon}</span>
                    {ko ? z.picks[k][pick[k]].kr : z.picks[k][pick[k]].en}
                  </p>
                  <p translate="no" className="notranslate shrink-0 text-[10px] md:text-[11px] font-black text-black">{fmtPi(z.picks[k][pick[k]].pi)} Pi</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-black rounded-xl px-3 py-2.5">
              <p className="text-white/50 text-[10px] font-bold">{ko ? '합계 · 수수료 0%' : 'Total · 0% fee'}</p>
              <p translate="no" className="notranslate text-white text-base font-black">{fmtPi(total)} Pi <span className="text-[#dc2626] text-[10px] ml-1">+ 🐾 5</span></p>
            </div>

            <button onClick={confirmBooking} className="w-full bg-[#dc2626] hover:bg-black text-white text-xs md:text-sm font-black py-3 rounded-xl transition-all active:scale-95">
              {ko ? '예약 접수 · +5 BEOM 적립' : 'Confirm · earn +5 BEOM'}
            </button>
            <p className="text-gray-400 text-[10px] font-bold leading-snug">
              {ko
                ? '이 화면은 데모입니다. 실제 결제·정산은 KYC 호스트 확인 후 Pi로 진행됩니다.'
                : 'This screen is a demo. Real payment settles in Pi after host KYC verification.'}
            </p>
          </div>
        </div>
      )}

      {/* ── 하단 고정 푸터 (6개 앱) ──────────────────────────── */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto bg-white border-2 border-black px-1 py-1.5 rounded-2xl flex justify-between gap-0.5 md:gap-1.5 z-[1000] shadow-2xl font-black">
        {[
          { name: 'KEDHEON', path: '/' },
          { name: 'CIVIL', path: '/civil' },
          { name: 'FACTFILTER', path: '/factfilter' },
          { name: 'HANGANG', path: '/hangang' },
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
            className={`notranslate flex-1 min-w-0 px-0.5 py-3.5 md:py-4.5 rounded-xl transition-all font-black text-center leading-none whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
              app.name === 'HANGANG' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'
            }`}
            style={{ fontSize: 'clamp(7px, 2.05vw, 14px)' }}
          >
            {app.name}
          </button>
        ))}
      </footer>
    </div>
  );
}
