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
  const qrcode = new QRCode(document.querySelector('[data-qrcode]'));

  document.querySelector('[data-generate]').addEventListener('click', function() {
    const text = document.querySelector('[data-text]').value;
    try {
      qrcode.makeCode(text);
      print_status('QRコードを作成しました。');
    } catch (e) {
      print_status('QRコードを作成できませんでした。');
    }
  });
}

window.addEventListener('DOMContentLoaded', function() {
  init();
});
