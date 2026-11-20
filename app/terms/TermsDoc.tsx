'use client';

import { useEffect, useState } from 'react';

/**
 * 이용약관 — Kedheon.pi 연계 앱 공통 (한국어 / English)
 *
 * Pi 메인넷 리스팅 요건 문서(terms_of_service_url).
 *  - 디자인·언어 토글·문의처·개정일 구조는 /privacy(PrivacyDoc)와 동일하게 맞춘다:
 *    화이트/블랙 + 레드(#DC2626), px 고정 타이포(t-hero·t-section·t-card·t-body·t-tag)만 사용.
 *  - Pi Browser 글자 배율 보정은 globals.css 의 --pi-scale 이 이미 처리한다.
 *  - 서브도메인(factfilter.kedheon.com 등)에서도 /terms 는 미들웨어가 리라이트하지 않고
 *    그대로 서빙되므로 어느 앱에서 눌러도 같은 문서가 열린다.
 *  - 본문은 실제 동작에 맞춘다: Pi 로그인(uid·username만), Pi 결제(트랜잭션 ID만),
 *    BEOM은 활동 지표(환전·재산적 가치 없음), 팩트체크 투표·한강 북마크는 서버 DB(서울 리전) 저장.
 */

type Lang = 'ko' | 'en';

type Block =
  | { type: 'p'; text: string }
  | { type: 'li'; text: string }
  | { type: 'note'; text: string };

type Section = { title: string; blocks: Block[] };

const UPDATED = '2026-11-20';

