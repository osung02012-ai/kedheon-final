'use client';

import React, { useState } from 'react';

export default function FactFilterPage() {
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');
  const [activeTab, setActiveTab] = useState<'CHECK' | 'REPORT' | 'LEDGER' | 'VAULT'>('CHECK');
  const [points, setPoints] = useState(847);

  // Check Tab State
  const [query, setQuery] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);

  // Report Tab State
  const [reportType, setReportType] = useState<'CHANNEL' | 'REPORTER' | 'OUTLET'>('REPORTER');
  const [targetName, setTargetName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetDetail, setTargetDetail] = useState('');
  const [reportedList, setReportedList] = useState<any[]>([
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

  const runFactCheck = () => {
    if (!query.trim()) return alert(lang === 'KO' ? '검증할 뉴스 URL이나 의심 문장을 입력해주세요.' : 'Please enter a news URL or statement.');
    setChecking(true);
    setCheckResult(null);

    setTimeout(() => {
      setChecking(false);
      setCheckResult({
        verdict: 'MISLEADING',
        score: 38,
        summary: lang === 'KO' 
          ? '악의적 제목 왜곡 및 자극적 어그로 기사 판정. 본문 내 객관적 출처 및 공식 기관 데이터 부재.' 
          : 'Flagged as Malicious Clickbait. Lack of credible official sources.',
        details: [
          lang === 'KO' ? '공식 발표 원문과 상반된 단어 자의적 왜곡 사용' : 'Contradicts verified primary documentation',
          lang === 'KO' ? '해당 언론사 과거 동일 유형 오보 6건 확인' : 'Publisher has 6 past documented retractions'
        ]
      });
      setPoints(p => p + 2);
    }, 1200);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !targetUrl.trim() || !targetDetail.trim()) {
      return alert(lang === 'KO' ? '모든 필수 항목을 입력해주세요.' : 'Please fill all required fields.');
    }

    const typeLabel = reportType === 'CHANNEL' ? (lang === 'KO' ? '채널' : 'Channel') : reportType === 'REPORTER' ? (lang === 'KO' ? '기자' : 'Reporter') : (lang === 'KO' ? '언론사' : 'Outlet');

    const newReport = {
      id: 'rep-' + Date.now(),
      type: typeLabel,
      name: targetName,
      title: targetDetail.slice(0, 30) + '...',
      proof: targetUrl,
      status: lang === 'KO' ? 'KYC 시민 검증 접수 완료' : 'Submitted for KYC Citizen Review',
      votes: 1
    };

    setReportedList([newReport, ...reportedList]);
    setTargetName('');
    setTargetUrl('');
    setTargetDetail('');
    setPoints(p => p + 10);
    alert(lang === 'KO' 
      ? '악의적 왜곡 제보가 블록체인 검증 원장에 접수되었습니다! (+10 BEOM 적립)' 
      : 'Whistleblower report submitted to the ledger! (+10 BEOM)');
  };

  const handleSealEvidence = () => {
    if (!vaultText.trim()) return alert(lang === 'KO' ? '박제할 증거 본문이나 사건 개요를 입력해주세요.' : 'Enter evidence details.');
    const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setVaultHash(mockHash);
    setPoints(p => p + 5);
    alert(lang === 'KO' 
      ? '증거 지문이 위변조 불가 타임스탬프로 영구 봉인되었습니다! (+5 BEOM)' 
      : 'Evidence sealed with immutable timestamp! (+5 BEOM)');
  };

  return (
    <div className="flex flex-col items-center bg-[#070b12] min-h-screen text-white font-sans w-full pb-28">
      {/* Top Navbar */}
      <nav className="w-full max-w-4xl flex justify-between items-center px-4 py-3 sticky top-0 bg-[#070b12]/95 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl shadow-lg border border-cyan-400/40">
            🔍
          </div>
          <div>
            <div className="text-base font-black tracking-wider flex items-center gap-1.5">
              FACTFILTER <span className="text-[10px] bg-cyan-900/80 text-cyan-300 px-1.5 py-0.5 rounded-full border border-cyan-500/40">ON KEDHEON</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">
              {lang === 'KO' ? 'AI 가짜뉴스 검증 & 기레기·악성 채널 박제 원장' : 'AI Truth Verification & Media Accountability Ledger'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/5 border border-cyan-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold text-cyan-300 flex items-center gap-1">
            <span>🐾</span> {points} <span className="text-[9px] text-gray-400">BEOM</span>
          </div>
          <button
            onClick={() => setLang(l => l === 'KO' ? 'EN' : 'KO')}
            className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-700 transition-all"
          >
            {lang === 'KO' ? 'English' : '한국어'}
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="w-full max-w-4xl px-4 pt-6 pb-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#091e3a] to-[#042f4c] border border-cyan-500/40 p-6 md:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                {lang === 'KO' ? '⚖️ 언론 권력 견제 & 가짜뉴스 박멸 프로젝트' : '⚖️ Truth Verification Protocol'}
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                {lang === 'KO' ? '기레기와 가짜뉴스가 숨을 곳은 없다' : 'Zero Tolerance for Malicious Fake News'}
              </h1>
              <p className="text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed">
                {lang === 'KO' 
                  ? '악의적인 가짜뉴스 채널, 편파 왜곡 기자, 상습 조작 언론사를 블록체인 원장에 영구 박제합니다. 100% 실명 KYC 시민의 힘으로 언론의 신뢰를 바로 세웁니다.' 
                  : 'Immutable public ledger documenting malicious media outlets, unethical reporters, and fake news channels. Powered by verified Pi KYC pioneers.'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-2xl border border-cyan-500/30 text-center min-w-[160px]">
              <div className="text-2xl font-black text-cyan-400">100%</div>
              <div className="text-[10px] text-gray-400">{lang === 'KO' ? 'KYC 실명 검증 보장' : 'KYC Pioneer Verified'}</div>
              <div className="text-xs font-bold text-gray-200 mt-2">{lang === 'KO' ? '외압 삭제 불가' : 'Immutable Proof'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-4xl px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'CHECK', label: lang === 'KO' ? '🔍 AI 팩트체크' : '🔍 AI Fact Check' },
          { key: 'REPORT', label: lang === 'KO' ? '🚨 악성 채널·기자 제보' : '🚨 Report Fake News' },
          { key: 'LEDGER', label: lang === 'KO' ? '🏛️ 기레기 & 왜곡 원장' : '🏛️ Accountability Ledger' },
          { key: 'VAULT', label: lang === 'KO' ? '🛡️ 공익제보 증거 박제' : '🛡️ Evidence Vault' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs md:text-sm whitespace-nowrap transition-all flex-1 text-center cursor-pointer ${
              activeTab === t.key
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-black'
                : 'bg-white/5 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl px-4 space-y-6">

        {/* TAB 1: AI FACT CHECK */}
        {activeTab === 'CHECK' && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-gray-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <span>🔎</span> {lang === 'KO' ? '의심 뉴스 URL 또는 루머 문장 입력' : 'Enter Article URL or Claim'}
              </h2>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={lang === 'KO' ? '예: [단독] 특정 사건 왜곡 보도 기사 링크 또는 제목' : 'e.g. Article link or sensational headline...'}
                  className="flex-1 bg-black/60 border border-gray-700 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition-all"
                />
                <button
                  onClick={runFactCheck}
                  disabled={checking}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-6 py-3 rounded-xl text-xs md:text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {checking ? (lang === 'KO' ? 'AI 교차 검증 중...' : 'Verifying...') : (lang === 'KO' ? '팩트체크 가동' : 'Verify Claim')}
                </button>
              </div>

              {checkResult && (
                <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-1 rounded bg-red-600 text-white">
                      {lang === 'KO' ? '⚠️ 주의: 악의적 왜곡 의심 판정' : '⚠️ Misleading / Biased Content'}
                    </span>
                    <span className="text-xs text-red-400 font-bold">{lang === 'KO' ? '신뢰도 지수: 38/100' : 'Trust Score: 38/100'}</span>
                  </div>
                  <p className="text-xs text-gray-200 font-medium">{checkResult.summary}</p>
                  <ul className="text-[11px] text-gray-400 list-disc list-inside space-y-0.5">
                    {checkResult.details.map((d: string, idx: number) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recent Verified Claims */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {lang === 'KO' ? '최근 시민 팩트체크 검증 사례' : 'Recently Verified Claims'}
              </h3>
              <div className="space-y-2">
                {[
                  { title: '수도권 대형 물류센터 HACCP 위생 위반 묵인 사태', status: '✅ FACT (진실)', note: '국민권익위원회 공익신고자 보호 및 행정처분 원장 일치', badge: 'bg-green-900/60 text-green-300 border-green-500/40' },
                  { title: '글로벌 주요 거래소 파이 코인 기습 상장 찌라시', status: '❌ FAKE (가짜뉴스)', note: '공식 코어팀 발표 부재 및 피싱 유도 악성 링크 판명', badge: 'bg-red-900/60 text-red-300 border-red-500/40' },
                  { title: '공장 지붕 태양광 설치 시 건물 소유권 침해 루머', status: '❌ FALSE (허위)', note: '한전 PPA 임대차 계약 구조상 건물 소유권 보장 법적 확인', badge: 'bg-red-900/60 text-red-300 border-red-500/40' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-gray-800 p-3.5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <div className="text-xs font-bold text-gray-200">{item.title}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{item.note}</div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border whitespace-nowrap ${item.badge}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REPORT MALICIOUS OUTLETS / REPORTERS */}
        {activeTab === 'REPORT' && (
          <div className="bg-white/5 border border-gray-800 rounded-2xl p-5 space-y-5">
            <div>
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <span>🚨</span> {lang === 'KO' ? '악의적 가짜뉴스 채널·기자·언론사 제보' : 'Report Malicious Fake News / Reporters'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {lang === 'KO' 
                  ? '상습 오보, 자극적 합성 썸네일 렉카, 편파 왜곡 기자를 고발해 주십시오. KYC 시민 검증 후 박제됩니다.' 
                  : 'Expose malicious clickbait channels, unethical reporters, and corrupt publishers.'}
              </p>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">{lang === 'KO' ? '제보 대상 분류' : 'Target Category'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'REPORTER', label: lang === 'KO' ? '✍️ 왜곡 기자 실명' : '✍️ Reporter' },
                    { key: 'CHANNEL', label: lang === 'KO' ? '📺 악성 유튜브/SNS' : '📺 Channel' },
                    { key: 'OUTLET', label: lang === 'KO' ? '🏢 왜곡 언론사' : '🏢 Media Outlet' }
                  ].map(c => (
                    <button
                      type="button"
                      key={c.key}
                      onClick={() => setReportType(c.key as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        reportType === c.key 
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' 
                          : 'bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  {lang === 'KO' ? '대상 명칭 (기자 실명 / 채널명 / 언론사명)' : 'Target Name'}
                </label>
                <input
                  type="text"
                  value={targetName}
                  onChange={e => setTargetName(e.target.value)}
                  placeholder={lang === 'KO' ? '예: OO일보 홍OO 기자 또는 유튜브 채널명' : 'Name of reporter, channel, or outlet'}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  {lang === 'KO' ? '가짜뉴스 / 왜곡 증거 URL 또는 영상 링크' : 'Evidence URL / Article Link'}
                </label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/60 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  {lang === 'KO' ? '왜곡 내용 및 피해 사실 상세 기술' : 'Detailed Misconduct & Fact Contrast'}
                </label>
                <textarea
                  value={targetDetail}
                  onChange={e => setTargetDetail(e.target.value)}
                  rows={3}
                  placeholder={lang === 'KO' ? '실제 팩트와 어떻게 다르게 왜곡했는지 구체적인 반박 근거를 적어주세요.' : 'Explain how the report was fabricated with concrete factual counter-evidence.'}
                  className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="bg-cyan-950/30 border border-cyan-800/40 p-3 rounded-xl text-[11px] text-cyan-300/80">
                🔒 {lang === 'KO' ? '제보자의 신원은 영구 비공개 암호화되며, 허위 악성 제보 방지를 위해 파이 KYC 실명 인증자만 제보할 수 있습니다. 정상 제보 접수 시 +10 BEOM (범 포인트)가 적립됩니다.' : 'Whistleblower identity is cryptographically protected. +10 BEOM reward on submission.'}
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 rounded-xl text-sm transition-all shadow-xl cursor-pointer"
              >
                {lang === 'KO' ? '블록체인 검증 원장에 제보 등록 (+10 BEOM)' : 'Submit Report to Ledger (+10 BEOM)'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ACCOUNTABILITY LEDGER */}
        {activeTab === 'LEDGER' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <span>🏛️</span> {lang === 'KO' ? '기레기 & 가짜뉴스 박제 원장' : 'Hall of Shame / Accountability Ledger'}
                </h2>
                <p className="text-xs text-gray-400">
                  {lang === 'KO' ? '시민 검증단에 의해 왜곡·날조가 확정된 언론인 및 채널 목록입니다.' : 'Verified cases of media misconduct documented by the community.'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {reportedList.map((item) => (
                <div key={item.id} className="bg-white/5 border border-gray-800 rounded-2xl p-4 space-y-2 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-500/40">
                        {item.type}
                      </span>
                      <span className="text-xs font-bold text-white">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold">
                      {item.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-gray-200">{item.title}</div>
                  <div className="text-[11px] text-gray-400 bg-black/40 p-2.5 rounded-lg border border-gray-800/80">
                    <span className="text-gray-500 font-bold">{lang === 'KO' ? '반박 증빙:' : 'Proof:'}</span> {item.proof}
                  </div>

                  <div className="flex justify-between items-center pt-1 text-[11px] text-gray-500">
                    <span>👥 {item.votes} {lang === 'KO' ? '시민 검증 참여' : 'Pioneers Verified'}</span>
                    <button
                      onClick={() => alert(lang === 'KO' ? '검증 지지 투표가 완료되었습니다 (+1 BEOM)' : 'Verification vote cast (+1 BEOM)')}
                      className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                    >
                      {lang === 'KO' ? '👍 검증 지지 투표' : '👍 Endorse Proof'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WHISTLEBLOWER VAULT */}
        {activeTab === 'VAULT' && (
          <div className="bg-white/5 border border-gray-800 rounded-2xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <span>🛡️</span> {lang === 'KO' ? '외압 삭제 불가: 불멸의 공익제보 증거 지문' : 'Immutable Whistleblower Evidence Vault'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {lang === 'KO' 
                  ? '사측이나 언론사의 외압으로 기사가 삭제되거나 증거가 인멸되어도, 원본 해시 값을 블록체인에 영구 각인해 법적 최초 작성 시점을 100% 입증합니다.' 
                  : 'Permanent cryptographic fingerprinting for whistleblower evidence. Protected against deletions, cover-ups, and corporate pressure.'}
              </p>
            </div>

            <textarea
              value={vaultText}
              onChange={e => setVaultText(e.target.value)}
              rows={4}
              placeholder={lang === 'KO' ? '봉인할 공익제보 증거 요약, 부당 지시 녹취록, 계약 위반 사실 등을 입력하세요.' : 'Paste evidence details, transcript, or unfair contract terms to seal...'}
              className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400"
            />

            <button
              onClick={handleSealEvidence}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 rounded-xl text-sm transition-all shadow-xl cursor-pointer"
            >
              {lang === 'KO' ? '위변조 불가 타임스탬프로 영구 봉인 (+5 BEOM)' : 'Seal Evidence to Blockchain (+5 BEOM)'}
            </button>

            {vaultHash && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-1 animate-fade-in">
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{lang === 'KO' ? '온체인 증거 고유 해시 (SHA-256)' : 'On-Chain Proof Fingerprint'}</div>
                <div className="font-mono text-xs text-white break-all bg-black/60 p-2 rounded border border-gray-800">{vaultHash}</div>
                <div className="text-[10px] text-gray-400 pt-1">
                  ✓ {lang === 'KO' ? '타임스탬프 원장 각인 완료. 법정 제출용 무결성 증명서 생성 가능.' : 'Timestamped on-chain. Integrity certificate ready.'}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Global Kedheon Ecosystem Navigation Footer */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl font-black">
        {[
          { name: 'KEDHEON', path: '/' },
          { name: 'CIVIL', path: '/civil' },
          { name: 'FACTFILTER', path: '/factfilter' },
          { name: 'NEXUS', path: '#' },
          { name: 'VENDOR', path: '#' }
        ].map(app => (
          <button
            key={app.name}
            onClick={() => {
              if (app.path === '#') {
                alert(app.name + ' 서비스 연동 준비 중입니다.');
              } else {
                window.location.href = app.path;
              }
            }}
            className={`flex-1 py-3.5 md:py-4.5 rounded-xl text-[10px] md:text-sm transition-all font-black text-center leading-none cursor-pointer hover:scale-105 active:scale-95 ${
              app.name === 'FACTFILTER'
                ? 'bg-cyan-600 text-white shadow-md'
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
