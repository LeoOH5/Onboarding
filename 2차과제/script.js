const list = document.getElementById("stack-list");
const input = document.getElementById("stack-input");
const addBtn = document.getElementById("add-stack-btn");

const makeItem = (text) => {
  const li = document.createElement("li");
  li.textContent = text;
  return li;
};

addBtn.addEventListener("click", () => {
  const val = (input.value || "").trim();
  if (!val) {
    input.focus();
    return;
  }
  list.appendChild(makeItem(val));
  input.value = "";
  input.focus();
});