const KO_SECTIONS: Section[] = [
  {
    title: '1. 목적과 적용 범위',
    blocks: [
      {
        type: 'p',
        text: '이 약관은 Kedheon(이하 “운영자”)이 제공하는 Kedheon.pi 연계 앱의 이용 조건과 절차, 운영자와 이용자의 권리·의무·책임을 정합니다.',
      },
      { type: 'li', text: 'Kedheon — kedheon.com' },
      { type: 'li', text: 'Civil — civil.kedheon.com' },
      { type: 'li', text: 'FactFilter — factfilter.kedheon.com' },
      { type: 'li', text: 'Hangang — hangang.kedheon.com' },
      { type: 'li', text: 'XAEA12 — xaea12.kedheon.com' },
      { type: 'li', text: 'Vendor — vendor.kedheon.com' },
      {
        type: 'p',
        text: '앱은 Pi Browser 안에서 Pi 로그인과 Pi 결제를 사용합니다. Pi 계정·지갑·네트워크 자체의 이용에는 Pi Network의 약관이 함께 적용됩니다.',
      },
      {
        type: 'p',
        text: '이 약관에 동의하지 않으면 앱을 이용하지 않을 수 있습니다. 시행일 이후에도 앱을 계속 이용하면 개정된 약관에 동의한 것으로 봅니다.',
      },
    ],
  },
  {
    title: '2. 서비스의 목적과 내용',
    blocks: [
      {
        type: 'p',
        text: '운영자는 Web2의 정보·커뮤니티 서비스와 Web3(Pi Network)의 로그인·결제를 한 화면에서 연결하는 유틸리티를 제공합니다.',
      },
      {
        type: 'li',
        text: 'Kedheon — 파이 결제와 생태계 기여 리워드, 스마트 보안 QR(개인·사업자), 크리에이티브 피드, 마켓플레이스 목록, B2B 제휴 데스크, 초대·추천 안내를 한 포털에서 잇습니다.',
      },
      {
        type: 'li',
        text: 'FactFilter — 238개 국가를 축으로 한 중립 팩트체크 원장입니다. 이용자는 보도·주장을 제보하고 지지·반대·보류로 투표하며, 제출된 근거는 해시로 봉인되어 기록됩니다.',
      },
      {
        type: 'li',
        text: 'Hangang — 한국 여행 패스 유틸리티입니다. 권역별 숙박·문화·음식·교통 조합, 순수 관광객 맛집 지도, K-컬처 정보, 예약·문의, 1330 관광 통역 안내 연결을 10개 언어로 제공합니다.',
      },
      {
        type: 'li',
        text: 'Civil·XAEA12·Vendor — 각 앱 화면에 안내된 연계 유틸리티를 제공하며, 이 약관이 함께 적용됩니다.',
      },
      {
        type: 'note',
        text: '화면에 표시되는 가격·포인트·통계나 데모·미리보기 화면은 서비스 소개를 위한 값일 수 있으며, 그 자체로 운영자의 청약이나 확정된 계약 조건이 되지 않습니다. 실제 결제와 정산은 7조의 절차를 따릅니다.',
      },
    ],
  },
  {
    title: '3. Pi 로그인과 계정',
    blocks: [
      {
        type: 'p',
        text: '앱은 Pi SDK를 통한 Pi 로그인으로 이용자를 확인합니다. 로그인 시 앱은 Pi Network가 전달하는 공개 식별자(uid)와 사용자 이름만 받고, KYC 결과나 실명은 받지 않습니다.',
      },
      {
        type: 'li',
        text: '이용자는 자신의 Pi 계정으로 로그인하며 1인 1계정을 원칙으로 합니다. KYC가 필요한 투표·예약은 Pi Network가 확인한 1인 1계정 기준으로 처리됩니다.',
      },
      {
        type: 'li',
        text: '운영자는 Pi 24단어 비밀구절(passphrase)과 지갑 개인키를 요구하지 않습니다. 이를 입력하라고 요구하는 화면이나 메시지는 운영자와 무관하므로 절대 입력하지 마세요.',
      },
      {
        type: 'li',
        text: '계정 관리 책임은 이용자에게 있습니다. 기기 분실이나 계정 도용을 알게 되면 Pi Network의 절차로 보호 조치하고 운영자에게 알려 주세요.',
      },
    ],
  },
  {
    title: '4. 이용자의 책임과 금지행위',
    blocks: [
      {
        type: 'p',
        text: '이용자는 앱을 관련 법령과 이 약관에 따라 이용해야 하며, 다음 행위를 해서는 안 됩니다.',
      },
      { type: 'li', text: '허위 사실을 알면서 제보·게시·투표하는 행위, 근거를 조작·위조하는 행위' },
      {
        type: 'li',
        text: '다른 사람이나 기관·단체를 사칭하는 행위, 타인의 명예를 훼손하거나 개인정보를 무단으로 게시하는 행위',
      },
      {
        type: 'li',
        text: '중복 계정·자동화·매크로 등으로 투표·포인트·추천을 조작하는 어뷰징 행위',
      },
      {
        type: 'li',
        text: '서비스의 정상 운영을 방해하거나 접근 권한을 우회·역설계·대량 수집하는 행위',
      },
      {
        type: 'li',
        text: '불법 거래·사기·스팸, 혐오·차별·성적 착취 등 법령이나 공서양속에 반하는 내용을 게시하는 행위',
      },
      {
        type: 'p',
        text: '이용자가 작성한 글·제보·투표는 이용자에게 귀속됩니다. 다만 운영자는 서비스 제공·전시·백업·분쟁 대응에 필요한 범위에서 이를 저장·표시할 수 있습니다.',
      },
      {
        type: 'p',
        text: '위반이 확인되면 운영자는 해당 내용을 가리거나 삭제하고, 이용을 제한하거나 기록을 정정할 수 있습니다. 중대한 위반은 관계 기관에 알릴 수 있습니다.',
      },
      {
        type: 'note',
        text: '제보는 검증 가능한 근거를 바탕으로 해야 하며, 확인되지 않은 의혹을 사실처럼 단정해서는 안 됩니다. 투표는 이용자 개인의 평가이고, 운영자는 누구의 잘잘못을 판정하지 않고 집계만 기록합니다.',
      },
    ],
  },
  {
    title: '5. BEOM 활동 포인트',
    blocks: [
      {
        type: 'p',
        text: 'BEOM(발자국)은 앱 안에서의 활동을 나타내는 내부 포인트입니다. 출석, 팩트체크 검증·제보·봉인, 예약·문의 같은 정해진 행동에 대해 서버가 정한 고정량을 적립하고, 같은 행동에는 하루 상한을 둡니다.',
      },
      {
        type: 'note',
        text: 'BEOM은 현금이나 암호화폐로 바꿀 수 없고, 코인·토큰·증권 등 어떤 형태의 재산적 가치도 보장하지 않습니다. 양도·판매·담보·상속의 대상이 아니며, Pi나 다른 자산으로 전환된다는 약속도 하지 않습니다.',
      },
      {
        type: 'li',
        text: '적립량·상한·사용처는 운영에 따라 바뀔 수 있고, 어뷰징이 확인되면 적립을 취소하거나 잔액을 조정·초기화할 수 있습니다.',
      },
      {
        type: 'li',
        text: '서비스가 종료되거나 계정이 삭제되면 BEOM 잔액도 함께 소멸하며, 이에 대한 별도의 보상은 없습니다.',
      },
      {
        type: 'li',
        text: '화면에 BEOM 사용량이 표시되는 기능(피드 등록, 팬룸, 마켓 목록 등)은 서비스 안에서 활동 지표를 쓰는 예시이며, 재산상 권리를 사고파는 거래가 아닙니다.',
      },
    ],
  },
  {
    title: '6. 팩트체크 투표와 북마크 데이터',
    blocks: [
      {
        type: 'p',
        text: 'Pi로 로그인한 이용자의 팩트체크 투표(지지·반대·보류)와 Hangang 장소·패스 북마크는 Pi uid를 기준으로 운영자 서버 DB(서울 리전)에 저장됩니다. 로그인하지 않은 상태의 값은 그 브라우저(localStorage)에만 남습니다.',
      },
      {
        type: 'li',
        text: '같은 항목에 다시 투표하면 새 판정으로 덮어써지고, 항목별 집계(총 투표 수와 판정별 수)는 누구나 볼 수 있게 공개됩니다.',
      },
      {
        type: 'li',
        text: '북마크는 저장·해제를 반복할 수 있고, 해제하면 서버에서 삭제됩니다.',
      },
      {
        type: 'li',
        text: '투표와 북마크는 서비스 기능 제공과 어뷰징 방지를 위해 보관하며, 개인을 식별하는 형태로 공개하지 않습니다.',
      },
      {
        type: 'li',
        text: '삭제를 원하면 문의처로 요청해 주세요. 원장의 무결성을 위해 개인 식별자와 분리한 집계값은 남을 수 있습니다.',
      },
      {
        type: 'p',
        text: '수집 항목과 보관·파기 절차의 자세한 내용은 개인정보 처리방침(kedheon.com/privacy)을 따릅니다.',
      },
    ],
  },
  {
    title: '7. Pi 결제와 예약',
    blocks: [
      {
        type: 'p',
        text: '유료 기능은 Pi Browser 안에서 Pi Network의 결제 절차로 진행됩니다. 앱은 결제 식별자(트랜잭션 ID)와 금액·통화·상태만 받고, 카드·계좌 정보는 받지 않습니다.',
      },
      {
        type: 'li',
        text: '결제의 승인·완료·환불은 Pi Network의 정책과 절차를 따릅니다.',
      },
      {
        type: 'li',
        text: 'Hangang의 예약·문의는 이용자의 요청을 접수하는 단계입니다. KYC로 확인된 호스트의 확인 후 실제 결제와 정산이 이루어지며, 요청이 접수되었다고 예약이 확정되는 것은 아닙니다.',
      },
      {
        type: 'li',
        text: '데모·미리보기로 표시된 화면에서는 실제 결제가 발생하지 않습니다. 표시 금액은 여행 정보 안내를 위한 예시일 수 있습니다.',
      },
    ],
  },
  {
    title: '8. 서비스의 변경과 중단',
    blocks: [
      {
        type: 'p',
        text: '운영자는 기능을 추가·변경하거나 일부를 중단할 수 있습니다. 이용자에게 불리한 중요한 변경은 미리 앱 화면에 공지합니다.',
      },
      {
        type: 'li',
        text: 'Pi Network·호스팅·통신 장애, 천재지변, 정전 등 운영자의 통제를 벗어난 사유로 서비스가 일시 중단될 수 있습니다.',
      },
      {
        type: 'li',
        text: '무료로 제공되는 기능이 중단되더라도 운영자는 별도의 보상을 하지 않습니다.',
      },
    ],
  },
  {
    title: '9. 보증의 한계와 면책',
    blocks: [
      {
        type: 'p',
        text: '앱이 제공하는 정보(여행·맛집·문화·안전 안내, 팩트체크 집계 등)는 이용자의 판단을 돕기 위한 참고 자료입니다. 운영자는 그 정확성·완전성·최신성을 보증하지 않으며, 여행·숙박·교통 등 실제 서비스의 조건은 해당 사업자와 공식 안내로 확인해야 합니다.',
      },
      {
        type: 'li',
        text: '이용자가 앱의 정보나 다른 이용자의 게시물을 믿고 내린 결정과 그 결과에 대해 운영자는 책임을 지지 않습니다. 다만 운영자의 고의·중과실이 있는 경우는 다릅니다.',
      },
      {
        type: 'li',
        text: '앱에 연결된 외부 사이트와 서드파티 서비스의 내용·거래에는 해당 제공자의 약관이 적용됩니다.',
      },
      {
        type: 'li',
        text: 'BEOM 포인트와 Pi 자산의 가치 변동, Pi Network의 정책 변경으로 생긴 손실에 대해 운영자는 책임을 지지 않습니다.',
      },
      {
        type: 'p',
        text: '이 조항은 관련 법령상 제한할 수 없는 운영자의 책임을 배제하지 않습니다.',
      },
    ],
  },
  {
    title: '10. 약관의 변경',
    blocks: [
      {
        type: 'p',
        text: '약관이 바뀌면 시행일 7일 전부터 이 페이지에 게시합니다. 이용자에게 불리한 중요한 변경은 30일 전에 알리고 앱 화면 공지로 함께 안내합니다.',
      },
      {
        type: 'p',
        text: '시행일 이후에도 앱을 계속 이용하면 변경에 동의한 것으로 봅니다. 동의하지 않으면 이용을 중단하고 계정 삭제를 요청할 수 있습니다.',
      },
    ],
  },
  {
    title: '11. 준거법 및 분쟁 해결',
    blocks: [
      {
        type: 'p',
        text: '이 약관은 대한민국 법률에 따라 해석되고 적용됩니다.',
      },
      {
        type: 'li',
        text: '분쟁이 생기면 서로 협의해 해결하고, 협의가 되지 않으면 민사소송법이 정한 관할 법원에 제기합니다.',
      },
      {
        type: 'li',
        text: '운영자는 관련 법령에 따라 이용자의 권리를 보호하기 위해 필요한 조치를 합니다.',
      },
    ],
  },
  {
    title: '12. 문의처',
    blocks: [
      { type: 'li', text: '운영 — Kedheon' },
      { type: 'li', text: '이메일 — osung02012@gmail.com' },
      { type: 'li', text: '앱 — kedheon.com 및 위 서브도메인 전체' },
      {
        type: 'li',
        text: '개인정보의 열람·정정·삭제 요청은 개인정보 처리방침(kedheon.com/privacy)의 문의처를 함께 이용해 주세요.',
      },
    ],
  },
];

