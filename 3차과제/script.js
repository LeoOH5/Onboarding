const state = {
  todos: [],
  idseq: 1,
};

const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const counter = document.getElementById("counter");

function autosizeTextarea(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 280) + "px";
}
input.addEventListener("input", () => autosizeTextarea(input));

input.addEventListener("keydown", (e) => {
  if (e.isComposing) return;
  if (e.key === "Enter") {
    if (e.shiftKey) {
      return;
    } else {
      e.preventDefault();
      handleAdd();
    }
  }
});

addBtn.addEventListener("click", handleAdd);

function handleAdd() {
  const raw = (input.value || "").trim();
  if (!raw) {
    input.focus();
    return;
  }
  state.todos.push({
    id: state.idseq++,
    text: raw,
    done: false,
    createdAt: Date.now(),
  });
  input.value = "";
  autosizeTextarea(input);
  render();
  input.focus();
}
function nl2br(str) {
  return str.replace(/\n/g, "<br>");
}

function render() {
  counter.textContent = state.todos.length + "개";
  list.innerHTML = state.todos
    .map((t) => {
      const created = new Date(t.createdAt).toLocaleString();
      return `
    <li class="item ${t.done ? "done" : ""}" data-id="${t.id}">
      <input class="check" type="checkbox" ${
        t.done ? "checked" : ""
      } aria-label="완료 여부" />
      <div class="main">
        <div class="content"><p>${nl2br(escapeHtml(t.text))}</p></div>
        <div class="meta">${created}</div>
      </div>
      <div class="actions">
        <button class="btn ghost edit">수정</button>
        <button class="btn danger delete">삭제</button>
      </div>
    </li>`;
    })
    .join("");
}
function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c])
  );
}

list.addEventListener("click", (e) => {
  const itemEl = e.target.closest(".item");
  if (!itemEl) return;
  const id = Number(itemEl.dataset.id);
  const todo = state.todos.find((t) => t.id === id);
  if (!todo) return;

  if (e.target.matches(".delete")) {
    state.todos = state.todos.filter((t) => t.id !== id);
    render();
    return;
  }

  if (e.target.matches(".edit")) {
    enterEditMode(itemEl, todo);
    return;
  }
});

list.addEventListener("change", (e) => {
  const itemEl = e.target.closest(".item");
  if (!itemEl) return;
  if (e.target.matches(".check")) {
    const id = Number(itemEl.dataset.id);
    const todo = state.todos.find((t) => t.id === id);
    if (!todo) return;
    todo.done = !!e.target.checked;
    render();
  }
});

function enterEditMode(itemEl, todo) {
  const main = itemEl.querySelector(".main");
  const actions = itemEl.querySelector(".actions");
  const oldHtml = main.innerHTML;
  main.dataset.old = oldHtml;

  main.innerHTML = `
  <textarea class="edit-area" aria-label="할 일 수정">${todo.text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")}</textarea>
`;
  actions.innerHTML = `
  <button class="btn primary save">저장</button>
  <button class="btn ghost cancel">취소</button>
`;

  const ta = main.querySelector(".edit-area");
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);

  ta.addEventListener("keydown", (e) => {
    if (e.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitEdit(itemEl, todo, ta.value.trim());
    }
  });

  actions.querySelector(".save").addEventListener("click", () => {
    commitEdit(itemEl, todo, ta.value.trim());
  });
  actions.querySelector(".cancel").addEventListener("click", () => {
    main.innerHTML = oldHtml;
    actions.innerHTML = `
    <button class="btn ghost edit">수정</button>
    <button class="btn danger delete">삭제</button>
  `;
  });
}

function commitEdit(itemEl, todo, newText) {
  if (!newText) {
    // 빈 값이면 삭제 여부 확인
    if (confirm("내용이 비어 있습니다. 이 할 일을 삭제할까요?")) {
      state.todos = state.todos.filter((t) => t.id !== todo.id);
    }
  } else {
    todo.text = newText;
  }
  render();
}

render();
