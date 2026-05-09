const GOOGLE_API_KEY = "YOUR_API_KEY_HERE";
const KNOWN_DAPPS = {
  "jup.ag": {
    name: "Jupiter",
    explanation: "You're on Jupiter, Solana's most popular token swap. Before you hit that swap button, check your slippage setting. If it's set above 1%, you could receive way less than expected. Also, always verify the token you're buying has a ✓ verified badge. Scammers create fake tokens with identical names to steal your funds.",
    safety: "safe",
    safety_message: "Jupiter is legit and widely trusted — but always double-check the token address before swapping."
  },
  "magiceden.io": {
    name: "Magic Eden",
    explanation: "You're on Magic Eden, Solana's biggest NFT marketplace. Before buying anything, check if the collection has a blue verified checkmark. Unverified collections can be copycats of popular projects. Also watch the royalty percentage, some collections take 10%+ on every resale, which eats into your profit if you plan to flip.",
    safety: "safe",
    safety_message: "Magic Eden is a legitimate marketplace, but always verify the collection before buying."
  },
  "raydium.io": {
    name: "Raydium",
    explanation: "You're on Raydium, a decentralized exchange on Solana. If you're adding liquidity, be aware of impermanent loss. That means if the price of your tokens changes while they're in the pool, you could end up with less value than if you'd just held them. Only provide liquidity with tokens you're comfortable holding long term.",
    safety: "warning",
    safety_message: "Raydium is legitimate but DeFi carries real financial risk, read every detail before confirming."
  },
  "orca.so": {
    name: "Orca",
    explanation: "You're on Orca, a decentralized exchange known for its concentrated liquidity pools called Whirlpools. If you're entering a Whirlpool position, you're providing liquidity within a specific price range, if the price moves outside that range, you stop earning fees and face impermanent loss. Set your range carefully and only invest what you can afford to lose.",
    safety: "safe",
    safety_message: "Orca is a reputable Solana DEX, but Whirlpool positions require careful price range management."
  },
  "phantom.app": {
    name: "Phantom Wallet",
    explanation: "You're on the official Phantom website. One critical thing every Solana user must know, your seed phrase is the master key to everything in your wallet. No legitimate support team, no dApp, no Discord admin will ever ask for it. If anyone asks for your seed phrase for any reason, it is always a scam. Screenshot this and remember it.",
    safety: "safe",
    safety_message: "This is the official Phantom site, safe to visit. Never enter your seed phrase anywhere online."
  }
};

function show(id) {
  ["idle", "loading", "result", "error"].forEach(s => {
    document.getElementById(s).style.display = s === id ? "block" : "none";
  });
}

function getSiteName(url) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url; }
}

function matchKnownDapp(hostname) {
  for (const key of Object.keys(KNOWN_DAPPS)) {
    if (hostname.includes(key)) return KNOWN_DAPPS[key];
  }
  return null;
}

async function analyzeWithAI(pageContent) {
  const prompt = `You are Solpal, a friendly AI assistant that helps beginners stay safe on Solana dApps.
Analyze this page and respond ONLY in this exact JSON format, no other text:

{
  "explanation": "2-3 sentences. Talk like a smart friend — not a dictionary. Tell the user the ONE specific thing they should know right now that could save them from a mistake or help them use this page better. Be direct and practical.",
  "safety": "safe",
  "safety_message": "One short sentence. Is this page safe? Flag anything suspicious."
}

Safety must be exactly one of: "safe", "warning", or "danger"

Page content:
${pageContent}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 500 }
      })
    }
  );

  const data = await response.json();
  const raw = data.candidates[0].content.parts[0].text.trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function renderResult(siteName, result) {
  document.getElementById("siteName").textContent = siteName;
  document.getElementById("explanation").textContent = result.explanation;

  const badge = document.getElementById("safetyBadge");
  if (result.safety === "safe") {
    badge.className = "safety-safe";
    badge.innerHTML = "✓ " + result.safety_message;
  } else if (result.safety === "warning" || result.safety === "warn") {
    badge.className = "safety-warn";
    badge.innerHTML = "⚠ " + result.safety_message;
  } else {
    badge.className = "safety-danger";
    badge.innerHTML = "✕ " + result.safety_message;
  }

  show("result");
}

async function analyzePage() {
  show("loading");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url || "";
    const hostname = getSiteName(url);

    // Known dApps — instant sharp response
    const known = matchKnownDapp(hostname);
    if (known) {
      setTimeout(() => renderResult(known.name, known), 1400);
      return;
    }

    // Unknown site — try live AI
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const title = document.title || "";
          const url = window.location.href;
          const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
            .map(h => h.innerText.trim()).filter(Boolean).slice(0, 8).join(" | ");
          const buttons = Array.from(document.querySelectorAll("button, [role='button']"))
            .map(b => b.innerText.trim()).filter(Boolean).slice(0, 10).join(", ");
          const bodyText = document.body.innerText.slice(0, 1500);
          return { title, url, headings, buttons, bodyText };
        }
      });

      const { title, url: pageUrl, headings, buttons, bodyText } = results[0].result;
      const pageContent = `URL: ${pageUrl}\nTitle: ${title}\nHeadings: ${headings}\nButtons: ${buttons}\nContent: ${bodyText}`;
      const result = await analyzeWithAI(pageContent);
      renderResult(hostname, result);

    } catch {
      // Fallback for unknown sites
      renderResult(hostname, {
        explanation: "This doesn't look like a known Solana dApp. If someone sent you this link or asked you to connect your wallet here, be very careful. Scammers create fake versions of popular sites to steal your funds.",
        safety: "danger",
        safety_message: "Unrecognized site — do NOT connect your wallet until you verify this URL carefully."
      });
    }

  } catch (err) {
    console.error(err);
    show("error");
  }
}

document.getElementById("analyzeBtn").addEventListener("click", analyzePage);
document.getElementById("againBtn").addEventListener("click", () => show("idle"));
document.getElementById("errorBtn").addEventListener("click", () => show("idle"));