const EN_SECTIONS: Section[] = [
  {
    title: '1. Purpose and scope',
    blocks: [
      {
        type: 'p',
        text: 'These terms set out the conditions and procedure for using the Kedheon.pi linked apps provided by Kedheon (“we”, “us”), and the rights, obligations and responsibilities of us and of you, the user.',
      },
      { type: 'li', text: 'Kedheon — kedheon.com' },
      { type: 'li', text: 'Civil — civil.kedheon.com' },
      { type: 'li', text: 'FactFilter — factfilter.kedheon.com' },
      { type: 'li', text: 'Hangang — hangang.kedheon.com' },
      { type: 'li', text: 'XAEA12 — xaea12.kedheon.com' },
      { type: 'li', text: 'Vendor — vendor.kedheon.com' },
      {
        type: 'p',
        text: 'Inside Pi Browser the apps use Pi sign-in and Pi payments. Use of the Pi account, wallet and network itself is also governed by the Pi Network terms.',
      },
      {
        type: 'p',
        text: 'If you do not agree to these terms you may not use the apps. Continuing to use them on or after the effective date means you accept the revised terms.',
      },
    ],
  },
  {
    title: '2. What the services provide',
    blocks: [
      {
        type: 'p',
        text: 'We provide utilities that connect Web2 information and community services with Web3 (Pi Network) sign-in and payment in one screen.',
      },
      {
        type: 'li',
        text: 'Kedheon — one portal for Pi payments and ecosystem contribution rewards, smart security QR cards (personal and business), a creative feed, marketplace listings, a B2B partnership desk and invite/referral guidance.',
      },
      {
        type: 'li',
        text: 'FactFilter — a neutral fact-check ledger organised by 238 countries. Users report coverage and claims, vote endorse, dispute or unsure, and submitted evidence is sealed as a hash on the record.',
      },
      {
        type: 'li',
        text: 'Hangang — a Korea travel pass utility offering combinations of stay, culture, food and transit by region, a food map for independent travellers, K-culture information, booking and inquiry, and a link to the 1330 tourist interpretation line, in 10 languages.',
      },
      {
        type: 'li',
        text: 'Civil, XAEA12 and Vendor — the linked utilities described on each app’s own screens, to which these terms also apply.',
      },
      {
        type: 'note',
        text: 'Prices, points, statistics and any demo or preview screens may be shown to introduce the service, and are not by themselves an offer from us or a settled contract term. Actual payment and settlement follow section 7.',
      },
    ],
  },
  {
    title: '3. Pi sign-in and accounts',
    blocks: [
      {
        type: 'p',
        text: 'The apps identify you through Pi sign-in with the Pi SDK. On sign-in we receive only the public identifier (uid) and username that Pi Network passes to the app; we never receive KYC results or your legal name.',
      },
      {
        type: 'li',
        text: 'You sign in with your own Pi account, one person to one account. Voting and booking that require KYC are processed on the one-person-one-account basis verified by Pi Network.',
      },
      {
        type: 'li',
        text: 'We never ask for your 24-word Pi passphrase or wallet private keys. Any screen or message asking you to enter them is not from us; never type them in.',
      },
      {
        type: 'li',
        text: 'You are responsible for your account. If your device is lost or you suspect your account is compromised, take protective steps through Pi Network and let us know.',
      },
    ],
  },
  {
    title: '4. Your responsibilities and prohibited conduct',
    blocks: [
      {
        type: 'p',
        text: 'You must use the apps in accordance with applicable law and these terms, and must not:',
      },
      { type: 'li', text: 'report, post or vote on something you know to be false, or forge or manipulate evidence;' },
      {
        type: 'li',
        text: 'impersonate another person, agency or organisation, defame anyone, or post someone else’s personal information without permission;',
      },
      {
        type: 'li',
        text: 'manipulate votes, points or referrals through duplicate accounts, automation, macros or similar abuse;',
      },
      {
        type: 'li',
        text: 'interfere with normal operation of the service, or bypass, reverse engineer or bulk-collect from it;',
      },
      {
        type: 'li',
        text: 'post unlawful transactions, fraud, spam, hatred, discrimination or sexual exploitation, or anything else against law or public order.',
      },
      {
        type: 'p',
        text: 'What you write, report and vote remains yours. We may store and display it to the extent needed to run, present and back up the service and to respond to disputes.',
      },
      {
        type: 'p',
        text: 'Where a violation is confirmed we may hide or delete the content, restrict your use or correct the record. Serious violations may be reported to the relevant authorities.',
      },
      {
        type: 'note',
        text: 'Reports must rest on verifiable evidence, and unverified suspicion must not be stated as fact. A vote is your own appraisal; we do not judge anyone right or wrong and record only the aggregate.',
      },
    ],
  },
  {
    title: '5. BEOM activity points',
    blocks: [
      {
        type: 'p',
        text: 'BEOM (“footprint”) is an internal point that indicates activity inside the apps. For defined actions — attendance, fact-check verification, reporting and sealing, booking and inquiry — the server awards a fixed amount, with a daily cap per action.',
      },
      {
        type: 'note',
        text: 'BEOM cannot be exchanged for cash or cryptocurrency, and carries no property value in any form, whether coin, token or security. It cannot be transferred, sold, pledged or inherited, and we promise no conversion into Pi or any other asset.',
      },
      {
        type: 'li',
        text: 'Award amounts, caps and where points can be used may change with operations, and confirmed abuse may lead to awards being reversed or the balance adjusted or reset.',
      },
      {
        type: 'li',
        text: 'When the service ends or an account is deleted, any BEOM balance ends with it, without separate compensation.',
      },
      {
        type: 'li',
        text: 'Features showing a BEOM cost (posting to the feed, a fan room, marketplace listing and similar) are examples of using the activity indicator inside the service, not a trade in property rights.',
      },
    ],
  },
  {
    title: '6. Fact-check votes and bookmark data',
    blocks: [
      {
        type: 'p',
        text: 'For users signed in with Pi, FactFilter votes (endorse, dispute, unsure) and Hangang place and pass bookmarks are stored in our server database (Seoul region) keyed by your Pi uid. Values created while signed out stay only in that browser’s localStorage.',
      },
      {
        type: 'li',
        text: 'Voting again on the same item overwrites your previous verdict, and the aggregate for each item (total votes and counts per verdict) is public.',
      },
      {
        type: 'li',
        text: 'Bookmarks can be saved and removed repeatedly; removing one deletes it from the server.',
      },
      {
        type: 'li',
        text: 'Votes and bookmarks are kept to provide the feature and to prevent abuse, and are never published in a form that identifies you.',
      },
      {
        type: 'li',
        text: 'To have them deleted, contact us below. Aggregates separated from personal identifiers may remain so that the ledger stays verifiable.',
      },
      {
        type: 'p',
        text: 'Details of what we collect and how we retain and delete it are set out in the Privacy Policy (kedheon.com/privacy).',
      },
    ],
  },
  {
    title: '7. Pi payments and bookings',
    blocks: [
      {
        type: 'p',
        text: 'Paid features run through Pi Network’s payment flow inside Pi Browser. We receive only the payment identifier (transaction ID) and the amount, currency and status; we never receive card or bank details.',
      },
      { type: 'li', text: 'Approval, completion and refunds follow Pi Network’s policy and procedure.' },
      {
        type: 'li',
        text: 'A Hangang booking or inquiry is a request from you. Actual payment and settlement take place after a KYC-verified host confirms it; a received request is not a confirmed booking.',
      },
      {
        type: 'li',
        text: 'Screens marked as demo or preview do not create a real payment. Amounts shown may be examples for travel information.',
      },
    ],
  },
  {
    title: '8. Changes and suspension',
    blocks: [
      {
        type: 'p',
        text: 'We may add, change or discontinue features. Significant changes that disadvantage users are announced in the apps in advance.',
      },
      {
        type: 'li',
        text: 'The service may be interrupted by Pi Network, hosting or network failures, natural disasters, power cuts or other causes beyond our control.',
      },
      {
        type: 'li',
        text: 'No separate compensation is provided if a free feature is discontinued.',
      },
    ],
  },
  {
    title: '9. Limits of warranty and disclaimer',
    blocks: [
      {
        type: 'p',
        text: 'The information provided (travel, food, culture and safety guidance, fact-check aggregates and so on) is reference material to support your own judgment. We do not warrant that it is accurate, complete or current, and the actual conditions of travel, accommodation and transport services must be confirmed with the provider and its official notices.',
      },
      {
        type: 'li',
        text: 'We are not liable for decisions you make in reliance on information in the apps or on other users’ posts, or for their results, except in cases of our intent or gross negligence.',
      },
      {
        type: 'li',
        text: 'External sites and third-party services linked from the apps are governed by their own providers’ terms.',
      },
      {
        type: 'li',
        text: 'We are not liable for losses from changes in the value of BEOM points or Pi assets, or from changes to Pi Network policy.',
      },
      {
        type: 'p',
        text: 'Nothing in this section excludes liability that cannot be excluded under applicable law.',
      },
    ],
  },
  {
    title: '10. Changes to these terms',
    blocks: [
      {
        type: 'p',
        text: 'If these terms change, we post the new version on this page at least 7 days before it takes effect. Significant changes that disadvantage users are announced 30 days in advance and also noted in the apps.',
      },
      {
        type: 'p',
        text: 'Continuing to use the apps after the effective date means you accept the change. If you do not, you may stop using the service and request deletion of your account.',
      },
    ],
  },
  {
    title: '11. Governing law and disputes',
    blocks: [
      {
        type: 'p',
        text: 'These terms are interpreted and applied under the laws of the Republic of Korea.',
      },
      {
        type: 'li',
        text: 'Disputes are resolved first through mutual discussion; failing that, they are brought before the court with jurisdiction under the Korean Civil Procedure Act.',
      },
      {
        type: 'li',
        text: 'We take the measures needed to protect users’ rights as required by applicable law.',
      },
    ],
  },
  {
    title: '12. Contact',
    blocks: [
      { type: 'li', text: 'Operator — Kedheon' },
      { type: 'li', text: 'Email — osung02012@gmail.com' },
      { type: 'li', text: 'Apps — kedheon.com and the subdomains listed above' },
      {
        type: 'li',
        text: 'For requests to access, correct or delete your personal information, use the contact in the Privacy Policy (kedheon.com/privacy).',
      },
    ],
  },
];

