'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PiBadge from './components/PiBadge';

/** * [KEDHEON MASTER V271.0 - FINANCE CORE / TURBOPACK OPTIMIZATION PATCH]
 * -----------------------------------------------------------
 * 패치 내역:
 * 1. Turbopack 컴파일러 과부하 방지를 위한 소스 코드 내 특수 공백 문자 정규화
 * 2. 다국어 사전 데이터 내부 구문 무결성 확보 및 이스크레이프 문자 정지 결함 제거
 * 3. 부동소수점 오차 방지용 고정소수점 마이크론(μPi) 연산 모듈 최적화
 * 4. 파이 브라우저 해상도 방어용 수직 Dropdown 및 노드 최고점수 19.02 유지
 * -----------------------------------------------------------
 */

// --- Core Finance Math Logic (BigInt Precision Engine) ---
const toMicron = (piAmount: number | string): bigint => {
  const parts = piAmount.toString().split('.');
  const integerPart = parts[0];
  let decimalPart = parts[1] || '';
  decimalPart = decimalPart.padEnd(6, '0').slice(0, 6);
  return BigInt(integerPart + decimalPart);
};

const toStandardPi = (micronAmount: bigint): string => {
  const micronStr = micronAmount.toString().padStart(7, '0');
  const integerPart = micronStr.slice(0, -6) || '0';
  const decimalPart = micronStr.slice(-6).replace(/0+$/, '');
  return decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;
};

const executeSafeConversion = (
  currentPiBalance: number,
  convertAmountPi: number
): { success: boolean; nextPi: number; addedBeom: number } => {
  if (currentPiBalance < convertAmountPi) {
    return { success: false, nextPi: currentPiBalance, addedBeom: 0 };
  }
  const balanceMicrons = toMicron(currentPiBalance);
  const convertMicrons = toMicron(convertAmountPi);
  const remainingMicrons = balanceMicrons - convertMicrons;
  const nextPiStr = toStandardPi(remainingMicrons);
  const addedBeomTokens = convertAmountPi * 1000;

  return {
    success: true,
    nextPi: Number(nextPiStr),
    addedBeom: addedBeomTokens
  };
};

// --- Types ---
type Lang = 'KR' | 'EN' | 'CN' | 'JP' | 'ES' | 'VN' | 'FR' | 'PT' | 'RU' | 'ID';
interface Step { t: string; d: string; links?: { AOS: string; iOS: string; }; warning?: boolean; }
interface GoodsItem { id: number; name: string; price: number; img: string; desc: string; seller: string; }
interface Dictionary {
  rookie: string; pioneer: string; exchange: string; auth: string; creative: string;
  market: string; partnership: string; invitation: string; procedure: string;
  assets: string; activate: string; convert: string; post: string; buy: string;
  register: string; submit: string; downloadAOS: string; downloadiOS: string; buyBeom: string;
  piJoinDesc: string; steps: Step[]; 
  corpName: string; email: string; contact: string; manager: string; vision: string;
  itemName: string; itemPrice: string; itemDesc: string; itemImg: string; bizPlaceholder: string;
  portalStatus: string;
  exList: string[];
  exchangeDesc: string; authDesc: string; creativeDesc: string; fanRoomDesc: string;
  marketDesc: string; partnershipDesc: string;
  convertTitle: string; convertBtn: string;
  walletType: string; personal: string; corporate: string; encodedQR: string;
  feedTitle: string; feedLink: string; feedDesc: string; postBtn: string;
  marketBuyTab: string; marketSellTab: string; buyReqBtn: string; sellDoneBtn: string;
  copyPrompt: string; copiedAlert: string; inviteReveal: string; piLackAlert: string; convDoneAlert: string;
  beomLackAlert: string; regDoneAlert: string; propDoneAlert: string;
  devRecruitTitle: string; devRecruitDesc: string; devRecruitBtn: string;
  cats: string[];
  fans: string[];
  goodsMock: GoodsItem[];
}

const PI_INVITE_CODE = 'ohsangjo';

