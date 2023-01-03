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

const generate_pw = function() {
  // 桁数
  let len = document.querySelector('[data-len]');
  if (!len.value) {
    alert('パスワードの桁数を入力してください。');
    return;
  }
  if (len.value < Number(len.min) || Number(len.max) < len.value) {
    alert(`パスワードの桁数は${Number(len.min)}から${Number(len.max)}の間で入力してください。`);
    return;
  }

  // 文字の種類
  let pw_base = '';
  document.querySelectorAll('[data-type]').forEach(function(char_type) {
    if (char_type.checked) {
      pw_base += document.querySelector(`[data-type-${char_type.dataset.type}]`).value;
    }
  });

  // パスワードを生成する
  let pw = '';
  for (let i = 0; i < len.value; i++) {
      pw += pw_base.charAt(Math.floor(Math.random() * pw_base.length));
  }
  document.querySelector('[data-result]').innerHTML = pw;
  print_status('パスワードを生成しました。');
};

const copy_pw = function() {
  if (!navigator.clipboard) {
    alert('このブラウザは対応していません。');
    return;
  }

  // パスワードを取得する
  const pw = document.querySelector('[data-result]').innerHTML;
  if (!pw) {
    alert('パスワードを生成してください。');
    return;
  }

  // パスワードをクリップボードにコピーする
  navigator.clipboard.writeText(pw).then(
    () => {
      print_status('パスワードをコピーしました。');
    },
    () => {
      alert('コピーに失敗しました。');
      return;
    }
  );
};

const reset_pw = function() {
  // パスワードを取得する
  const pw = document.querySelector('[data-result]').innerHTML;
  if (!pw) {
    alert('パスワードを生成してください。');
    return;
  }

  document.querySelector('[data-result]').innerHTML = '';
  print_status('パスワードをリセットしました。');
};

window.addEventListener('DOMContentLoaded', function() {
  document.querySelector('[data-generate]').addEventListener('click', generate_pw);
  document.querySelector('[data-copy]').addEventListener('click', copy_pw);
  document.querySelector('[data-reset]').addEventListener('click', reset_pw);
});
