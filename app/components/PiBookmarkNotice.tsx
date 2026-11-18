'use client';

import React from 'react';

/**
 * 5개 앱 공통 — Pi Browser 공식 ★ 북마크 안내 1박스
 * ------------------------------------------------------------------
 * Pi Browser 자체의 별표·리뷰(App Directory → Bookmarked)와 겹치지 않도록,
 * 자체 즐겨찾기 목록·후기 폼은 두지 않는다. 남기는 것은 이 안내 박스 하나뿐이다.
 * 화면 규격은 BNPi 기준(px 고정 타이포 · 1px 연회색 테두리 · 화이트/블랙/레드).
 */

type Notice = { title: string; body: string; hint: string };

const TEXT: Record<string, Notice> = {
  KR: {
    title: 'Pi Browser 상단 ★ 북마크',
    body: 'Pi Browser 상단의 ★를 켜 두시면 App Directory의 Bookmarked에서 이 앱을 바로 다시 찾으실 수 있습니다.',
    hint: '북마크는 Pi Browser가 기억하므로, 다음 방문 때 주소를 다시 입력하지 않아도 됩니다.',
  },
  EN: {
    title: 'Star bookmark at the top of Pi Browser',
    body: 'Turn on the ★ at the top of Pi Browser and you can return to this app straight from App Directory → Bookmarked.',
    hint: 'Pi Browser remembers the bookmark, so you will not need to type the address again.',
  },
  CN: {
    title: 'Pi Browser 顶部 ★ 收藏',
    body: '在 Pi Browser 顶部点亮 ★，下次即可从 App Directory 的 Bookmarked 直接重新打开本应用。',
    hint: '收藏由 Pi Browser 记录，下次访问无需再次输入网址。',
  },
  JP: {
    title: 'Pi Browser 上部の ★ ブックマーク',
    body: 'Pi Browser 上部の ★ をオンにしておくと、App Directory の Bookmarked からこのアプリにすぐ戻れます。',
    hint: 'ブックマークは Pi Browser が記憶するので、次回はアドレスを入力する必要がありません。',
  },
  ES: {
    title: 'Marcador ★ en la parte superior de Pi Browser',
    body: 'Activa la ★ de la parte superior de Pi Browser y podrás volver a esta app desde App Directory → Bookmarked.',
    hint: 'Pi Browser guarda el marcador, así que no tendrás que escribir la dirección otra vez.',
  },
  VN: {
    title: 'Dấu ★ trên đầu Pi Browser',
    body: 'Bật dấu ★ ở đầu Pi Browser để mở lại ứng dụng này ngay từ App Directory → Bookmarked.',
    hint: 'Pi Browser ghi nhớ dấu trang, lần sau bạn không cần nhập lại địa chỉ.',
  },
  FR: {
    title: 'Favori ★ en haut de Pi Browser',
    body: 'Activez la ★ en haut de Pi Browser : vous rouvrirez cette app directement depuis App Directory → Bookmarked.',
    hint: 'Pi Browser garde le favori en mémoire, inutile de retaper l’adresse la prochaine fois.',
  },
  PT: {
    title: 'Favorito ★ no topo do Pi Browser',
    body: 'Ative a ★ no topo do Pi Browser e volte a este app direto do App Directory → Bookmarked.',
    hint: 'O Pi Browser guarda o favorito, então você não precisa digitar o endereço de novo.',
  },
  RU: {
    title: 'Закладка ★ в верхней части Pi Browser',
    body: 'Включите ★ в верхней части Pi Browser, и вернуться в это приложение можно будет сразу из App Directory → Bookmarked.',
    hint: 'Pi Browser запоминает закладку, поэтому адрес больше вводить не нужно.',
  },
  ID: {
    title: 'Markah ★ di bagian atas Pi Browser',
    body: 'Nyalakan ★ di bagian atas Pi Browser, lalu buka lagi aplikasi ini langsung dari App Directory → Bookmarked.',
    hint: 'Pi Browser menyimpan markahnya, jadi Anda tidak perlu mengetik alamat lagi.',
  },
};

function pick(lang?: string): Notice {
  const key = (lang || 'EN').toUpperCase();
  if (key === 'KO') return TEXT.KR;
  return TEXT[key] ?? TEXT.EN;
}

export default function PiBookmarkNotice({
  lang,
  className = '',
}: {
  /** 각 앱의 Lang 코드(KR·EN·CN·JP·ES·VN·FR·PT·RU·ID, 또는 KO). 그 외에는 영문. */
  lang?: string;
  className?: string;
}) {
  const t = pick(lang);

  return (
    <section
      aria-labelledby="pi-bookmark-title"
      className={`mt-3 bg-white border border-[#E5E7EB] rounded-2xl shadow-[var(--card-shadow)] px-3 py-3 md:px-5 md:py-4 text-left ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          translate="no"
          className="notranslate shrink-0 w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center text-[length:calc(15px*var(--pi-scale))] leading-none"
        >
          ★
        </span>
        <div className="min-w-0">
          <p translate="no" className="notranslate t-tag uppercase text-[#dc2626]">PI BROWSER BOOKMARK</p>
          <h2 id="pi-bookmark-title" className="t-card text-neutral-900 mt-0.5">{t.title}</h2>
          <p className="t-sub text-neutral-500 mt-1 leading-relaxed">{t.body}</p>
          <p className="t-tag text-gray-400 mt-1.5 leading-relaxed">{t.hint}</p>
        </div>
      </div>
    </section>
  );
}