const DICT: Record<Lang, Dictionary> = {
  KR: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "01. 파이 결제 & 생태계 기여 리워드 (BEOM Rewards)", auth: "02. 스마트 보안 큐알 (Smart Security QR)",
    creative: "03. 팬심 토큰 보상 시스템", market: "04. 굿즈 판매 및 구입", partnership: "05. 글로벌 파트너십",
    invitation: "Web3 초대장", procedure: "파이코인 시작하기", assets: "보유 자산",
    activate: "스마트 보안 QR 생성 (안심 결제)", convert: "출석 포인트 받기", post: "피드 등록 (10 BEOM)",
    buy: "구매하기", register: "판매 등록", submit: "제안 제출하기", 
    downloadAOS: "안드로이드 다운로드", downloadiOS: "아이폰 다운로드", buyBeom: "BEOM 구매",
    corpName: "기업/단체명", email: "메일 주소", contact: "연락처", manager: "담당자명", vision: "제안 내용 (상세)",
    itemName: "상품명", itemPrice: "가격 (BEOM)", itemDesc: "상품 설명", itemImg: "이미지 URL", bizPlaceholder: "기업명 또는 사업자명을 입력하세요",
    portalStatus: "현재 하위 각 앱으로의 연동이 진행 중인 통합 포털 앱입니다.",
    piJoinDesc: "인류 최대의 네트워크 생태계에 합류하십시오.",
    exchangeDesc: "파이 결제 및 생태계 기여 활동에 참여하고 BEOM 리워드 포인트를 적립받으십시오.",
    authDesc: "3분 일회용 다이내믹 결제, 스텔스 지갑 안심 보호, 전자 영수증 및 BEOM 리워드가 자동 적립됩니다.",
    creativeDesc: "팬심을 공유하여 범토큰 보상을 받고 창작 활동을 지원받으십시오.",
    fanRoomDesc: "※ 🚩 팬룸 개설(500 BEOM): 90% 수익 환원 및 거버넌스 권한 부여.",
    marketDesc: "굿즈를 안전하게 거래하거나 본인의 아이템을 판매하십시오.",
    partnershipDesc: "글로벌 파트너십을 위한 비즈니스 제안을 기다립니다.",
    exList: [
      "1. 생태계 기여 리워드 (파이 결제 및 활동 시 BEOM 포인트 자동 적립)",
      "2. 스마트 보안 QR (3분 일회용 다이내믹 결제 & 스텔스 지갑 안심 보호)",
      "3. 전자 영수증 & POS (결제 즉시 블록체인 영수증 발행 및 가맹점 정산)",
      "4. 팬덤 보상 (창작 및 팬 활동에 따른 BEOM 리워드 시스템)",
      "5. 굿즈 장터 (리워드 포인트로 한정 아이템 거래 및 판매)",
      "6. 파트너십 (기업 간 B2B 협력 및 비즈니스 제안 포털)"
    ],
    steps: [
      { t: "공식 앱 설치", d: "스마트폰 기기에 맞는 앱을 설치하십시오.", links: { AOS: "https://minepi.com/#download", iOS: "https://minepi.com/#download" } },
      { t: "가입 방식 선택", d: "Phone number(핸드폰) 가입을 권장합니다." },
      { t: "국가 설정", d: "South Korea(+82)를 선택하고 번호를 입력하세요." },
      { t: "비밀번호 설정", d: "영문 대/소문자와 숫자를 조합하세요." },
      { t: "프로필 작성", d: "여권 영문 성함과 사용할 ID를 입력하세요." },
      { t: "초대 코드 입력", d: "아래 초대 코드 박스를 클릭해 확인한 뒤 입력하세요." },
      { t: "비밀구절 보관", d: "24개 단어는 반드시 종이에 수기 기록하세요. (디지털 저장 시 해킹 위험: 캡처, 메모장, 이메일 저장 절대 금지. 유출 시 지갑 복구 불가 및 모든 자산 분실 위험.)", warning: true },
      { t: "채굴 시작", d: "매일 한 번 번개 버튼을 눌러 활동을 시작하세요." }
    ],
    convertTitle: "생태계 기여 보너스 적립", convertBtn: "출석 & 기여 리워드 받기 (+50 BEOM)",
    walletType: "지갑 보호 타입", personal: "개인용", corporate: "기업용", encodedQR: "Encoded QR",
    feedTitle: "제목 또는 팬심 공유", feedLink: "이미지/영상 링크 (URL)", feedDesc: "상세 내용을 기록하십시오", postBtn: "피드 등록 (10 BEOM)",
    marketBuyTab: "굿즈 구매", marketSellTab: "판매 등록", buyReqBtn: "구매 신청", sellDoneBtn: "굿즈 등록 완료",
    copyPrompt: "복사하려면 클릭", copiedAlert: "추천인 코드가 복사되었습니다!", inviteReveal: "초대 코드 확인 및 복사 (클릭)", piLackAlert: "PI 부족", convDoneAlert: "리워드 적립 완료!",
    beomLackAlert: "BEOM 부족", regDoneAlert: "등록 성공", propDoneAlert: "제안서가 전송되었습니다.",
    devRecruitTitle: "파이 코어팀 개발자 공식 모집", devRecruitDesc: "파이 생태계를 함께 구축할 글로벌 개발자를 모집합니다.", devRecruitBtn: "공지 확인 및 지원하기",
    cats: ['CCM', '뮤지션', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['케데헌', '헌트릭스', 'BTS'],
    goodsMock: [
      { id: 1, name: "기념 골드 뱃지", price: 1000, desc: "한정판 실물 뱃지입니다.", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "V23 노드 마스터키", price: 5000, desc: "노드 운영 디지털 마스터키입니다.", img: "/node-icon.png", seller: "System" }
    ]
  },
  EN: {
    rookie: "ROOKIE", pioneer: "PIONEER", exchange: "01. PI PAY & BEOM REWARDS", auth: "02. SMART SECURITY QR",
    creative: "03. FANDOM REWARDS", market: "04. GOODS MARKET", partnership: "05. PARTNERSHIP",
    invitation: "Web3 Invitation", procedure: "Getting Started with Pi", assets: "ASSETS",
    activate: "GENERATE SMART QR (SECURE)", convert: "CONVERT NOW", post: "POST (10 BEOM)",
    buy: "BUY", register: "SELL", submit: "SUBMIT PROPOSAL",
    downloadAOS: "Android", downloadiOS: "iPhone", buyBeom: "BUY BEOM",
    corpName: "Company", email: "Email", contact: "Contact", manager: "Manager", vision: "Proposal Details",
    itemName: "Item Name", itemPrice: "Price (BEOM)", itemDesc: "Description", itemImg: "Image URL", bizPlaceholder: "Enter Company or Business Name",
    portalStatus: "Integrated Portal App: Sub-app connectivity in progress.",
    piJoinDesc: "Join the largest Web3 network ecosystem.",
    exchangeDesc: "Earn BEOM contribution rewards and explore core ecosystem utilities.",
    authDesc: "Pay and authenticate safely via QR without exposing address.",
    creativeDesc: "Get BEOM rewards by sharing spirit and supporting creators.",
    fanRoomDesc: "※ 🚩 Fan Room (500 BEOM): 90% Return and Governance Rights.",
    marketDesc: "Trade exclusive goods and register your own items.",
    partnershipDesc: "Global partnership opportunities and proposals.",
    exList: [
      "1. Ecosystem Rewards (Earn BEOM points via Pi payment & activity)",
      "2. QR Code (Secure pay without exposing wallet address)",
      "3. Fandom Rewards (System to earn BEOM via activities)",
      "4. Goods Market (Selling and buying limited items)",
      "5. Partnership (B2B collaboration and proposal portal)"
    ],
    steps: [
      { t: "Install", d: "Download the official app.", links: { AOS: "#", iOS: "#" } },
      { t: "Method", d: "Select 'Continue with phone number'." },
      { t: "Country", d: "Select +82 and enter your number." },
      { t: "Password", d: "Combine Upper/Lower case and Numbers." },
      { t: "Profile", d: "Enter passport name and ID." },
      { t: "Invite Code", d: "Click the invite code box below to reveal and enter." },
      { t: "Passphrase", d: "Handwrite 24 words on paper and store safely. (Do NOT save digitally due to hacking risks.)", warning: true },
      { t: "Mining", d: "Tap lightning bolt every 24h." }
    ],
    convertTitle: "Ecosystem Contribution Rewards", convertBtn: "EARN REWARDS (+50 BEOM)",
    walletType: "Wallet Protection Type", personal: "Personal", corporate: "Corporate", encodedQR: "Encoded QR",
    feedTitle: "Title or Share Spirit", feedLink: "Image/Video Link (URL)", feedDesc: "Describe your activity in detail", postBtn: "POST (10 BEOM)",
    marketBuyTab: "BUY GOODS", marketSellTab: "SELL ITEMS", buyReqBtn: "BUY REQUEST", sellDoneBtn: "COMPLETE REGISTRATION",
    copyPrompt: "Click to Copy", copiedAlert: "Invite Code Copied!", inviteReveal: "Reveal & copy invite code (tap)", piLackAlert: "Not enough PI", convDoneAlert: "Conversion Complete!",
    beomLackAlert: "Not enough BEOM", regDoneAlert: "Registration Successful", propDoneAlert: "Proposal Submitted.",
    devRecruitTitle: "Pi Core Team Developer Recruitment", devRecruitDesc: "Join the official global developers building the Pi ecosystem.", devRecruitBtn: "CHECK & APPLY",
    cats: ['CCM', 'MUSICIAN', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "Gold Badge", price: 1000, desc: "Limited physical badge.", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "V23 Node Key", price: 5000, desc: "Node digital master key.", img: "/node-icon.png", seller: "System" }
    ]
  },
  CN: {
    rookie: "新手", pioneer: "先锋", exchange: "01. PI 支付与生态贡献奖励", auth: "02. 安全二维码",
    creative: "03. 粉丝奖励系统", market: "04. 商品市场", partnership: "05. 全球合作伙伴",
    invitation: "Web3 邀请函", procedure: "加入指南", assets: "我的资产",
    activate: "生成智能安全二维码", convert: "领取奖励", post: "发布 (10 BEOM)",
    buy: "购买", register: "出售注册", submit: "提交提案",
    downloadAOS: "Android 下载", downloadiOS: "iPhone 下载", buyBeom: "购买 BEOM",
    corpName: "公司名称", email: "电子邮件", contact: "联系方式", manager: "负责人", vision: "提案详情",
    itemName: "商品名称", itemPrice: "价格 (BEOM)", itemDesc: "商品描述", itemImg: "图片链接", bizPlaceholder: "输入公司或企业名称",
    portalStatus: "集成门户应用：子应用连接进行中。",
    piJoinDesc: "加入全球最大的 Web3 网络生态系统。",
    exchangeDesc: "通过生态贡献与 Pi 支付积累 BEOM 奖励积分，探索核心功能。",
    authDesc: "通过安全二维码完成支付与身份验证，无需暴露钱包地址。",
    creativeDesc: "分享热情并支持创作者以获得 BEOM 奖励。",
    fanRoomDesc: "※ 🚩 粉丝房间 (500 BEOM): 90% 回报和治理权。",
    marketDesc: "交易独家商品并注册您自己的物品。",
    partnershipDesc: "全球合作伙伴机会与商业提案。",
    exList: [
      "1. 生态贡献奖励 (Pi 支付与活动自动获得 BEOM 积分)",
      "2. 二维码 (安全支付功能)",
      "3. 粉丝奖励 (活动获取 BEOM 奖励)",
      "4. 商品市场 (买卖独家物品)",
      "5. 合作伙伴 (B2B 协作门户)"
    ],
    steps: [
      { t: "安装", d: "下载官方应用程序。", links: { AOS: "#", iOS: "#" } },
      { t: "方式", d: "选择使用手机号码继续。" },
      { t: "国家", d: "选择 +82 并输入您的号码。" },
      { t: "密码", d: "结合大小写字母与数字。" },
      { t: "个人资料", d: "输入护照姓名与用户 ID。" },
      { t: "邀请码", d: "点击下方邀请码框查看并输入。" },
      { t: "助记词", d: "在纸上手写 24 个单词并妥善保存。(请勿数字保存，以防黑客攻击)", warning: true },
      { t: "挖矿", d: "每 24 小时点击一次闪电图标。" }
    ],
    convertTitle: "生态贡献奖励积分", convertBtn: "领取签到奖励 (+50 BEOM)",
    walletType: "钱包保护类型", personal: "个人", corporate: "企业", encodedQR: "加密二维码",
    feedTitle: "标题或分享热情", feedLink: "图片/视频链接 (URL)", feedDesc: "详细描述您的活动", postBtn: "发布 (10 BEOM)",
    marketBuyTab: "购买商品", marketSellTab: "出售物品", buyReqBtn: "购买请求", sellDoneBtn: "完成注册",
    copyPrompt: "点击复制", copiedAlert: "邀请码已复制！", inviteReveal: "查看并复制邀请码（点击）", piLackAlert: "PI 余额不足", convDoneAlert: "奖励领取成功！",
    beomLackAlert: "BEOM 余额不足", regDoneAlert: "注册成功", propDoneAlert: "提案已提交。",
    devRecruitTitle: "Pi 核心团队开发者招募", devRecruitDesc: "加入官方全球开发者团队，共同构建 Pi 生态系统。", devRecruitBtn: "查看并申请",
    cats: ['CCM', '音乐家', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "纪念金徽章", price: 1000, desc: "限量版实体徽章。", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "V23 节点主密钥", price: 5000, desc: "节点运行数字主密钥。", img: "/node-icon.png", seller: "System" }
    ]
  },
  JP: {
    rookie: "ルーキー", pioneer: "パイオニア", exchange: "01. Pi 決済＆貢献リワード", auth: "02. セキュリティ QR",
    creative: "03. ファン報酬システム", market: "04. グッズ市場", partnership: "05. パートナーシップ",
    invitation: "Web3 招待状", procedure: "参加ガイド", assets: "資産",
    activate: "スマートセキュリティ QR 生成", convert: "リワード受取", post: "投稿 (10 BEOM)",
    buy: "購入", register: "販売登録", submit: "提案を送信",
    downloadAOS: "Android", downloadiOS: "iPhone", buyBeom: "BEOM を購入",
    corpName: "会社名", email: "メールアドレス", contact: "連絡先", manager: "担当者", vision: "提案内容",
    itemName: "商品名", itemPrice: "価格 (BEOM)", itemDesc: "商品説明", itemImg: "画像 URL", bizPlaceholder: "会社名を入力してください",
    portalStatus: "統合ポータルアプリ: サブアプリの接続が進行中です。",
    piJoinDesc: "最大の Web3 ネットワークエコシステムに参加してください。",
    exchangeDesc: "Pi を BEOM に変換し、コア機能を探索します。",
    authDesc: "アドレスを公開せずに、QR で安全に支払いと認証を行います。",
    creativeDesc: "スピリットを共有し、クリエイターを支援して BEOM 報酬を獲得します。",
    fanRoomDesc: "※ 🚩 ファンルーム (500 BEOM): 90% の還元とガバナンス権。",
    marketDesc: "限定グッズを取引し、独自のアイテムを登録します。",
    partnershipDesc: "グローバルパートナーシップの機会とビジネス提案。",
    exList: [
      "1. エコシステム貢献リワード (決済・活動で BEOM 獲得)",
      "2. QR コード (アドレスを公开しない安全な支払い)",
      "3. ファン報酬 (活動による BEOM 獲得システム)",
      "4. グッズ市場 (限定アイテムの売買)",
      "5. パートナーシップ (B2B コラボレーションポータル)"
    ],
    steps: [
      { t: "インストール", d: "公式アプリをダウンロードします。", links: { AOS: "#", iOS: "#" } },
      { t: "方法", d: "電話番号で続行を選択します。" },
      { t: "国", d: "+82 を選択し、番号を入力します。" },
      { t: "パスワード", d: "大文字、小文字、数字を組み合わせます。" },
      { t: "プロフィール", d: "パスポートの名前と ID を入力します。" },
      { t: "招待コード", d: "下の招待コード欄をタップして確認し、入力してください。" },
      { t: "パスフレーズ", d: "24個の単語を紙に手書きして安全に保管してください。(デジタル保存禁止)", warning: true },
      { t: "マイニング", d: "24時間ごとに雷のアイコンをタップします。" }
    ],
    convertTitle: "エコシステム貢献リワード獲得", convertBtn: "出席リワードを受け取る (+50 BEOM)",
    walletType: "保護タイプ", personal: "個人", corporate: "企業", encodedQR: "エンコードQR",
    feedTitle: "タイトルまたはスピリットを共有", feedLink: "画像/動画リンク (URL)", feedDesc: "活動の詳細を説明してください", postBtn: "投稿 (10 BEOM)",
    marketBuyTab: "グッズ購入", marketSellTab: "販売登録", buyReqBtn: "購入リクエスト", sellDoneBtn: "登録完了",
    copyPrompt: "クリックしてコピー", copiedAlert: "招待コードがコピーされました！", inviteReveal: "招待コードを表示してコピー（タップ）", piLackAlert: "PI が不足しています", convDoneAlert: "変換が完了しました！",
    beomLackAlert: "BEOM が不足しています", regDoneAlert: "登録成功", propDoneAlert: "提案が送信されました。",
    devRecruitTitle: "Pi コアチーム開発者募集", devRecruitDesc: "Pi エコシステムを構築する公式グローバル開発者に参加してください。", devRecruitBtn: "確認して応募",
    cats: ['CCM', 'ミュージシャン', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "記念ゴールドバッジ", price: 1000, desc: "限定の物理バッジ。", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "V23 ノードマスターキー", price: 5000, desc: "ノード運用のデジタルマスターキー。", img: "/node-icon.png", seller: "System" }
    ]
  },
  ES: {
    rookie: "NOVATO", pioneer: "PIONERO", exchange: "01. PAGOS PI Y RECOMPENSAS BEOM", auth: "02. CÓDIGO QR SEGURO",
    creative: "03. RECOMPENSAS FANDOM", market: "04. MERCADO DE BIENES", partnership: "05. ASOCIACIÓN",
    invitation: "Invitación Web3", procedure: "Comenzar con Pi Network", assets: "ASSETS",
    activate: "GENERAR QR DE SEGURIDAD", convert: "OBTENER", post: "PUBLICAR (10 BEOM)",
    buy: "COMPRAR", register: "VENDER", submit: "ENVIAR PROPUESTA",
    downloadAOS: "Android", downloadiOS: "iPhone", buyBeom: "COMPRAR BEOM",
    corpName: "Empresa", email: "Correo", contact: "Contacto", manager: "Gerente", vision: "Detalles",
    itemName: "Nombre", itemPrice: "Precio (BEOM)", itemDesc: "Descripción", itemImg: "URL de Imagen", bizPlaceholder: "Ingrese Nombre de Empresa",
    portalStatus: "Portal Integrado: Conexión de sub-aplicaciones en curso.",
    piJoinDesc: "Únete al mayor ecosistema de red Web3.",
    exchangeDesc: "Gana recompensas BEOM por tu contribución y explora las utilidades principales.",
    authDesc: "Paga y autentica de forma segura mediante QR sin exponer la dirección.",
    creativeDesc: "Obtén recompensas BEOM compartiendo tu espíritu.",
    fanRoomDesc: "※ 🚩 Sala de Fans (500 BEOM): 90% de retorno y derechos de gobernanza.",
    marketDesc: "Comercializa bienes exclusivos y registra tus propios artículos.",
    partnershipDesc: "Oportunidades de asociación global y propuestas comerciales.",
    exList: [
      "1. Recompensas del Ecosistema (Gana puntos BEOM con pagos Pi y actividad)",
      "2. Código QR (Pago seguro sin exponer la dirección de la billetera)",
      "3. Recompensas (Sistema para ganar BEOM a través de actividades)",
      "4. Mercado (Venta y compra de artículos limitados)",
      "5. Asociación (Portal de colaboración B2B)"
    ],
    steps: [
      { t: "Instalar", d: "Descarga la aplicación oficial.", links: { AOS: "#", iOS: "#" } },
      { t: "Método", d: "Selecciona 'Continuar con número'." },
      { t: "País", d: "Selecciona +82 e ingresa tu número." },
      { t: "Contraseña", d: "Combina mayúsculas, minúsculas y números." },
      { t: "Perfil", d: "Ingresa nombre del pasaporte e ID." },
      { t: "Código", d: "Toca el cuadro del código abajo para verlo e ingresarlo." },
      { t: "Frase", d: "Escribe 24 palabras en papel y guárdalas. (NO digital por hackeos)", warning: true },
      { t: "Minería", d: "Toca el rayo cada 24h." }
    ],
    convertTitle: "Ecosystem Contribution Rewards",
    walletType: "Tipo de Billetera", personal: "Personal", corporate: "Corporativo", encodedQR: "QR Codificado",
    feedTitle: "Título o Espíritu", feedLink: "Enlace (URL)", feedDesc: "Describe tu actividad", postBtn: "PUBLICAR (10 BEOM)",
    marketBuyTab: "COMPRAR", marketSellTab: "VENDER", buyReqBtn: "SOLICITAR COMPRA", sellDoneBtn: "REGISTRO COMPLETO",
    copyPrompt: "Clic para Copiar", copiedAlert: "¡Código copiado!", inviteReveal: "Ver y copiar el código (toca aquí)", piLackAlert: "Falta PI", convDoneAlert: "¡Recompensa Recibida!",
    beomLackAlert: "Falta BEOM", regDoneAlert: "Registro Exitoso", propDoneAlert: "Propuesta Enviada.",
    devRecruitTitle: "Reclutamiento del Core Team", devRecruitDesc: "Únete a los desarrolladores oficiales de Pi.", devRecruitBtn: "REVISAR Y APLICAR",
    cats: ['CCM', 'MÚSICA', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "Insignia de Oro", price: 1000, desc: "Insignia física limitada.", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "Llave de Nodo V23", price: 5000, desc: "Llave maestra digital.", img: "/node-icon.png", seller: "System" }
    ]
  },
  VN: {
    rookie: "NGƯỜI MỚI", pioneer: "TIÊN PHONG", exchange: "01. THANH TOÁN PI & PHẦN THƯỞNG BEOM", auth: "02. MÃ QR BẢO MẬT",
    creative: "03. PHẦN THƯỞNG FANDOM", market: "04. THỊ TRƯỜNG", partnership: "05. ĐỐI TÁC",
    invitation: "Lời mời Web3", procedure: "Hướng dẫn Tham gia", assets: "TÀI SẢN",
    activate: "TẠO MÃ QR BẢO MẬT", convert: "NHẬN THƯỞNG", post: "ĐĂNG BÀI (10 BEOM)",
    buy: "MUA", register: "BÁN", submit: "GỬI ĐỀ XUẤT",
    downloadAOS: "Tải Android", downloadiOS: "Tải iPhone", buyBeom: "MUA BEOM",
    corpName: "Công ty", email: "Email", contact: "Liên hệ", manager: "Người quản lý", vision: "Chi tiết",
    itemName: "Tên sản phẩm", itemPrice: "Giá (BEOM)", itemDesc: "Mô tả", itemImg: "URL hình ảnh", bizPlaceholder: "Nhập tên công ty",
    portalStatus: "Cổng thông tin tích hợp: Đang kết nối các ứng dụng thành viên.",
    piJoinDesc: "Tham gia hệ sinh thái Web3 lớn nhất.",
    exchangeDesc: "Tích lũy điểm thưởng BEOM qua đóng góp hệ sinh thái và khám phá các tiện ích.",
    authDesc: "Thanh toán an toàn qua QR không lộ địa chỉ ví.",
    creativeDesc: "Nhận BEOM bằng cách chia sẻ tinh thần.",
    fanRoomDesc: "※ 🚩 Phòng Fan (500 BEOM): 90% Lợi nhuận và Quyền quản trị.",
    marketDesc: "Giao dịch hàng hóa độc quyền và đăng ký bán.",
    partnershipDesc: "Cơ hội hợp tác toàn cầu và đề xuất kinh doanh.",
    exList: [
      "1. Phần thưởng Hệ sinh thái (Nhận điểm BEOM qua thanh toán Pi và hoạt động)",
      "2. Mã QR (Thanh toán an toàn không lộ ví)",
      "3. Phần thưởng (Hệ thống kiếm BEOM qua hoạt động)",
      "4. Thị trường (Mua bán các vật phẩm giới hạn)",
      "5. Đối tác (Cổng hợp tác B2B)"
    ],
    steps: [
      { t: "Cài đặt", d: "Tải ứng dụng chính thức.", links: { AOS: "#", iOS: "#" } },
      { t: "Phương thức", d: "Chọn 'Tiếp tục với số điện thoại'." },
      { t: "Quốc gia", d: "Chọn +82 và nhập số điện thoại." },
      { t: "Mật khẩu", d: "Kết hợp chữ Hoa, thường và Số." },
      { t: "Hồ sơ", d: "Nhập tên hộ chiếu và ID." },
      { t: "Mã mời", d: "Nhấn vào ô mã mời bên dưới để xem và nhập." },
      { t: "Cụm mật khẩu", d: "Ghi 24 từ ra giấy. (Không lưu kỹ thuật số để tránh bị hack)", warning: true },
      { t: "Khai thác", d: "Nhấn nút tia sét mỗi 24 giờ." }
    ],
    convertTitle: "Ecosystem Contribution Rewards",
    walletType: "Loại bảo vệ ví", personal: "Cá nhân", corporate: "Doanh nghiệp", encodedQR: "QR Mã hóa",
    feedTitle: "Tiêu đề", feedLink: "Liên kết Ảnh/Video", feedDesc: "Mô tả hoạt động của bạn", postBtn: "ĐĂNG BÀI (10 BEOM)",
    marketBuyTab: "MUA HÀNG", marketSellTab: "BÁN HÀNG", buyReqBtn: "YÊU CẦU MUA", sellDoneBtn: "HOÀN TẤT ĐĂNG KÝ",
    copyPrompt: "Nhấn để sao chép", copiedAlert: "Đã sao chép mã mời!", inviteReveal: "Xem và sao chép mã mời (nhấn)", piLackAlert: "Không đủ PI", convDoneAlert: "Chuyển đổi thành công!",
    beomLackAlert: "Không đủ BEOM", regDoneAlert: "Đăng ký thành công", propDoneAlert: "Đã gửi đề xuất.",
    devRecruitTitle: "Tuyển dụng Nhà phát triển Pi", devRecruitDesc: "Tham gia nhóm phát triển xây dựng hệ sinh thái Pi.", devRecruitBtn: "KIỂM TRA & ỨNG TUYỂN",
    cats: ['CCM', 'NHẠC SĨ', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "Huy hiệu vàng", price: 1000, desc: "Huy hiệu vật lý giới hạn.", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "Khóa Node V23", price: 5000, desc: "Khóa chủ kỹ thuật số Node.", img: "/node-icon.png", seller: "System" }
    ]
  },
  FR: {
    rookie: "NOVICE", pioneer: "PIONNIER", exchange: "01. PAIEMENT PI & RÉCOMPENSES BEOM", auth: "02. QR SÉCURISÉ",
    creative: "03. RÉCOMPENSES", market: "04. MARCHÉ", partnership: "05. PARTENARIAT",
    invitation: "Invitation Web3", procedure: "Guide d'inscription", assets: "ACTIFS",
    activate: "GÉNÉRER QR SÉCURISÉ", convert: "RÉCUPÉRER", post: "PUBLIER (10 BEOM)",
    buy: "ACHETER", register: "VENDRE", submit: "SOUMETTRE",
    downloadAOS: "Télécharger Android", downloadiOS: "Télécharger iPhone", buyBeom: "ACHETER BEOM",
    corpName: "Entreprise", email: "E-mail", contact: "Contact", manager: "Gérant", vision: "Détails",
    itemName: "Nom", itemPrice: "Prix (BEOM)", itemDesc: "Description", itemImg: "URL de l'image", bizPlaceholder: "Nom de l'entreprise",
    portalStatus: "Portail intégré: Connexion en cours.",
    piJoinDesc: "Rejoignez le plus grand écosystème Web3.",
    exchangeDesc: "Gagnez des récompenses BEOM et explorez les utilités principales de l'écosystème.",
    authDesc: "Payez en toute sécurité via QR sans exposer l'adresse.",
    creativeDesc: "Obtenez des récompenses BEOM en partageant votre esprit.",
    fanRoomDesc: "※ 🚩 Fan Room (500 BEOM): 90% de retour et droits de gouvernance.",
    marketDesc: "Échangez des biens exclusifs et enregistrez les vôtres.",
    partnershipDesc: "Opportunités de partenariat mondial.",
    exList: [
      "1. Récompenses d'Écosystème (Gagnez des points BEOM via paiement Pi et activité)",
      "2. QR Code (Paiement sécurisé)",
      "3. Récompenses (Gagnez des BEOM)",
      "4. Marché (Achetez et vendez)",
      "5. Partenariat (Portail B2B)"
    ],
    steps: [
      { t: "Installer", d: "Téléchargez l'application officielle.", links: { AOS: "#", iOS: "#" } },
      { t: "Méthode", d: "Sélectionnez 'Continuer avec le numéro'." },
      { t: "Pays", d: "Sélectionnez +82 et entrez votre numéro." },
      { t: "Mot de passe", d: "Combinez majuscules, minuscules et chiffres." },
      { t: "Profil", d: "Entrez votre nom et ID." },
      { t: "Code d'invitation", d: "Touchez la case du code ci-dessous pour l'afficher et le saisir." },
      { t: "Phrase secrète", d: "Écrivez 24 mots sur papier. (Ne pas sauvegarder numériquement)", warning: true },
      { t: "Minage", d: "Appuyez sur l'éclair toutes les 24h." }
    ],
    convertTitle: "BEOM Rewards (+50 BEOM)", convertBtn: "RÉCUPÉRER RÉCOMPENSE (+50 BEOM)",
    walletType: "Type de portefeuille", personal: "Personnel", corporate: "Entreprise", encodedQR: "QR Encodé",
    feedTitle: "Titre", feedLink: "Lien Image/Vidéo", feedDesc: "Décrivez votre activité", postBtn: "PUBLIER (10 BEOM)",
    marketBuyTab: "ACHETER", marketSellTab: "VENDRE", buyReqBtn: "DEMANDER", sellDoneBtn: "TERMINÉ",
    copyPrompt: "Cliquez pour copier", copiedAlert: "Code copié !", inviteReveal: "Afficher et copier le code (toucher)", piLackAlert: "PI insuffisant", convDoneAlert: "Récompense reçue !",
    beomLackAlert: "BEOM insuffisant", regDoneAlert: "Succès", propDoneAlert: "Proposition soumise.",
    devRecruitTitle: "Recrutement Core Team Pi", devRecruitDesc: "Rejoignez les développeurs mondiaux officiels.", devRecruitBtn: "POSTULER",
    cats: ['CCM', 'MUSICIEN', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "Badge en or", price: 1000, desc: "Badge physique limité.", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "Clé de nœud V23", price: 5000, desc: "Clé numérique maître.", img: "/node-icon.png", seller: "System" }
    ]
  },
  PT: {
    rookie: "NOVATO", pioneer: "PIONEIRO", exchange: "01. PAGAMENTO PI & RECOMPENSAS BEOM", auth: "02. QR SEGURO",
    creative: "03. RECOMPENSAS", market: "04. MERCADO", partnership: "05. PARCERIA",
    invitation: "Convite Web3", procedure: "Guia de Entrada", assets: "ATIVOS",
    activate: "GERAR QR SEGURO", convert: "RECEBER", post: "PUBLICAR (10 BEOM)",
    buy: "COMPRAR", register: "VENDER", submit: "ENVIAR",
    downloadAOS: "Baixar Android", downloadiOS: "Baixar iPhone", buyBeom: "COMPRAR BEOM",
    corpName: "Empresa", email: "E-mail", contact: "Contato", manager: "Gerente", vision: "Detalhes",
    itemName: "Nome", itemPrice: "Preço (BEOM)", itemDesc: "Descrição", itemImg: "URL da Imagem", bizPlaceholder: "Nome da Empresa",
    portalStatus: "Portal Integrado: Conexão em andamento.",
    piJoinDesc: "Junte-se ao maior ecossistema Web3.",
    exchangeDesc: "Ganhe recompensas BEOM por sua contribuição e explore as utilidades principais.",
    authDesc: "Pague com segurança via QR.",
    creativeDesc: "Obtenha recompensas BEOM.",
    fanRoomDesc: "※ 🚩 Sala de Fãs (500 BEOM): 90% de retorno.",
    marketDesc: "Troque bens exclusivos.",
    partnershipDesc: "Oportunidades de parceria global.",
    exList: [
      "1. Conversão BEOM (BEOM Rewards (+50 BEOM))",
      "2. Código QR (Pagamento seguro)",
      "3. Recomputas (Ganhe BEOM)",
      "4. Mercado (Compre e venda)",
      "5. Parceria (Portal B2B)"
    ],
    steps: [
      { t: "Instalar", d: "Baixe o aplicativo oficial.", links: { AOS: "#", iOS: "#" } },
      { t: "Método", d: "Selecione 'Continuar com número'." },
      { t: "País", d: "Selecione +82 e insira seu número." },
      { t: "Senha", d: "Combine maiúsculas, minúsculas e números." },
      { t: "Perfil", d: "Insira nome e ID." },
      { t: "Código", d: "Insira o código do quadro abaixo para entrar." },
      { t: "Frase secreta", d: "Escreva 24 palavras no papel.", warning: true },
      { t: "Mineração", d: "Toque no raio a cada 24h." }
    ],
    convertTitle: "BEOM Rewards (+50 BEOM)", convertBtn: "RECEBER RECOMPENSA (+50 BEOM)",
    walletType: "Tipo de Carteira", personal: "Pessoal", corporate: "Corporativo", encodedQR: "QR Codificado",
    feedTitle: "Título", feedLink: "Link da Imagem", feedDesc: "Descreva sua atividade", postBtn: "PUBLICAR",
    marketBuyTab: "COMPRAR", marketSellTab: "VENDER", buyReqBtn: "SOLICITAR", sellDoneBtn: "CONCLUÍDO",
    copyPrompt: "Clique para copiar", copiedAlert: "Copiado!", inviteReveal: "Ver e copiar o código (toque)", piLackAlert: "PI insuficiente", convDoneAlert: "Recompensa recebida!",
    beomLackAlert: "BEOM insuficiente", regDoneAlert: "Sucesso", propDoneAlert: "Proposta enviada.",
    devRecruitTitle: "Recrutamento Core Team", devRecruitDesc: "Junte-se aos desenvolvedores globais.", devRecruitBtn: "CANDIDATAR-SE",
    cats: ['CCM', 'MÚSICO', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "Emblema de Ouro", price: 1000, desc: "Emblema físico limitado.", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "Chave Node V23", price: 5000, desc: "Chave digital mestre.", img: "/node-icon.png", seller: "System" }
    ]
  },
  RU: {
    rookie: "НОВИЧОК", pioneer: "ПИОНЕР", exchange: "01. ОПЛАТА PI И НАГРАДЫ BEOM", auth: "02. БЕЗОПАСНЫЙ QR",
    creative: "03. НАГРАДЫ FANDOM", market: "04. РЫНОК", partnership: "05. ПАРТНЕРСТВО",
    invitation: "Приглашение Web3", procedure: "Гид по входу", assets: "АКТИВЫ",
    activate: "СОЗДАТЬ БЕЗОПАСНЫЙ QR", convert: "ПОЛУЧИТЬ", post: "ОПУБЛИКОВАТЬ",
    buy: "КУПИТЬ", register: "ПРОДАТЬ", submit: "ОТПРАВИТЬ",
    downloadAOS: "Скачать Android", downloadiOS: "Скачать iPhone", buyBeom: "КУПИТЬ BEOM",
    corpName: "Компания", email: "E-mail", contact: "Контакт", manager: "Менеджер", vision: "Детали",
    itemName: "Название", itemPrice: "Цена (BEOM)", itemDesc: "Описание", itemImg: "URL картинки", bizPlaceholder: "Название компании",
    portalStatus: "Интегрированный портал: подключение.",
    piJoinDesc: "Присоединяйтесь к крупнейшей экосистеме Web3.",
    exchangeDesc: "Получайте награды BEOM за вклад в экосистему и используйте ключевые сервисы.",
    authDesc: "Безопасная оплата через QR.",
    creativeDesc: "Получайте награды BEOM.",
    fanRoomDesc: "※ 🚩 Fan Room (500 BEOM): 90% возврата.",
    marketDesc: "Торгуйте эксклюзивными товарами.",
    partnershipDesc: "Глобальное партнерство.",
    exList: [
      "1. Награды экосистемы (Получайте баллы BEOM за платежи Pi и активность)",
      "2. QR-код (Безопасная оплата)",
      "3. Награды (Заработайте BEOM)",
      "4. Рынок (Покупка и продажа)",
      "5. Партнерство (B2B портал)"
    ],
    steps: [
      { t: "Установка", d: "Скачайте приложение.", links: { AOS: "#", iOS: "#" } },
      { t: "Метод", d: "Выберите 'Продолжить с номером'." },
      { t: "Страна", d: "Выберите +82 и введите номер." },
      { t: "Пароль", d: "Смешайте буквы и цифры." },
      { t: "Профиль", d: "Введите имя и ID." },
      { t: "Код", d: "Нажмите на поле кода ниже, чтобы увидеть его и ввести." },
      { t: "Фраза", d: "Запишите 24 слова на бумаге.", warning: true },
      { t: "Майнинг", d: "Нажимайте молнию каждые 24ч." }
    ],
    convertTitle: "Ecosystem Contribution Rewards",
    walletType: "Тип кошелька", personal: "Личный", corporate: "Корпоративный", encodedQR: "Закодированный QR",
    feedTitle: "Заголовок", feedLink: "Ссылка URL", feedDesc: "Описание активности", postBtn: "ОПУБЛИКОВАТЬ",
    marketBuyTab: "КУПИТЬ", marketSellTab: "ПРОДАТЬ", buyReqBtn: "ЗАПРОСИТЬ", sellDoneBtn: "ГОТОВО",
    copyPrompt: "Копировать", copiedAlert: "Скопировано!", inviteReveal: "Показать и скопировать код (нажмите)", piLackAlert: "Недостаточно PI", convDoneAlert: "Готово!",
    beomLackAlert: "Недостаточно BEOM", regDoneAlert: "Успех", propDoneAlert: "Отправлено.",
    devRecruitTitle: "Набор Core Team", devRecruitDesc: "Присоединяйтесь к разработчикам.", devRecruitBtn: "ПОДАТЬ ЗАЯВКУ",
    cats: ['CCM', 'МУЗЫКАНТ', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "Золотой значок", price: 1000, desc: "Лимитированный значок.", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "Ключ Node V23", price: 5000, desc: "Цифровой мастер-ключ.", img: "/node-icon.png", seller: "System" }
    ]
  },
  ID: {
    rookie: "PEMULA", pioneer: "PELOPOR", exchange: "01. PEMBAYARAN PI & HADIAH BEOM", auth: "02. QR AMAN",
    creative: "03. HADIAH FANDOM", market: "04. PASAR", partnership: "05. KEMITRAAN",
    invitation: "Undangan Web3", procedure: "Panduan Bergabung", assets: "ASET",
    activate: "BUAT QR AMAN", convert: "KLAIM", post: "POSTING (10 BEOM)",
    buy: "BELI", register: "JUAL", submit: "KIRIM",
    downloadAOS: "Unduh Android", downloadiOS: "Unduh iPhone", buyBeom: "BELI BEOM",
    corpName: "Perusahaan", email: "Email", contact: "Kontak", manager: "Manajer", vision: "Detail",
    itemName: "Nama", itemPrice: "Harga (BEOM)", itemDesc: "Deskripsi", itemImg: "URL Gambar", bizPlaceholder: "Nama Perusahaan",
    portalStatus: "Portal Terintegrasi: Koneksi sedang berlangsung.",
    piJoinDesc: "Bergabunglah dengan ekosistem Web3 terbesar.",
    exchangeDesc: "Kumpulkan hadiah kontribusi BEOM dan jelajahi utilitas utama ekosistem.",
    authDesc: "Bayar aman via QR.",
    creativeDesc: "Dapatkan hadiah BEOM.",
    fanRoomDesc: "※ 🚩 Ruang Penggemar (500 BEOM): 90% pengembalian.",
    marketDesc: "Perdagangkan barang eksklusif.",
    partnershipDesc: "Peluang kemitraan global.",
    exList: [
      "1. Konversi BEOM (BEOM Rewards (+50 BEOM))",
      "2. Kode QR (Pembayaran aman)",
      "3. Hadiah (Dapatkan BEOM)",
      "4. Pasar (Beli dan jual)",
      "5. Kemitraan (Portal B2B)"
    ],
    steps: [
      { t: "Instal", d: "Unduh aplikasi resmi.", links: { AOS: "#", iOS: "#" } },
      { t: "Metode", d: "Pilih 'Lanjutkan dengan nomor'." },
      { t: "Negara", d: "Pilih +82 dan masukkan nomor." },
      { t: "Sandi", d: "Gabungkan huruf dan angka." },
      { t: "Profil", d: "Masukkan nama dan ID." },
      { t: "Kode", d: "Ketuk kotak kode di bawah untuk melihat dan memasukkannya." },
      { t: "Frasa", d: "Tulis 24 kata di kertas.", warning: true },
      { t: "Menambang", d: "Ketuk petir setiap 24 jam." }
    ],
    convertTitle: "BEOM Rewards (+50 BEOM)", convertBtn: "KLAIM HADIAH (+50 BEOM)",
    walletType: "Jenis Dompet", personal: "Pribadi", corporate: "Perusahaan", encodedQR: "QR Enkode",
    feedTitle: "Judul", feedLink: "Tautan URL", feedDesc: "Deskripsikan aktivitas", postBtn: "POSTING",
    marketBuyTab: "BELI", marketSellTab: "JUAL", buyReqBtn: "MINTA", sellDoneBtn: "SELESAI",
    copyPrompt: "Klik untuk menyalin", copiedAlert: "Tersalin!", inviteReveal: "Lihat & salin kode (ketuk)", piLackAlert: "PI tidak cukup", convDoneAlert: "Konversi selesai!",
    beomLackAlert: "BEOM tidak cukup", regDoneAlert: "Sukses", propDoneAlert: "Proposal terkirim.",
    devRecruitTitle: "Rekrutmen Core Team", devRecruitDesc: "Bergabunglah dengan pengembang.", devRecruitBtn: "DAFTAR",
    cats: ['CCM', 'MUSISI', 'MUSIC', 'TECH', 'ART', 'FOOD', 'TRAVEL', 'GAME', 'NEWS', 'MOVIE'],
    fans: ['KEDHEON', 'HUNTRIX', 'BTS'],
    goodsMock: [
      { id: 1, name: "Lencana Emas", price: 1000, desc: "Lencana fisik terbatas.", img: "/beom-token.png", seller: "System" },
      { id: 2, name: "Kunci Node V23", price: 5000, desc: "Kunci master digital.", img: "/node-icon.png", seller: "System" }
    ]
  }
};