export default function TermsDoc() {
  const [lang, setLang] = useState<Lang>('ko');

  // 다른 앱들과 같이 문서 언어를 선택 언어에 맞춘다(브라우저 자동번역 오작동 방지).
  useEffect(() => {
    document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
  }, [lang]);

  const sections = lang === 'ko' ? KO_SECTIONS : EN_SECTIONS;
  const ko = lang === 'ko';

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-10 selection:bg-red-50 overflow-x-hidden break-keep">
      {/* ── 상단 바 ─────────────────────────────────────────── */}
      <nav className="w-full max-w-3xl sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-black bg-black flex items-center justify-center shrink-0">
              <span className="text-white t-tag" translate="no">K</span>
            </div>
            <div className="leading-tight min-w-0">
              <span className="notranslate t-brand text-black italic uppercase truncate block" translate="no">Kedheon</span>
              <span className="block text-gray-400 t-tag font-mono uppercase whitespace-nowrap" translate="no">Terms of Service</span>
            </div>
          </div>
          <a
            href="/"
            className="shrink-0 t-tag px-2.5 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            ← {ko ? '홈으로 돌아가기' : 'Back to home'}
          </a>
        </div>
      </nav>

      <main className="w-full max-w-3xl px-4 py-4">
        {/* ── 제목 + 언어 전환 ───────────────────────────────── */}
        <section className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-[var(--card-shadow)] overflow-hidden px-4 py-3 sm:px-6 sm:py-5">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 text-left">
              <p className="t-tag font-mono text-[#dc2626] uppercase" translate="no">
                Kedheon.pi linked apps
              </p>
              <h1 className="t-hero text-black mt-0.5">
                {ko ? '이용약관' : 'Terms of Service'}
              </h1>
              <p className="text-gray-500 t-sub mt-1">
                {ko
                  ? 'Kedheon · Civil · FactFilter · Hangang · XAEA12 · Vendor 공통'
                  : 'Common to Kedheon · Civil · FactFilter · Hangang · XAEA12 · Vendor'}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-1 bg-neutral-100 rounded-lg p-0.5" role="group" aria-label="Language">
              <button
                type="button"
                onClick={() => setLang('ko')}
                className={`t-tag px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  ko ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
                }`}
              >
                한국어
              </button>
              <button
                type="button"
                translate="no"
                onClick={() => setLang('en')}
                className={`notranslate t-tag px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  !ko ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="t-tag px-2 py-0.5 rounded border border-neutral-200 text-neutral-600">
              {ko ? '시행일' : 'Effective'} <span translate="no" className="notranslate font-mono">{UPDATED}</span>
            </span>
            <span className="t-tag px-2 py-0.5 rounded border border-neutral-200 text-neutral-600">
              {ko ? '최종 개정' : 'Last revised'} <span translate="no" className="notranslate font-mono">{UPDATED}</span>
            </span>
          </div>
        </section>

        {/* ── 요약 ─────────────────────────────────────────── */}
        <section className="mt-3 bg-neutral-50 rounded-2xl border-l-[3px] border-[#dc2626] px-4 py-3 text-left">
          <p className="t-card text-black">
            {ko ? '한 줄 요약' : 'In one line'}
          </p>
          <p className="text-neutral-600 t-body mt-1">
            {ko
              ? 'Kedheon과 연계 앱은 Pi 로그인으로 Web2의 정보·커뮤니티와 Web3의 결제를 잇는 유틸리티입니다. BEOM은 활동을 보여 주는 내부 포인트로 현금·암호화폐 가치가 없고, 팩트체크 투표와 한강 북마크는 로그인 시 서버 DB에 저장되며, 앱의 정보는 판단을 돕는 참고 자료입니다.'
              : 'Kedheon and its linked apps connect Web2 information and community with Web3 payment through Pi sign-in. BEOM is an internal point that shows activity and has no cash or crypto value; fact-check votes and Hangang bookmarks are stored in our server database when signed in; the information in the apps is reference material for your own judgment.'}
          </p>
        </section>

        {/* ── 본문 ─────────────────────────────────────────── */}
        <div className="mt-3 space-y-3">
          {sections.map(section => (
            <section
              key={section.title}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[var(--card-shadow)] px-4 py-3.5 sm:px-5 text-left"
            >
              <h2 className="t-section text-black">{section.title}</h2>
              <div className="mt-2 space-y-1.5">
                {section.blocks.map((block, i) => {
                  if (block.type === 'li') {
                    return (
                      <p key={i} className="text-neutral-700 t-body flex gap-1.5">
                        <span className="text-[#dc2626] shrink-0">·</span>
                        <span className="min-w-0">{block.text}</span>
                      </p>
                    );
                  }
                  if (block.type === 'note') {
                    return (
                      <p
                        key={i}
                        className="t-body text-neutral-800 bg-red-50/70 border border-[#dc2626]/25 rounded-xl px-3 py-2 mt-2"
                      >
                        {block.text}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="text-neutral-600 t-body">
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ── 문의 안내 ─────────────────────────────────────── */}
        <section className="mt-3 bg-black rounded-2xl px-4 py-4 text-left">
          <h2 className="text-white t-section border-l-4 border-white pl-3">
            {ko ? '문의' : 'Contact'}
          </h2>
          <p className="text-white/70 t-sub mt-2">
            {ko
              ? '약관·이용 제한·계정 삭제에 관한 문의는 아래 주소로 보내주세요.'
              : 'Send questions about these terms, use restrictions or account deletion to the address below.'}
          </p>
          <a
            href="mailto:osung02012@gmail.com"
            className="inline-block mt-2 t-btn bg-[#dc2626] text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            osung02012@gmail.com
          </a>
        </section>

        <p className="text-center text-gray-400 t-tag mt-5 mb-2">
          <span translate="no" className="notranslate">Kedheon</span> · <span translate="no" className="notranslate">kedheon.com</span> · {ko ? '이용약관' : 'Terms of Service'} · {UPDATED}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <a
            href="/privacy"
            className="t-tag px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            {ko ? '개인정보 처리방침' : 'Privacy Policy'}
          </a>
          <a
            href="/"
            className="t-tag px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            ← {ko ? '홈으로 돌아가기' : 'Back to home'}
          </a>
        </div>
      </main>
    </div>
  );
}
