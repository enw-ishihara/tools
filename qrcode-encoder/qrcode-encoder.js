'use strict';

const print_status = (function(message) {
  let timer_id_max = 0;

  return function(message) {
    const delay = 2000;  // メッセージを表示する時間（単位はミリ秒）

    document.querySelector('[data-status]').innerHTML = message;
    let timer_id = setTimeout(function() {
      if (timer_id == timer_id_max) document.querySelector('[data-status]').innerHTML = '';
    }, delay);
    timer_id_max = timer_id;
  };
})();

const init = function() {
  document.querySelector('[data-generate]').addEventListener('click', function() {
    try {
      let qr = new QRious({
        element: document.querySelector('[data-canvas]'),
        value: document.querySelector('[data-text]').value
      });
      qr.size = 240;
      print_status('QRコードを作成しました。');
    } catch (e) {
      print_status('QRコードを作成できませんでした。');
    }
  });
};

window.addEventListener('DOMContentLoaded', function() {
  init();
});
