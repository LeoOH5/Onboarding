const BASE_URL = "https://6863bafe88359a373e960f61.mockapi.io";
const MENU_ENDPOINT = "/sparta/web/lunch";

function goToMain() {
  window.location.href = "index.html";
}

function goToRegister() {
  window.location.href = "register.html";
}

function goToList() {
  window.location.href = "list.html";
}

function goToDetail(menuId) {
  window.location.href = `detail.html?id=${menuId}`;
}

function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function formatPrice(price) {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMoodEmoji(mood) {
  const moodEmojis = {
    행복: "😊",
    기쁨: "😄",
    신남: "🤩",
    만족: "😌",
    편안: "😌",
    즐거움: "😊",
    기대: "🤗",
    설렘: "🥰",
    든든: "💪",
    가볍: "🪶",
    얼큰: "🌶️",
    시원: "❄️",
    따뜻: "🔥",
    상쾌: "✨",
    달콤: "🍯",
    고소: "🥜",
    짭짤: "🧂",
    새콤: "🍋",
    달콤달콤: "🍭",
    바삭: "🍪",
    부드럽: "🍮",
    쫄깃: "🍡",
    바삭바삭: "🍿",
    촉촉: "💧",
    진한: "☕",
    깔끔: "🧼",
    풍부: "🍽️",
    향긋: "🌸",
    상큼: "🍊",
    달달: "🍰",
  };

  if (!mood) return "";

  for (const [key, emoji] of Object.entries(moodEmojis)) {
    if (mood.includes(key)) {
      return emoji;
    }
  }

  return "😊";
}

// 맵기 정도에 따른 CSS 클래스
function getSpicyClass(spicy) {
  const spicyClasses = {
    mild: "spicy-mild",
    medium: "spicy-medium",
    hot: "spicy-hot",
    fire: "spicy-fire",
  };
  return spicyClasses[spicy] || "spicy-mild";
}

// 맵기 정도 한글 변환
function getSpicyText(spicy) {
  const spicyTexts = {
    mild: "순한맛",
    medium: "중간",
    hot: "매움",
    fire: "불맛🔥",
  };
  return spicyTexts[spicy] || spicy;
}

// 음식 종류 한글 변환
function getTypeText(type) {
  const typeTexts = {
    korean: "한식",
    chinese: "중식",
    japanese: "일식",
    western: "양식",
    street: "분식",
  };
  return typeTexts[type] || type;
}

function validateMenuForm() {
  const name = document.getElementById("name");
  const spicy = document.getElementById("spicy");
  const price = document.getElementById("price");
  const type = document.getElementById("type");

  let isValid = true;

  const nameError = document.getElementById("nameError");
  if (!name.value.trim()) {
    nameError.style.display = "block";
    isValid = false;
  } else {
    nameError.style.display = "none";
  }

  const spicyError = document.getElementById("spicyError");
  if (!spicy.value) {
    spicyError.style.display = "block";
    isValid = false;
  } else {
    spicyError.style.display = "none";
  }

  const priceError = document.getElementById("priceError");
  if (!price.value || Number(price.value) <= 0) {
    priceError.style.display = "block";
    isValid = false;
  } else {
    priceError.style.display = "none";
  }

  const typeError = document.getElementById("typeError");
  if (!type.value) {
    typeError.style.display = "block";
    isValid = false;
  } else {
    typeError.style.display = "none";
  }

  return isValid;
}

async function createMenu(menuData) {
  try {
    console.log("전송할 데이터:", menuData);

    const response = await fetch(`${BASE_URL}${MENU_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("서버 응답:", errorText);
      throw new Error(
        `HTTP ${response.status}: ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("메뉴 등록 오류:", error);
    throw error;
  }
}

async function getMenuList() {
  try {
    const response = await fetch(`${BASE_URL}${MENU_ENDPOINT}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("메뉴 목록 조회 오류:", error);
    throw error;
  }
}

async function getMenuDetail(menuId) {
  try {
    const response = await fetch(`${BASE_URL}${MENU_ENDPOINT}/${menuId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("메뉴 상세 조회 오류:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const menuForm = document.getElementById("menuForm");

  if (menuForm) {
    menuForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!validateMenuForm()) {
        return;
      }

      const menuData = {
        name: document.getElementById("name").value.trim(),
        spicy: document.getElementById("spicy").value,
        price: Number(document.getElementById("price").value),
        type: document.getElementById("type").value,
        mood: document.getElementById("mood").value.trim() || "",
        description: document.getElementById("description").value.trim() || "",
        createdAt: new Date().toISOString(),
      };

      if (
        !menuData.name ||
        !menuData.spicy ||
        !menuData.price ||
        !menuData.type
      ) {
        alert("필수 필드를 모두 입력해주세요.");
        return;
      }

      try {
        const result = await createMenu(menuData);

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `
                    <div class="result success">
                        <h3>메뉴가 성공적으로 등록되었습니다!</h3>
                        <p><strong>${result.name}</strong>이(가) 등록되었습니다.</p>
                        <div style="margin-top: 16px;">
                            <button class="btn btn-primary" onclick="goToList()">목록 보기</button>
                            <button class="btn btn-secondary" onclick="goToRegister()">다른 메뉴 등록</button>
                        </div>
                    </div>
                `;
        resultDiv.style.display = "block";

        menuForm.reset();
      } catch (error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `
                     <div class="result error">
                         <h3> 메뉴 등록에 실패했습니다</h3>
                         <p>오류: ${error.message}</p>
                         <p>요청 데이터: ${JSON.stringify(
                           menuData,
                           null,
                           2
                         )}</p>
                         <button class="btn btn-primary" onclick="location.reload()">다시 시도</button>
                     </div>
                 `;
        resultDiv.style.display = "block";
      }
    });
  }
});

async function loadMenuList() {
  const loading = document.getElementById("loading");
  const tableContainer = document.getElementById("menuTable");
  const empty = document.getElementById("empty");
  const error = document.getElementById("error");
  const tableBody = document.getElementById("menuTableBody");

  loading.style.display = "block";
  tableContainer.style.display = "none";
  empty.style.display = "none";
  error.style.display = "none";

  try {
    const menus = await getMenuList();

    menus.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (menus.length === 0) {
      loading.style.display = "none";
      empty.style.display = "block";
      return;
    }
    tableBody.innerHTML = menus
      .map((menu) => {
        const moodEmoji = getMoodEmoji(menu.mood);
        const moodText = menu.mood ? `${moodEmoji} ${menu.mood}` : "-";

        return `
                <tr>
                    <td>
                        <a href="detail.html?id=${menu.id}">
                            ${menu.name}
                        </a>
                    </td>
                    <td>
                        <span class="spicy-level ${getSpicyClass(menu.spicy)}">
                            ${getSpicyText(menu.spicy)}
                        </span>
                    </td>
                    <td>${formatPrice(menu.price)}</td>
                    <td>${getTypeText(menu.type)}</td>
                    <td>${moodText}</td>
                    <td>${formatDate(menu.createdAt)}</td>
                </tr>
            `;
      })
      .join("");

    loading.style.display = "none";
    tableContainer.style.display = "block";
  } catch (error) {
    loading.style.display = "none";
    error.style.display = "block";
    console.error("메뉴 목록 로드 오류:", error);
  }
}

async function loadMenuDetail() {
  const menuId = getUrlParameter("id");
  const loading = document.getElementById("loading");
  const menuDetail = document.getElementById("menuDetail");
  const notFound = document.getElementById("notFound");
  const error = document.getElementById("error");

  if (!menuId) {
    loading.style.display = "none";
    notFound.style.display = "block";
    return;
  }

  loading.style.display = "block";
  menuDetail.style.display = "none";
  notFound.style.display = "none";
  error.style.display = "none";

  try {
    const menu = await getMenuDetail(menuId);

    document.getElementById("menuName").textContent = menu.name;

    const moodEmoji = getMoodEmoji(menu.mood);
    const moodText = menu.mood ? `${moodEmoji} ${menu.mood}` : "기분 정보 없음";
    document.getElementById("menuMood").textContent = moodText;

    const spicyElement = document.getElementById("menuSpicy");
    spicyElement.textContent = getSpicyText(menu.spicy);
    spicyElement.className = `spicy-level ${getSpicyClass(menu.spicy)}`;

    document.getElementById("menuPrice").textContent = formatPrice(menu.price);
    document.getElementById("menuType").textContent = getTypeText(menu.type);
    document.getElementById("menuCreatedAt").textContent = formatDate(
      menu.createdAt
    );
    document.getElementById("menuDescription").textContent =
      menu.description || "설명이 없습니다.";

    document.body.className = `spicy-${menu.spicy}`;

    loading.style.display = "none";
    menuDetail.style.display = "block";
  } catch (error) {
    if (error.message.includes("404")) {
      loading.style.display = "none";
      notFound.style.display = "block";
    } else {
      loading.style.display = "none";
      error.style.display = "block";
      console.error("메뉴 상세 로드 오류:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "list.html") {
    loadMenuList();
  } else if (currentPage === "detail.html") {
    loadMenuDetail();
  }
});
