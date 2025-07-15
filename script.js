
//投稿データをローカルストレージに保存
function saveMessage(handle, text) {
  const messages = JSON.parse(sessionStorage.getItem("messages") || "[]");
  messages.push({ handle, text });
  sessionStorage.setItem("messages", JSON.stringify(messages));
}

//投稿のたびに saveMessage() を呼ぶ
function postMessage() {
  const handle = document.getElementById("handle").value || "名無し";
  const text = document.getElementById("text-input").value;

  if (text.trim() === "") return;

  saveMessage(handle, text);
  renderMessages();
  document.getElementById("text-input").value = "";

  // 投稿後、HN欄を「名無しの〇〇」に戻す
  const anonVal = document.getElementById("anon-extra").value || "";
  const newHandle = "名無しの" + anonVal;
  document.getElementById("handle").value = newHandle;
  sessionStorage.setItem("handle", newHandle);
}


//投稿を表示する関数 renderMessages()
function renderMessages(scroll = true) {
  const messages = JSON.parse(sessionStorage.getItem("messages") || "[]");
  const logBox = document.getElementById("log");
  logBox.innerHTML = ""; // 一旦クリア

  const start_number = parseInt(sessionStorage.getItem("startNumber") || "1");

  messages.forEach((msg, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "message";
    wrapper.id = "msg" + i;

    const handleDiv = document.createElement("div");
    handleDiv.className = "handle";
    handleDiv.innerHTML = `>>${start_number + i} ${msg.handle}`;

    const textDiv = document.createElement("div");
    textDiv.className = "text";
    textDiv.innerHTML = msg.text;

    wrapper.appendChild(handleDiv);
    wrapper.appendChild(textDiv);
    logBox.appendChild(wrapper);
    logBox.appendChild(document.createElement("br"));
  });

  // スクロール制御（デフォルトtrue）
  if (scroll) {
    logBox.scrollTop = logBox.scrollHeight;
  }
}



function setStartNumber() {
  const value = parseInt(document.getElementById("startNumberInput").value);
  if (!isNaN(value) && value >= 1) {
    sessionStorage.setItem("startNumber", value);
    renderMessages();
  }
}

// 初期化時に startNumberInput に保存値を反映
document.addEventListener("DOMContentLoaded", () => {
  const stored = sessionStorage.getItem("startNumber");
  if (stored) {
    document.getElementById("startNumberInput").value = stored;
  }
});

function editMessage() {
  const startNumber = parseInt(sessionStorage.getItem("startNumber") || "1");
  const editIndex = parseInt(document.getElementById("edit-index").value) - startNumber;
  const editHandleInput = document.getElementById("edit-handle").value;
  const anonVal = document.getElementById("anon-extra").value || "";
  const editText = document.getElementById("edit-text").value.replace(/\n/g, "<br>") + "<br>";

  const messages = JSON.parse(sessionStorage.getItem("messages") || "[]");

  if (editIndex >= 0 && editIndex < messages.length) {
    const original = messages[editIndex];
    const newHandle = editHandleInput.trim() === "" ? original.handle : editHandleInput;
    
    messages[editIndex] = {
      handle: newHandle,
      text: editText
    };
    sessionStorage.setItem("messages", JSON.stringify(messages));
    renderMessages(false);
  } else {
    alert("該当の投稿はありません");
  }

  // 🔽 入力欄の初期化
  document.getElementById("edit-index").value = "";
  document.getElementById("edit-handle").value = "";
  document.getElementById("edit-text").value = "";
}


function insertMessage() {
  const startNumber = parseInt(sessionStorage.getItem("startNumber") || "1");
  const insertIndexRaw = parseInt(document.getElementById("insert-index").value);
  const insertIndex = insertIndexRaw - startNumber;
  const anonVal = document.getElementById("anon-extra").value || "";
  const handle = document.getElementById("insert-handle").value || "名無しの" + anonVal;
  const text = document.getElementById("insert-text").value.replace(/\n/g, "<br>") + "<br>";

  const messages = JSON.parse(sessionStorage.getItem("messages") || "[]");

  if (insertIndex >= 0 && insertIndex <= messages.length) {
    messages.splice(insertIndex, 0, { handle, text });
    sessionStorage.setItem("messages", JSON.stringify(messages));
    renderMessages(false); // 自動スクロールしない
  } else {
    alert("該当の挿入位置が無効です");
  }

  // フォーム初期化
  document.getElementById("insert-index").value = "";
  document.getElementById("insert-handle").value = "";
  document.getElementById("insert-text").value = "";
}


