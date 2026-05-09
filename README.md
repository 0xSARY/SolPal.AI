# Solpal — Your Solana dApp Companion

> AI-powered browser extension that explains any Solana dApp in plain English and keeps you safe before you sign anything.

![Solpal](https://img.shields.io/badge/Solana-Ecosystem-9945FF?style=for-the-badge&logo=solana)
![Status](https://img.shields.io/badge/Status-MVP-14F195?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)

---

## The Problem

Web3 is still terrifying for beginners.

You land on Jupiter, Raydium, or Magic Eden — and you have no idea what you're looking at. You get a wallet signing request you don't understand. You either blindly approve it, or you abandon the app entirely.

Every AI tool built on Solana today is for **developers**. Nobody has built one for **users**.

That's Solpal.

---

## What Solpal Does

Solpal sits in your browser as an extension. Open any Solana dApp, click Solpal, and instantly get:

- **Plain English explanation** of what the page is and what you're about to do
- **Safety rating** — green, yellow, or red depending on how trustworthy the site looks
- **Actionable tips** — the one specific thing you should know right now that could save you from a costly mistake

No crypto knowledge required. No wallet needed to use Solpal itself.

---

## Demo

| dApp | What Solpal tells you |
|------|----------------------|
| Jupiter | Warns about slippage settings and fake token names before you swap |
| Magic Eden | Flags unverified collections and hidden royalty fees |
| Raydium | Explains impermanent loss in one sentence before you provide liquidity |
| Orca | Breaks down Whirlpool price ranges before you enter a position |
| Phantom | Reminds you about seed phrase safety in plain language |
| Unknown sites | Flags as dangerous and tells you not to connect your wallet |

---

## How to Install

1. Clone this repo
   ```bash
   git clone https://github.com/YOURUSERNAME/solpal.git
   ```

2. Get a free API key from [Google AI Studio](https://aistudio.google.com)

3. Open `popup.js` and replace `YOUR_API_KEY_HERE` with your key

4. Open Chrome and go to `chrome://extensions`

5. Turn on **Developer Mode** (top right toggle)

6. Click **Load unpacked** and select the `solpal` folder

7. Pin Solpal to your toolbar and visit any Solana dApp

---

## Tech Stack

- **JavaScript** — Chrome Extensions API (Manifest V3)
- **Google Gemini AI** — Page analysis and plain English explanations
- **HTML/CSS** — Extension UI
- **Chrome Scripting API** — DOM reading and page context extraction

---

## How It Works

1. User visits a Solana dApp
2. Clicks the Solpal extension icon
3. Solpal reads the page content via Chrome's scripting API
4. Sends context to Gemini AI with a Solana-specific prompt
5. AI returns a plain English explanation + safety rating
6. Solpal displays it instantly in a clean popup

---

## Roadmap

- **Highlight to ask** — draw a box around any element on screen and ask Solpal exactly what it means
- **Transaction decoder** — paste any transaction signature and get a plain English breakdown
- **Multi-chain support** — Ethereum, Base, and other EVM chains
- **Wallet integration** — real-time warnings when a signing request appears
- **Community safety database** — crowdsourced flagging of scam sites across Solana

---

## Built For

Dev3Pack Hackathon 2025 — built in 24 hours.

---

## License

MIT