// Keep <html lang> aligned with the language the visitor actually picked, and shield brand
// names / proper nouns from browser auto-translation (Chrome would turn "ohsangjo" into a
// surname). Words matching these tokens are rendered inside translate="no" spans.
const LANG_TAG: Record<Lang, string> = {
  KR: 'ko', EN: 'en', CN: 'zh', JP: 'ja', ES: 'es', VN: 'vi', FR: 'fr', PT: 'pt', RU: 'ru', ID: 'id'
};
const NO_TRANSLATE_TOKENS = ['ohsangjo', 'KEDHEON', 'CIVIL', 'FACTFILTER', 'NEXUS', 'VENDOR', 'BEOM', 'KYC', 'PI', 'Pi', 'ROOKIE', 'PIONEER'];
const NO_TRANSLATE_RE = new RegExp(`\\b(${NO_TRANSLATE_TOKENS.join('|')})\\b`, 'g');

const SafeText = ({ text }: { text: string }) => (
  <>
    {(text || '').split(NO_TRANSLATE_RE).map((part, i) =>
      NO_TRANSLATE_TOKENS.includes(part) ? (
        <span key={i} translate="no" className="notranslate">{part}</span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    )}
  </>
);

const SectionHeader = ({ title, desc }: { title: string; desc: string; }) => (
  <div className="w-full border-t-2 border-[#dc2626] pt-2 mb-2 text-left font-black">
    <h2 className="text-black text-lg md:text-xl uppercase italic border-l-[8px] border-black pl-3 tracking-tighter leading-none">
       {title}
    </h2>
    <p className="text-gray-400 text-xs md:text-sm font-bold pl-7 italic leading-none mt-1">{desc}</p>
  </div>
);

export default function KedheonDesignSystemFinal() {
  const [hasMounted, setHasMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('KR');
  const [tab, setTab] = useState<'ROOKIE' | 'PIONEER'>('ROOKIE');
  const [beomToken, setBeomToken] = useState(7891.88);
  const [piBalance, setPiBalance] = useState(124.55);
  const [hubTab, setHubTab] = useState<'HUB' | 'SPIRIT'>('HUB');
  const [category, setCategory] = useState('CCM');
  const [feed, setFeed] = useState({ title: '', link: '', desc: '' });
  const [qrState, setQrState] = useState({ type: 'PERSONAL', biz: '', active: false });
  const [marketMode, setMarketMode] = useState<'BUY' | 'SELL'>('BUY');
  const [sellItem, setSellItem] = useState({ name: '', price: '', desc: '', img: '' });
  const [userGoods, setUserGoods] = useState<GoodsItem[]>([]);
  const [partner, setPartner] = useState({ corp: '', email: '', contact: '', manager: '', msg: '' });
  const [showInviteCode, setShowInviteCode] = useState(false);

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    document.documentElement.lang = LANG_TAG[lang] || 'ko';
  }, [lang]);

  const L = DICT[lang];
  const displayGoods = [...userGoods, ...L.goodsMock];

  const handleDownload = useCallback((url: string | undefined) => {
    if (typeof window !== 'undefined' && url) window.open(url, '_blank');
  }, []);

  const handleCopy = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(PI_INVITE_CODE);
      alert(L.copiedAlert);
    }
  }, [L.copiedAlert]);

  const handleFinanceConversion = useCallback(() => {
    // Daily attendance & contribution reward (+50 BEOM)
    setBeomToken(p => p + 50);
    alert("출석 및 생태계 기여 리워드 +50 BEOM 적립 완료!");
  }, []);

  if (!hasMounted) return <div className="bg-white min-h-screen" />;

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-24 font-black selection:bg-red-50 overflow-x-hidden">
      
      <nav className="w-full max-w-5xl flex justify-between items-center px-4 py-2 sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-black/10 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <img src="/kedheon-character.png" className="w-8 h-8 md:w-11 md:h-11 rounded-lg border-2 border-black" alt="K" />
          <div className="text-left leading-tight font-black">
            <h1 className="notranslate text-black text-sm md:text-base italic uppercase leading-none" translate="no">Kedheon</h1>
            <span className="text-gray-400 text-[11px] font-mono tracking-widest uppercase">MASTER V271.0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-2">
          <PiBadge en={lang !== 'KR'} />
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="appearance-none bg-gray-100 border border-gray-200 text-black text-[11px] md:text-xs font-black rounded-lg pl-2 pr-5 py-1 outline-none cursor-pointer shadow-sm focus:border-black transition-colors"
            >
              <option value="KR">🇰🇷 KR</option>
              <option value="EN">🇺🇸 EN</option>
              <option value="CN">🇨🇳 CN</option>
              <option value="JP">🇯🇵 JP</option>
              <option value="ES">🇪🇸 ES</option>
              <option value="VN">🇻🇳 VN</option>
              <option value="FR">🇫🇷 FR</option>
              <option value="PT">🇵🇹 PT</option>
              <option value="RU">🇷🇺 RU</option>
              <option value="ID">🇮🇩 ID</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-400">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          <button onClick={() => setTab('ROOKIE')} className={`px-2 py-1 rounded-lg text-xs md:text-sm font-black border transition-all whitespace-nowrap ${tab === 'ROOKIE' ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'text-gray-500 border-black/10 hover:text-black'}`}>{L.rookie}</button>
          <button onClick={() => setTab('PIONEER')} className={`px-2 py-1 rounded-lg text-xs md:text-sm font-black border transition-all whitespace-nowrap ${tab === 'PIONEER' ? 'bg-black text-white border-black' : 'text-gray-500 border-black/10 hover:text-black'}`}>{L.pioneer}</button>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-3">
        {tab === 'ROOKIE' ? (
          <div className="flex flex-col gap-3 animate-in fade-in duration-500 font-black">
            <div className="flex flex-col items-center text-center gap-3 py-6 bg-gray-50 rounded-2xl border border-black/5 relative shadow-inner overflow-hidden font-black">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]"></div>
              <img src="/kedheon-character.png" className="w-32 h-32 md:w-56 md:h-56 object-contain drop-shadow-xl" alt="K" />
              <div className="px-4 leading-none">
                <h1 className="text-black text-2xl md:text-3xl uppercase tracking-tighter mb-1">{L.procedure}</h1>
                <p className="text-[#dc2626] text-xs md:text-sm font-bold tracking-tight">{L.piJoinDesc}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {L.steps.map((s, i) => (
                <div key={i} className={`p-3 bg-white rounded-xl border flex flex-col gap-2 transition-all ${s.warning ? 'border-[#dc2626] bg-red-50/5 shadow-sm' : 'border-black/5 opacity-90'}`}>
                  <div className="flex items-center gap-3 text-left">
                    <span className={`text-3xl md:text-4xl font-black italic ${s.warning ? 'text-[#dc2626]' : 'text-black opacity-5'}`}>0{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-black text-sm md:text-base font-black uppercase italic leading-none"><SafeText text={s.t} /></h3>
                      <p className={`text-xs md:text-sm font-bold leading-tight mt-1 ${s.warning ? 'text-[#dc2626]' : 'text-gray-600'}`}><SafeText text={s.d} /></p>
                    </div>
                  </div>
                  {s.links && (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleDownload(s.links?.AOS)} className="bg-black text-white py-1.5 rounded-lg text-[11px] font-black uppercase hover:bg-[#dc2626] transition-all">Android</button>
                      <button onClick={() => handleDownload(s.links?.iOS)} className="bg-black text-white py-1.5 rounded-lg text-[11px] font-black uppercase hover:bg-[#dc2626] transition-all">iPhone</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="w-full bg-black border-[3px] border-[#dc2626] rounded-2xl p-4 md:p-6 text-left shadow-2xl flex flex-col md:flex-row items-center gap-4 relative overflow-hidden mt-2">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#dc2626] rotate-45 opacity-20"></div>
                <div className="flex-1 z-10">
                    <h3 className="text-white text-sm md:text-base font-black italic uppercase border-l-4 border-[#dc2626] pl-2 leading-none">
                      {L.devRecruitTitle}
                    </h3>
                    <p className="text-gray-400 text-[11px] md:text-xs mt-2 font-bold leading-tight">
                      {L.devRecruitDesc}
                    </p>
                </div>
                <button onClick={() => handleDownload("https://minepi.com/developers/")} className="w-full md:w-auto bg-[#dc2626] text-white px-5 py-3 rounded-xl text-[11px] md:text-xs font-black uppercase whitespace-nowrap active:scale-95 shadow-md hover:bg-white hover:text-black transition-all z-10 border border-transparent hover:border-black">
                    {L.devRecruitBtn}
                </button>
            </div>

            <div className="p-6 bg-black text-white rounded-2xl text-center shadow-xl border-2 border-[#dc2626] cursor-pointer active:scale-95 mt-2" onClick={() => { setShowInviteCode(true); handleCopy(); }}>
               <p className="text-[11px] italic text-gray-500 mb-1">{showInviteCode ? L.copyPrompt : L.inviteReveal}</p>
               <div translate="no" className="notranslate text-white text-3xl md:text-5xl tracking-widest font-black leading-none italic">{showInviteCode ? PI_INVITE_CODE : '••••••••'}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-1 animate-in slide-in-from-bottom-5 duration-700 font-black text-left">
            
            <div className="w-full bg-white p-5 rounded-2xl border-2 border-black shadow-lg flex flex-col justify-center relative overflow-hidden group">
                <h3 className="text-gray-400 text-[11px] uppercase tracking-widest font-black mb-2">{L.assets}</h3>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:scale-105">
                   <img src="/beom-token.png" className="w-24 h-24 md:w-44 md:h-48 object-contain drop-shadow-2xl" alt="Beom" />
                </div>
                <div className="relative z-10 leading-none">
                    <p className="text-black text-2xl md:text-5xl tracking-tighter font-black">
                      {Math.floor(beomToken).toLocaleString()}
                      <span className="text-lg opacity-20">.{beomToken.toFixed(2).split('.')[1]}</span> 
                      <span translate="no" className="notranslate ml-2 text-2xl md:text-3xl italic uppercase text-[#dc2626]">BEOM</span>
                    </p>
                    <p className="text-gray-400 text-xs md:text-sm font-black italic mt-1">≈ {piBalance.toLocaleString()} <span translate="no" className="notranslate">PI</span></p>
                    <div className="flex items-center gap-2 mt-3 font-black">
                      <div className="bg-black text-white px-2 py-0.5 rounded text-[11px] md:text-xs font-mono shadow-sm">NODE: 19.02 SCORE</div>
                      <div className="bg-[#dc2626] text-white px-2 py-0.5 rounded text-[11px] md:text-xs font-mono italic shadow-sm tracking-tighter">RT: 15,080</div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-gray-900 py-1.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-inner">
               <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
               <p className="text-white text-[11px] md:text-xs font-black leading-none uppercase tracking-tight">
                 {L.portalStatus}
               </p>
            </div>

            <SectionHeader title={L.exchange} desc={L.exchangeDesc} />
            <div className="bg-white p-4 md:p-5 rounded-2xl border-2 border-black space-y-4 shadow-sm font-black text-left">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 border-r border-gray-100 pr-2">
                     {L.exList.map((txt, idx) => <p key={idx} className="text-[11px] md:text-xs font-black text-gray-800 leading-tight border-b border-gray-50 pb-1">▶ {txt}</p>)}
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl text-center font-black">
                     <p className="text-black text-sm md:text-base font-black mb-2 italic">{L.convertTitle}</p>
                     <button onClick={handleFinanceConversion} className="w-full bg-[#dc2626] text-white py-2 rounded-lg text-xs font-black hover:bg-black transition-all shadow-md">{L.convertBtn}</button>
                  </div>
               </div>
            </div>

            <SectionHeader title={L.auth} desc={L.authDesc} />
            <div className="bg-gray-50 p-4 md:p-6 rounded-2xl border border-black/5 flex flex-col md:flex-row items-center gap-5 shadow-inner font-black text-left">
               <div className={`bg-white border-2 rounded-xl flex flex-col items-center justify-center shadow-lg w-40 h-40 md:w-56 md:h-56 transition-all ${qrState.active ? 'border-[#dc2626]' : 'opacity-10 grayscale blur-sm'}`}>
                  {qrState.active ? (
                    <>
                      <img src={qrState.type === 'PERSONAL' ? "/qr-personal.png" : "/qr-business.png"} className="w-full h-full p-3 object-contain" alt="QR" />
                      <p className="text-[11px] font-black bg-gray-100 px-2 py-0.5 rounded-full mb-1 uppercase text-center">{qrState.biz || (qrState.type === 'PERSONAL' ? L.personal : L.corporate)}</p>
                    </>
                  ) : <p className="text-black text-xs md:text-sm font-black italic uppercase animate-pulse">{L.encodedQR}</p>}
               </div>
               <div className="flex-1 w-full space-y-3 font-black">
                  <div className="bg-white p-4 rounded-xl border border-black/10">
                     <p className="text-black text-[11px] md:text-xs font-black italic uppercase mb-3 border-l-2 border-black pl-2">{L.walletType}</p>
                     <div className="flex gap-2 mb-3">
                        <button onClick={() => setQrState({...qrState, type:'PERSONAL'})} className={`flex-1 py-1.5 rounded-md text-[11px] font-black border transition-all ${qrState.type === 'PERSONAL' ? 'bg-black text-white border-black shadow-md' : 'text-gray-300 border-gray-100'}`}>{L.personal}</button>
                        <button onClick={() => setQrState({...qrState, type:'BUSINESS'})} className={`flex-1 py-1.5 rounded-md text-[11px] font-black border transition-all ${qrState.type === 'BUSINESS' ? 'bg-black text-white border-black shadow-md' : 'text-gray-300 border-gray-100'}`}>{L.corporate}</button>
                     </div>
                     {qrState.type === 'BUSINESS' && (
                        <input value={qrState.biz} onChange={e=>setQrState({...qrState, biz:e.target.value.toUpperCase()})} placeholder={L.bizPlaceholder} className="w-full bg-gray-50 border border-black/5 p-2 rounded-lg text-[11px] font-black outline-none focus:border-black mb-2" />
                     )}
                  </div>
                  <button onClick={() => {if(beomToken<50) return alert(L.beomLackAlert); setBeomToken(p=>p-50); setQrState({...qrState, active:true});}} className="w-full bg-black text-white py-3 rounded-lg text-xs font-black hover:bg-[#dc2626] transition-all shadow-md">{L.activate}</button>
               </div>
            </div>

            <SectionHeader title={L.creative} desc={L.creativeDesc} />
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-black/10 space-y-4 shadow-sm font-black text-left">
              <div className="flex gap-6 border-b border-gray-100 pb-1.5 font-black">
                <button onClick={() => setHubTab('HUB')} className={`text-sm md:text-base font-black italic uppercase ${hubTab === 'HUB' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>HUB</button>
                <button onClick={() => setHubTab('SPIRIT')} className={`text-sm md:text-base font-black italic uppercase ${hubTab === 'SPIRIT' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>FAN SPIRIT</button>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {L.cats.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1 rounded-full text-xs md:text-sm font-black italic border transition-all whitespace-nowrap ${category === c ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-400'}`}>{c}</button>)}
              </div>
              <div className="flex gap-2 flex-wrap">{L.fans.map(f => <button key={f} translate="no" className="notranslate px-3 py-1 bg-white border border-gray-100 rounded-full text-xs md:text-sm font-black text-red-600 shadow-sm">🚩 {f}</button>)}</div>
              <div className="space-y-2">
                <input value={feed.title} onChange={e => setFeed({...feed, title: e.target.value})} placeholder={L.feedTitle} className="w-full bg-gray-50 border border-black/5 p-3 rounded-xl text-xs md:text-sm font-black outline-none" />
                <input value={feed.link} onChange={e => setFeed({...feed, link: e.target.value})} placeholder={L.feedLink} className="w-full bg-gray-50 border border-black/5 p-3 rounded-xl text-xs md:text-sm font-black outline-none text-red-400 placeholder-red-200" />
                <textarea value={feed.desc} onChange={e => setFeed({...feed, desc: e.target.value})} placeholder={L.feedDesc} className="w-full bg-gray-50 border border-black/5 p-3 rounded-xl text-xs md:text-sm font-bold h-24 outline-none focus:border-black leading-relaxed" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-black">
                <button onClick={() => {if(!feed.title) return; setBeomToken(p=>p-10); alert(L.regDoneAlert); setFeed({title:'', link:'', desc:''});}} className="md:col-span-2 bg-black text-white py-3 rounded-xl text-sm md:text-base font-black hover:bg-[#dc2626] transition-all shadow-lg active:scale-95">{L.postBtn}</button>
                <button className="bg-white border-2 border-black text-black py-3 rounded-xl text-xs md:text-sm font-black flex items-center justify-center gap-1.5 shadow active:scale-95">🚩 FAN ROOM</button>
              </div>
              <div className="space-y-1 bg-gray-50 p-3 rounded-xl border-l-[4px] border-[#dc2626] text-left font-black"><p className="text-gray-400 text-[11px] md:text-xs font-bold italic leading-none">{L.fanRoomDesc}</p></div>
            </div>

            <SectionHeader title={L.market} desc={L.marketDesc} />
            <div className="bg-white p-4 md:p-5 rounded-2xl border-2 border-black/10 space-y-4 font-black text-left">
                <div className="flex gap-4 border-b border-gray-100 pb-1.5">
                    <button onClick={() => setMarketMode('BUY')} className={`text-sm md:text-base font-black italic ${marketMode === 'BUY' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>{L.marketBuyTab}</button>
                    <button onClick={() => setMarketMode('SELL')} className={`text-sm md:text-base font-black italic ${marketMode === 'SELL' ? 'text-black border-b-2 border-black' : 'text-gray-300'}`}>{L.marketSellTab}</button>
                </div>
                {marketMode === 'BUY' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-black">
                        {displayGoods.map(g => (
                            <div key={g.id} className="bg-gray-50 p-3 rounded-xl border flex gap-3 items-center group shadow-sm transition-all hover:border-[#dc2626]">
                                <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-inner"><img src={g.img} className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" alt="G" /></div>
                                <div className="flex-1 min-w-0 font-black">
                                    <h4 className="text-[11px] md:text-xs font-black uppercase mb-0.5 truncate">{g.name}</h4>
                                    <p className="text-gray-400 text-[11px] md:text-xs mb-1 font-bold line-clamp-1 leading-tight">{g.desc}</p>
                                    <p className="text-[#dc2626] text-xs md:text-base font-black mb-2 leading-none">{g.price.toLocaleString()} <span className="notranslate text-[11px]" translate="no">BEOM</span></p>
                                    <button className="w-full py-1.5 bg-black text-white rounded-lg text-[11px] md:text-xs font-black uppercase active:scale-95">{L.buyReqBtn}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2 font-black">
                        <input value={sellItem.name} onChange={e => setSellItem({...sellItem, name:e.target.value})} placeholder={L.itemName} className="w-full bg-gray-50 border border-black/5 p-3 rounded-xl text-xs md:text-sm font-black outline-none" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="number" value={sellItem.price} onChange={e => setSellItem({...sellItem, price:e.target.value})} placeholder={L.itemPrice} className="w-full bg-gray-50 border border-black/5 p-3 rounded-xl text-xs md:text-sm font-black outline-none" />
                            <input value={sellItem.img} onChange={e => setSellItem({...sellItem, img:e.target.value})} placeholder={L.itemImg} className="w-full bg-gray-50 border border-black/5 p-3 rounded-xl text-xs md:text-sm font-black outline-none" />
                        </div>
                        <textarea value={sellItem.desc} onChange={e => setSellItem({...sellItem, desc:e.target.value})} placeholder={L.itemDesc} className="w-full bg-gray-50 border border-black/5 p-3 rounded-xl text-xs md:text-sm font-bold h-20 outline-none" />
                        <button onClick={() => {if(!sellItem.name) return; setUserGoods([{id:Date.now(), ...sellItem, price:Number(sellItem.price), seller:"User"}, ...userGoods]); alert(L.regDoneAlert); setMarketMode('BUY');}} className="w-full bg-[#dc2626] text-white py-3 rounded-xl text-xs md:text-sm font-black shadow-lg">{L.sellDoneBtn}</button>
                    </div>
                )}
            </div>

            <SectionHeader title={L.partnership} desc={L.partnershipDesc} />
            <div className="bg-black p-6 rounded-2xl border-[8px] border-[#dc2626] space-y-4 relative overflow-hidden font-black shadow-2xl">
                <h3 className="text-white text-lg md:text-xl font-black italic border-l-4 border-white pl-3 uppercase leading-none z-10 relative">PARTNERSHIP B2B</h3>
                <div className="grid grid-cols-2 gap-2 z-10 relative font-black">
                    <input value={partner.corp} onChange={e=>setPartner({...partner, corp: e.target.value})} placeholder={L.corpName} className="bg-white/10 border-none p-3 rounded-xl text-[11px] md:text-xs text-white outline-none focus:ring-1 ring-[#dc2626]" />
                    <input value={partner.manager} onChange={e=>setPartner({...partner, manager: e.target.value})} placeholder={L.manager} className="bg-white/10 border-none p-3 rounded-xl text-[11px] md:text-xs text-white outline-none focus:ring-1 ring-[#dc2626]" />
                    <input value={partner.email} onChange={e=>setPartner({...partner, email: e.target.value})} placeholder={L.email} className="bg-white/10 border-none p-3 rounded-xl text-[11px] md:text-xs text-white outline-none focus:ring-1 ring-[#dc2626]" />
                    <input value={partner.contact} onChange={e=>setPartner({...partner, contact: e.target.value})} placeholder={L.contact} className="bg-white/10 border-none p-3 rounded-xl text-[11px] md:text-xs text-white outline-none focus:ring-1 ring-[#dc2626]" />
                </div>
                <textarea value={partner.msg} onChange={e=>setPartner({...partner, msg: e.target.value})} placeholder={L.vision} className="w-full bg-white/10 border-none p-4 rounded-2xl text-[11px] md:text-xs text-white h-24 outline-none focus:ring-1 ring-[#dc2626] z-10 relative text-left" />
                <button onClick={()=>alert(L.propDoneAlert)} className="w-full bg-[#dc2626] text-white py-3.5 rounded-full text-sm md:text-base font-black hover:bg-white hover:text-black transition-all uppercase z-10 relative active:scale-95 shadow-xl">{L.submit}</button>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto bg-white border-2 border-black p-1.5 rounded-2xl flex justify-between gap-1.5 z-[1000] shadow-2xl font-black">
        {['KEDHEON', 'CIVIL', 'FACTFILTER', 'NEXUS', 'VENDOR'].map(app => (
          <button
            key={app}
            translate="no"
            onClick={() => {
              if (app === 'CIVIL') {
                window.location.href = '/civil';
              } else if (app === 'FACTFILTER') {
                window.location.href = '/factfilter';
              } else if (app === 'KEDHEON') {
                window.location.href = '/';
              } else {
                alert(app + ' 서비스 연동 준비 중입니다.');
              }
            }}
            className={`notranslate flex-1 py-3.5 md:py-4.5 rounded-xl text-xs md:text-sm transition-all font-black text-center leading-none cursor-pointer hover:scale-105 active:scale-95 ${app === 'KEDHEON' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
          >
            {app}
          </button>
        ))}
      </footer>
    </div>
  );
}
