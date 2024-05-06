'use strict';

const md = window.matchMedia("(min-width: 768px)");
// スクロールしたときに関数を呼び出す
window.addEventListener("scroll", () => {
  function mdCheck(md) {
    // ビューポートの幅が 指定ピクセル以上の場合に実行する
    if (md.matches) {
      // 呼び出す関数を記述
    }
  }
  mdCheck(md);
});

const lg = window.matchMedia("(min-width: 1024px)");
// スクロールしたときに関数を呼び出す
window.addEventListener("scroll", () => {
  function lgCheck(lg) {
    // ビューポートの幅が 指定ピクセル以上の場合に実行する
    if (lg.matches) {
      // 呼び出す関数を記述
    }
  }
  lgCheck(md);
});

//スクロールヒント表示
window.addEventListener("load", function () {
  new ScrollHint(".js-scrollable", {
    suggestiveShadow: true,
    i18n: {
      scrollable: "スクロールできます",
    },
  });
});

jQuery(function () {
  // ハンバーガーメニュー
  jQuery("#humburger").on("click", function () {
    const humburger = jQuery("#humburger");
    const body = jQuery("body");
    const spMenu = jQuery("#sp-menu");
    const spMenuBg = jQuery("#sp-menu-bg");
    if (jQuery(this).attr("aria-expanded") === "false") {
      body.addClass("is-active");
      spMenu.fadeToggle();
      jQuery(this).attr("aria-expanded", true);
      jQuery(this).attr("aria-label", "メニューを閉じる");
      spMenu.attr("aria-hidden", false);
      spMenuBg.fadeIn();
    } else {
      body.removeClass("is-active");
      spMenu.fadeToggle();
      jQuery(this).attr("aria-expanded", false);
      jQuery(this).attr("aria-label", "メニューを開く");
      spMenu.attr("aria-hidden", true);
      spMenuBg.fadeOut();
    }
    spMenuBg.on("click", function () {
      body.removeClass("is-active");
      spMenu.fadeToggle();
      humburger.attr("aria-expanded", false);
      humburger.attr("aria-label", "メニューを開く");
      spMenu.attr("aria-hidden", true);
      spMenuBg.fadeOut();
    });
  });

  // タブ
  jQuery(".tabs__btn-btn").on("click", function () {
    const targetID = "#" + jQuery(this).attr("aria-controls");
    jQuery(".tabs__btn-btn")
      .attr("aria-selected", false)
      .attr("aria-expanded", false);
    jQuery(this).attr("aria-selected", true).attr("aria-expanded", true);
    jQuery(".tabs__panel").attr("aria-hidden", true);
    jQuery(targetID).attr("aria-hidden", false);
  });

  // アコーディオン
  jQuery(".faq__panel").on("click", function () {
    if (jQuery(this).attr("aria-expanded") === "false") {
      jQuery(this).attr("aria-expanded", true);
      jQuery(this).find(".faq__header").addClass("is-open");
      jQuery(this).find(".faq__main").slideDown();
      jQuery(this).find(".faq__main").attr("aria-hidden", false);
    } else {
      jQuery(this).attr("aria-expanded", false);
      jQuery(this).find(".faq__header").removeClass("is-open");
      jQuery(this).find(".faq__main").slideUp();
      jQuery(this).find(".faq__main").attr("aria-hidden", true);
    }
  });

  // モーダル
  jQuery(".modal-btn").on("click", function () {
    jQuery(".modal").addClass("is-show");
  });

  // ページトップボタン
  jQuery(".page-top").on("click", function () {
    $("body, html").animate({ scrollTop: 0 }, 500);
    return false;
  });

  // ページ内スムーススクロール
  jQuery('a[href^="#"]').click(function () {
    const adjust = -100;
    const speed = 600;
    let href = jQuery(this).attr("href");
    let target = jQuery(href == "#" || href == "" ? "html" : href);
    let position = target.offset().top + adjust;
    jQuery("html,body").animate(
      {
        scrollTop: position,
      },
      speed,
      "swing"
    );
    return false;
  });

  // ページ外スムーススクロール
  let urlHash = location.hash;
  if (urlHash) {
    jQuery("html,body").stop().scrollTop(0);
    setTimeout(function () {
      const headerHeight = 100;
      let target = jQuery(urlHash);
      let position = target.offset().top - headerHeight;
      jQuery("html,body").stop().animate(
        {
          scrollTop: position,
        },
        600
      );
    }, 100);
  }
});