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

const reset_result = function() {
  // 解析結果を取得する
  const result = document.querySelector('[data-result]').innerHTML;
  if (!result) {
    alert('QRコードの画像を選択してください。');
    return;
  }

  document.querySelector('[data-result]').innerHTML = '';
  print_status('QRコードの解析結果をリセットしました。');
};

const copy_result = function() {
  if (!navigator.clipboard) {
    alert('このブラウザは対応していません。');
    return;
  }

  // 解析結果を取得する
  const result = document.querySelector('[data-result]').innerHTML;
  if (!result) {
    alert('QRコードの画像を選択してください。');
    return;
  }

  // 解析結果をクリップボードにコピーする
  navigator.clipboard.writeText(result).then(
    () => {
      print_status('解析結果をコピーしました。');
    },
    () => {
      alert('コピーに失敗しました。');
      return;
    }
  );
};

const check_qr_code = function(canvas) {
  const image_data = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(image_data.data, canvas.width, canvas.height);

  if (code) {
    document.querySelector('[data-result]').innerHTML = code.data;
    print_status('QRコードの解析に成功しました。');
  } else {
    print_status('QRコードは見つかりませんでした。');
  }
};

const draw_image = function(canvas, image, width, height) {
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d', { willReadFrequently: true }).drawImage(image, 0, 0, width, height);
};

const resize_image = function(target_len_px, w0, h0) {
  const len = Math.max(w0, h0);
  let width;
  let height;

  if (len <= target_len_px) {
    width = w0;
    height = h0;
  } else {
    if (w0 >= h0) {
      width = target_len_px;
      height = h0 * target_len_px / w0;
    } else {
      width = w0 * target_len_px / h0;
      height = target_len_px;
    }
  }

  return ({
    width: parseInt(width),
    height: parseInt(height)
  });
};

const read_image = function(canvas, reader) {
  let image = new Image();

  image.src = reader.result;

  image.onload = function() {
    const resize = resize_image(1024, image.width, image.height);

    draw_image(canvas, image, resize.width, resize.height);
    check_qr_code(canvas);
  };
};

const init = function() {
  let canvas = document.querySelector('[data-canvas]');

  document.querySelector('[data-input-image]').addEventListener('change', function(e) {
    const files = e.target.files;
    let reader = new FileReader();

    reader.onload = function() {
      read_image(canvas, reader);
    };
    reader.readAsDataURL(files[0]);
  }, false);

  document.querySelector('[data-generate]').addEventListener('click', function() {
    check_qr_code(canvas);
  });
  document.querySelector('[data-copy]').addEventListener('click', copy_result);
  document.querySelector('[data-reset]').addEventListener('click', reset_result);
};

window.addEventListener('DOMContentLoaded', function() {
  init();
});