window.addEventListener("DOMContentLoaded", () => {
  renderMessages();
    //トグルボタン機能---------------------------------
    const enterToggle = document.getElementById("enter-toggle");
    const textInput = document.getElementById("text-input");

    textInput.addEventListener("keydown", function (e) {
    if (enterToggle.checked && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        document.getElementById("post-button").click();
    }
    });

    // 初期化：ローカルストレージから復元
    window.addEventListener("DOMContentLoaded", () => {
    const enterState = sessionStorage.getItem("enterToggle");
    if (enterState === "true") {
        document.getElementById("enter-toggle").checked = true;
    }
    });

    // 状態が変わったとき保存
    document.getElementById("enter-toggle").addEventListener("change", (e) => {
    sessionStorage.setItem("enterToggle", e.target.checked);
    });
    //トグルボタン機能--------------------------------
});

function insertQuote() {
  const textInput = document.getElementById("text-input");
  const cursorPos = textInput.selectionStart;
  const text = textInput.value;
  const before = text.substring(0, cursorPos);
  const after = text.substring(cursorPos);
  textInput.value = before + ">>" + after;
  textInput.focus();
  textInput.selectionEnd = cursorPos + 2; // カーソルを ">>" のあとに移動
}

function clearAllMessages() {
  const confirmed = confirm("本当に全ての投稿を削除しますか？");
  if (confirmed) {
    sessionStorage.removeItem("messages");
    renderMessages(); // 再描画
  }
}



document.addEventListener("DOMContentLoaded", () => {
  const handleInput = document.getElementById("handle");
  const textInput = document.getElementById("text-input");
  const enterToggle = document.getElementById("enter-toggle");
  const anonInput = document.getElementById("anon-extra");
  const koteFields = ['kote1', 'kote2', 'kote3', 'kote4'];
  const logBox = document.getElementById("log");

  // 投稿表示
  renderMessages();

    // 初期化：常に名無しの〇〇でHN欄を上書き
    const savedAnon = sessionStorage.getItem("anonExtra") || "";
    anonInput.value = savedAnon;
    handleInput.value = "名無しの" + savedAnon;
    sessionStorage.setItem("handle", "名無しの" + savedAnon);

    // anon-extraを変更したらリアルタイム反映（常に反映）
    anonInput.addEventListener("input", () => {
    const anonVal = anonInput.value;
    sessionStorage.setItem("anonExtra", anonVal);
    handleInput.value = "名無しの" + anonVal;
    sessionStorage.setItem("handle", "名無しの" + anonVal);
    });

    window.setKotehan = function (id) {
    const value = document.getElementById(id).value;
    if (value.trim() !== "") {
        document.getElementById("handle").value = value;

        // 保存しない！次の投稿でリセットされるようにする
        // sessionStorage.setItem("handle", value); ←これを削除またはコメントアウト
    }
    };



  // コテハン欄の保存（ページ読み込み時に内容だけ復元）
  koteFields.forEach(id => {
    const saved = sessionStorage.getItem(id);
    if (saved) document.getElementById(id).value = saved;
  });


  // Enterトグル復元
  const enterState = sessionStorage.getItem("enterToggle");
  if (enterState === "true") enterToggle.checked = true;

  // Enterトグル状態保存
  enterToggle.addEventListener("change", (e) => {
    sessionStorage.setItem("enterToggle", e.target.checked);
  });

  // Enterキーによる投稿
  textInput.addEventListener("keydown", function (e) {
    if (enterToggle.checked && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("post-button").click();
    }
  });

  // 自動スクロール
  logBox.scrollTop = logBox.scrollHeight;
  textInput.focus();
});