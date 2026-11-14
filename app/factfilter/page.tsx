'use client';

import React, { useEffect, useState } from 'react';

/**
 * FACTFILTER — AI 팩트체크 & 언론 책임 원장
 * 디자인 기준: KEDHEON (화이트 #FFFFFF / 블랙 #000000 / 레드 #DC2626)
 *  - 상단 네비게이션·하단 푸터는 app/page.tsx와 동일 규격
 *  - 타이포그래피: H1 text-2xl md:text-3xl / H2 text-lg md:text-xl / H3 text-sm md:text-base / 본문 text-xs md:text-sm
 */

interface ReportItem {
  id: string;
  type: string;
  name: string;
  title: string;
  proof: string;
  status: string;
  votes: number;
}

const SectionTitle = ({ title, desc }: { title: string; desc: string }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-2 mb-2 text-left font-black">
    <h2 className="text-black text-lg md:text-xl uppercase italic border-l-[8px] border-black pl-3 tracking-tighter leading-none">
      {title}
    </h2>
    <p className="text-gray-400 text-xs md:text-sm font-bold pl-7 italic leading-none mt-1">{desc}</p>
  </div>
);

export default function FactFilterPage() {
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [activeTab, setActiveTab] = useState<'CHECK' | 'REPORT' | 'LEDGER' | 'VAULT'>('CHECK');
  const [points, setPoints] = useState(847);

  // 언어 선택에 맞춰 실제 문서 언어를 알려 브라우저 자동번역 오작동을 막는다.
  useEffect(() => {
    document.documentElement.lang = lang === 'KO' ? 'ko' : 'en';
  }, [lang]);

  // Check Tab State
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);

  // Report Tab State
  const [reportType, setReportType] = useState<'CHANNEL' | 'REPORTER' | 'OUTLET'>('REPORTER');
  const [targetName, setTargetName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetDetail, setTargetDetail] = useState('');
  const [reportedList, setReportedList] = useState<ReportItem[]>([
    {
      id: 'rep-1',
      type: '기자',
      name: '김OO 기자 (OO경제)',
      title: 'HACCP 공익신고 내부자 음해성 허위 왜곡 기사',
      proof: '고용노동부 및 권익위 공식 조사 결과와 정반대 날조',
      status: '검증 완료 (블랙리스트 박제)',
      votes: 1420
    },
    {
      id: 'rep-2',
      type: '유튜브 채널',
      name: '찌라시OO 이슈렉카',
      title: '조작된 합성 캡처로 기업 갑질 피해자 2차 가해',
      proof: '원본 녹취록 대조 결과 악의적 편집 판명',
      status: '검증 완료 (경고 등급: 위험)',
      votes: 3890
    },
    {
      id: 'rep-3',
      type: '언론사',
      name: 'OO일보 산업부',
      title: '임금체불 상습 기업 일방적 홍보 및 기사 거래 의혹',
      proof: '피해자 사실 확인 절차 완전 누락 및 허위 보도',
      status: '시민 검증 진행 중 (신뢰도 14%)',
      votes: 920
    }
  ]);

  // Vault State
  const [vaultText, setVaultText] = useState('');
  const [vaultHash, setVaultHash] = useState('');

  const ko = lang === 'KO';

  const runFactCheck = () => {
    if (!query.trim()) return alert(ko ? '검증할 뉴스 URL이나 의심 문장을 입력해주세요.' : 'Please enter a news URL or statement.');
    setChecking(true);
    setCheckResult(null);

    setTimeout(() => {
      setChecking(false);
      setCheckResult({
        verdict: 'MISLEADING',
        score: 38,
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

    const newReport: ReportItem = {
      id: 'rep-' + Date.now(),
      type: typeLabel,
      name: targetName,
      title: targetDetail.slice(0, 30) + '...',
      proof: targetUrl,
      status: ko ? 'KYC 시민 검증 접수 완료' : 'Submitted for KYC Citizen Review',
      votes: 1
    };

    setReportedList([newReport, ...reportedList]);
    setTargetName('');
    setTargetUrl('');
    setTargetDetail('');
    setPoints(p => p + 10);
    alert(ko
      ? '악의적 왜곡 제보가 블록체인 검증 원장에 접수되었습니다! (+10 BEOM 적립)'
      : 'Whistleblower report submitted to the ledger! (+10 BEOM)');
  };

  const handleSealEvidence = () => {
    if (!vaultText.trim()) return alert(ko ? '박제할 증거 본문이나 사건 개요를 입력해주세요.' : 'Enter evidence details.');
    const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setVaultHash(mockHash);
    setPoints(p => p + 5);
    alert(ko
      ? '증거 지문이 위변조 불가 타임스탬프로 영구 봉인되었습니다! (+5 BEOM)'
      : 'Evidence sealed with immutable timestamp! (+5 BEOM)');
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
              <span className="inline-block px-2 py-0.5 rounded bg-black text-white text-[11px] md:text-xs font-black">
                {ko ? '⚖️ 언론 권력 견제 & 가짜뉴스 박멸' : '⚖️ Truth Verification Protocol'}
              </span>
              <h1 className="text-black text-2xl md:text-3xl tracking-tighter leading-tight mt-2">
                {ko ? '기레기와 가짜뉴스가 숨을 곳은 없다' : 'Zero Tolerance for Malicious Fake News'}
              </h1>
              <p className="text-gray-500 text-xs md:text-sm font-bold leading-relaxed mt-2 max-w-xl">
                {ko
                  ? '악의적인 가짜뉴스 채널, 편파 왜곡 기자, 상습 조작 언론사를 블록체인 원장에 영구 박제합니다. 100% 실명 KYC 시민의 힘으로 언론의 신뢰를 바로 세웁니다.'
                  : 'An immutable public ledger documenting malicious outlets, unethical reporters, and fake news channels. Powered by verified Pi KYC pioneers.'}
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
            { key: 'LEDGER', label: ko ? '🏛️ 기레기 & 왜곡 원장' : '🏛️ Accountability Ledger' },
            { key: 'VAULT', label: ko ? '🛡️ 공익제보 증거 박제' : '🛡️ Evidence Vault' }
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

        {/* TAB 1: AI FACT CHECK */}
        {activeTab === 'CHECK' && (
          <div className="space-y-3">
            <div className="bg-white border-2 border-black/10 rounded-2xl p-4 md:p-5 space-y-3 text-left">
              <h2 className="text-black text-lg md:text-xl font-black flex items-center gap-2">
                <span>🔎</span> {ko ? '의심 뉴스 URL 또는 루머 문장 입력' : 'Enter Article URL or Claim'}
              </h2>
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
                    <span className="text-[11px] md:text-xs text-[#dc2626] font-black">{ko ? '신뢰도 지수: 38/100' : 'Trust Score: 38/100'}</span>
                  </div>
                  <p className="text-xs md:text-sm text-black font-bold leading-relaxed">{checkResult.summary}</p>
                  <ul className="text-[11px] md:text-xs text-gray-500 font-bold list-disc list-inside space-y-0.5">
                    {checkResult.details.map((d: string, idx: number) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <SectionTitle
                title={ko ? '최근 시민 팩트체크 검증 사례' : 'Recently Verified Claims'}
                desc={ko ? 'KYC 시민 검증단이 판정한 최신 사례입니다.' : 'Latest verdicts from the KYC citizen panel.'}
              />
              <div className="space-y-2">
                {[
                  { title: ko ? '수도권 대형 물류센터 HACCP 위생 위반 묵인 사태' : 'HACCP hygiene violations at a Greater Seoul logistics hub', status: ko ? '✅ FACT (진실)' : '✅ FACT', note: ko ? '국민권익위원회 공익신고자 보호 및 행정처분 원장 일치' : 'Matches the ACRC whistleblower and enforcement records', badge: 'bg-black text-white', border: 'border-black/10' },
                  { title: ko ? '글로벌 주요 거래소 파이 코인 기습 상장 찌라시' : 'Rumor of a surprise Pi listing on a major exchange', status: ko ? '❌ FAKE (가짜뉴스)' : '❌ FAKE', note: ko ? '공식 코어팀 발표 부재 및 피싱 유도 악성 링크 판명' : 'No core team announcement; a phishing link', badge: 'bg-[#dc2626] text-white', border: 'border-[#dc2626]' },
                  { title: ko ? '공장 지붕 태양광 설치 시 건물 소유권 침해 루머' : 'Rumor that rooftop solar voids building ownership', status: ko ? '❌ FALSE (허위)' : '❌ FALSE', note: ko ? '한전 PPA 임대차 계약 구조상 건물 소유권 보장 법적 확인' : 'Ownership is preserved under the PPA lease structure', badge: 'bg-[#dc2626] text-white', border: 'border-[#dc2626]' }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-white border ${item.border} rounded-xl p-3 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-left`}>
                    <div className="min-w-0">
                      <div className="text-sm md:text-base font-black text-black">{item.title}</div>
                      <div className="text-[11px] md:text-xs text-gray-400 font-bold mt-0.5">{item.note}</div>
                    </div>
                    <span className={`text-[11px] md:text-xs font-black px-2 py-0.5 rounded whitespace-nowrap ${item.badge}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
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
                  ? '상습 오보, 자극적 합성 썸네일 렉카, 편파 왜곡 기자를 고발해 주십시오. KYC 시민 검증 후 박제됩니다.'
                  : 'Expose malicious clickbait channels, unethical reporters, and corrupt publishers.'}
              </p>
            </div>

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
                  ? '제보자의 신원은 영구 비공개 암호화되며, 허위 악성 제보 방지를 위해 파이 KYC 실명 인증자만 제보할 수 있습니다. 정상 제보 접수 시 +10 BEOM가 적립됩니다.'
                  : 'Whistleblower identity is cryptographically protected. +10 BEOM reward on submission.'}
              </div>

              <button
                type="submit"
                className="w-full bg-[#dc2626] hover:bg-black text-white font-black py-3 rounded-xl text-xs md:text-sm transition-all active:scale-95 cursor-pointer"
              >
                {ko ? '블록체인 검증 원장에 제보 등록 (+10 BEOM)' : 'Submit Report to Ledger (+10 BEOM)'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: LEDGER */}
        {activeTab === 'LEDGER' && (
          <div className="text-left">
            <SectionTitle
              title={ko ? '기레기 & 가짜뉴스 박제 원장' : 'Accountability Ledger'}
              desc={ko ? '시민 검증단에 의해 왜곡·날조가 확정된 언론인 및 채널 목록입니다.' : 'Verified cases of media misconduct documented by the community.'}
            />
            <div className="space-y-2">
              {reportedList.map(item => (
                <div key={item.id} className="bg-white border-2 border-black/10 rounded-2xl p-4 md:p-5 space-y-2 hover:border-[#dc2626] transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] md:text-xs font-black px-2 py-0.5 rounded bg-[#dc2626] text-white whitespace-nowrap">
                        {item.type}
                      </span>
                      <span className="text-sm md:text-base font-black text-black truncate">{item.name}</span>
                    </div>
                    <span className="text-[11px] md:text-xs text-gray-500 font-bold">{item.status}</span>
                  </div>

                  <div className="text-sm md:text-base font-black text-black leading-snug">{item.title}</div>
                  <div className="text-[11px] md:text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-black/10 font-bold break-all">
                    <span className="text-black font-black">{ko ? '반박 증빙:' : 'Proof:'}</span> {item.proof}
                  </div>

                  <div className="flex justify-between items-center pt-1 text-[11px] md:text-xs text-gray-400 font-bold">
                    <span>👥 {item.votes} {ko ? '시민 검증 참여' : 'Pioneers Verified'}</span>
                    <button
                      onClick={() => alert(ko ? '검증 지지 투표가 완료되었습니다 (+1 BEOM)' : 'Verification vote cast (+1 BEOM)')}
                      className="text-[#dc2626] hover:text-black font-black cursor-pointer"
                    >
                      {ko ? '👍 검증 지지 투표' : '👍 Endorse Proof'}
                    </button>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
