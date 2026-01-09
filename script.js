// ===== LOAD SAVED DATA =====
console.log("JS loaded");
console.log("ethereum:", window.ethereum);


let userAddress = null;
const walletStatus = document.getElementById("walletStatus");

let isFlipping = false;
const coinText = document.getElementById("coinText");

coinText.innerText = "FLIP";


let coins = parseInt(localStorage.getItem("coins")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastLogin = localStorage.getItem("lastLogin") || null;

const coinsEl = document.getElementById("coins");
const streakEl = document.getElementById("streak");
const resultEl = document.getElementById("result");
const coinEl = document.getElementById("coin");

coinsEl.innerText = coins;
streakEl.innerText = streak;

// ===== START GAME BUTTON =====
document.getElementById("connectBtn").onclick = async () => {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return;
  }

  // 1️⃣ Connect wallet
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  // 2️⃣ Try switch to Base
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x2105" }], // Base Mainnet
    });
  } catch (switchError) {
    // 3️⃣ Agar Base added nahi hai → ADD karo
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x2105",
            chainName: "Base Mainnet",
            rpcUrls: ["https://mainnet.base.org"],
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://basescan.org"],
          },
        ],
      });
    } else {
      console.error(switchError);
      alert("Network switch failed");
      return;
    }
  }

  // 4️⃣ UI update
  const userAddress = accounts[0];
  document.getElementById("walletStatus").innerText =
    "🟢 Connected (Base): " +
    userAddress.slice(0, 6) +
    "..." +
    userAddress.slice(-4);

  document.getElementById("game").style.display = "block";
  document.getElementById("connectBtn").style.display = "none";

  checkDailyLogin();
};


await window.ethereum.request({
  method: "wallet_switchEthereumChain",
  params: [{ chainId: "0x2105" }], // Base Mainnet
});






  });

  const userAddress = accounts[0];

  document.getElementById("walletStatus").innerText =
    "🟢 Connected: " +
    userAddress.slice(0, 6) +
    "..." +
    userAddress.slice(-4);

  document.getElementById("game").style.display = "block";
  document.getElementById("connectBtn").style.display = "none";
  checkDailyLogin();
};



// ===== DAILY LOGIN LOGIC =====
function checkDailyLogin() {
  const today = new Date().toDateString();

  if (lastLogin !== today) {
    if (lastLogin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLogin === yesterday.toDateString()) {
        streak += 1;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    let reward = 10;
    if (streak === 3) reward = 25;
    if (streak === 7) reward = 100;

    coins += reward;
    lastLogin = today;

    localStorage.setItem("coins", coins);
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastLogin", lastLogin);

    coinsEl.innerText = coins;
    streakEl.innerText = streak;
    resultEl.innerText = `🔥 Daily Reward: +${reward} coins`;
  }
}

// ===== COIN FLIP GAME =====
function flipCoin(choice) {
  if (isFlipping) return; // spam click off
  isFlipping = true;

  coinEl.classList.remove("flip", "win", "lose");

  // reset animation
  void coinEl.offsetWidth;
  coinEl.classList.add("flip");

  const flip = Math.random() < 0.5 ? "HEAD" : "TAIL";
  coinText.innerText = flip;

  setTimeout(() => {
    if (choice === flip) {
      coins += 10;
      resultEl.innerText = "🎉 You Win! +10 coins";
      coinEl.classList.add("win");
      document.getElementById("winSound").play();
    } else {
      resultEl.innerText = "😢 You Lose!";
      coinEl.classList.add("lose");
      document.getElementById("loseSound").play();
    }

    localStorage.setItem("coins", coins);
    coinsEl.innerText = coins;
    isFlipping = false;
  }, 600);
}


