const form = document.getElementById("lunchForm");
const spicy = document.getElementById("spicy");
const budget = document.getElementById("budget");
const budgetNow = document.getElementById("budgetNow");
const result = document.getElementById("result");
const foodError = document.getElementById("foodError");
const moodInput = document.getElementById("mood");
const moodError = document.getElementById("moodError");
const apiBtn = document.getElementById("apiBtn");
const resetBtn = document.getElementById("resetBtn");

const formatKRW = (n) => n.toLocaleString("ko-KR");
const syncBudgetText = () =>
  (budgetNow.textContent = formatKRW(Number(budget.value)));
budget.addEventListener("input", syncBudgetText);
syncBudgetText();

const getSelectedFood = () => {
  const picked = document.querySelector('input[name="food"]:checked');
  return picked ? picked.value : "";
};
function validateInputs() {
  let ok = true;
  if (!getSelectedFood()) {
    foodError.hidden = false;
    ok = false;
  } else {
    foodError.hidden = true;
  }
  if (!moodInput.value.trim()) {
    moodError.hidden = false;
    ok = false;
  } else {
    moodError.hidden = true;
  }
  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateInputs()) {
    alert("입력값을 확인해주세요. (음식 종류 / 오늘의 기분)");
    return;
  }
  const data = {
    spicy: spicy.value,
    budget: Number(budget.value),
    food: getSelectedFood(),
    mood: moodInput.value.trim(),
  };
  alert("추천을 준비중입니다! 콘솔을 확인하세요 :)");
  console.log("[USER INPUT]", data);
  result.textContent = `맵기: ${data.spicy} / 예산: ₩${formatKRW(
    data.budget
  )} / 음식: ${data.food} / 기분: ${data.mood}`;
});

resetBtn.addEventListener("click", () => {
  form.reset();
  syncBudgetText();
  foodError.hidden = true;
  moodError.hidden = true;
  result.textContent = "초기화했습니다. 새로 입력해보세요!";
});

const BASE = "https://6863bafe88359a373e960f61.mockapi.io";
const ENDPOINT = "/sparta/web/lunch";
apiBtn?.addEventListener("click", fetchLatestName);
async function fetchLatestName() {
  try {
    const url = `${BASE}${ENDPOINT}?page=1&limit=1&sortBy=createdAt&order=desc`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API 오류: " + res.status);
    const arr = await res.json();
    if (Array.isArray(arr) && arr.length > 0) {
      alert(`가장 최근 name: ${arr[0]?.name ?? "(name 없음)"}`);
    } else {
      alert("데이터가 없습니다. mockapi.io에서 항목을 먼저 생성하세요.");
    }
  } catch (err) {
    console.error(err);
    alert("API 호출 중 오류. 콘솔을 확인하세요.");
  }
}
