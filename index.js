let heartCount = parseInt(localStorage.getItem("heartCount")) || 60;
let coins = parseInt(localStorage.getItem("coins")) || 100;
let callHistoryData = JSON.parse(localStorage.getItem("callHistory")) || [];
let copyCount = parseInt(localStorage.getItem("copyCount")) || 6;

const coinDisplay = document.getElementById("coinCount");
const callHistoryContainer = document.getElementById("callHistory");
const heartCountDisplay = document.getElementById("heartCount");
const copyCountEl = document.getElementById("copyCount");

// INITIALIZE UI
coinDisplay.innerText = coins;
heartCountDisplay.innerText = heartCount;
copyCountEl.innerText = copyCount;
renderCallHistory();

// ---------------- FAVORITE (HEART) ----------------
function toggleFavorite(button) {
  const icon = button.querySelector("i");

  if (icon.classList.contains("fas")) {
    icon.classList.remove("fas");
    icon.classList.add("far");
    heartCount--;
  } else {
    icon.classList.remove("far");
    icon.classList.add("fas");
    heartCount++;
  }

  heartCountDisplay.innerText = heartCount;
  localStorage.setItem("heartCount", heartCount);
}

// ---------------- MAKE CALL ----------------
function makeCall(serviceName, number) {
  coins = Number(coinDisplay.innerText);

  if (coins < 20) {
    alert("Not enough coins to make a call!");
    return;
  }

  coins -= 20;
  coinDisplay.innerText = coins;
  localStorage.setItem("coins", coins);

  alert(`Calling ${serviceName} at ${number}...\n20 coins have been deducted.`);

  addCallToHistory(serviceName, number);
}

// ---------------- ADD CALL HISTORY ----------------
function addCallToHistory(serviceName, number) {
  const now = new Date();
  const options = { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" };
  const timeString = now.toLocaleString("en-US", options);

  const newCall = { serviceName, number, time: timeString, duration: "0 min" };
  callHistoryData.unshift(newCall);

  localStorage.setItem("callHistory", JSON.stringify(callHistoryData));
  renderCallHistory();
}

// ---------------- RENDER CALL HISTORY ----------------
function renderCallHistory() {
  callHistoryContainer.innerHTML = "";

  callHistoryData.forEach(call => {
    const div = document.createElement("div");
    div.className = "call-history-item bg-white rounded-2xl shadow-lg p-5";
    div.innerHTML = `
        <div class="flex justify-between items-center">
            <div class="flex-1">
                <h3 class="font-bold text-gray-800 mb-1">${call.serviceName}</h3>
                <p class="text-2xl font-bold text-red-600">${call.number}</p>
                <p class="text-gray-500 text-sm">${call.time}</p>
                <p class="text-gray-400 text-xs">Duration: ${call.duration}</p>
            </div>
            <div class="flex flex-col gap-2">
                <button class="btn-primary text-white px-3 py-2 rounded-lg" onclick="copyNumber('${call.number}')">
                    <i class="far fa-copy"></i>
                </button>
                <button class="btn-success text-white px-3 py-2 rounded-lg" onclick="makeCall('${call.serviceName}', '${call.number}')">
                    <i class="fas fa-phone-alt"></i>
                </button>
            </div>
        </div>`;
    callHistoryContainer.appendChild(div);
  });
}

// ---------------- CLEAR CALL HISTORY ----------------
function clearCallHistory() {
  if (callHistoryData.length === 0) {
    alert("Call history is already empty!");
    return;
  }

  if (confirm("Are you sure you want to clear all call history?")) {
    callHistoryData = [];
    localStorage.removeItem("callHistory");
    renderCallHistory();
    alert("Call history cleared!");
  }
}

// ---------------- COPY NUMBER ----------------
function copyNumber(number) {
  navigator.clipboard.writeText(number).then(() => {
    alert(`Hotline number ${number} copied to clipboard!`);
    copyCount++;
    copyCountEl.textContent = copyCount;
    localStorage.setItem("copyCount", copyCount);
  }).catch(() => {
    alert("Failed to copy the number. Please try again.");
  });
}


