!(function () {
  "use strict";

  var PROFILE_KEY = "btc_onboarding_profile";
  var DONE_KEY = "btc_onboarding_done";

  var STARTER_CHANNELS = {
    beginner: [
      { id: "one-stop-shop", reason: "The best place to start" },
      { id: "first-purchase", reason: "Step-by-step buying guide" },
      { id: "whitepaper", reason: "The 9 pages that started it all" },
      { id: "money", reason: "Why Bitcoin is real money" },
      { id: "misconceptions-fud", reason: "Common myths debunked" },
      { id: "self-custody", reason: "How to truly own your Bitcoin" },
      { id: "elevator_pitches", reason: "Quick ways to explain Bitcoin" },
    ],
    intermediate: [
      { id: "layer-2-lightning", reason: "Instant Bitcoin payments" },
      { id: "mining", reason: "How the network is secured" },
      { id: "privacy-nonkyc", reason: "Financial sovereignty" },
      { id: "investment-strategy", reason: "DCA, HODL, and beyond" },
      { id: "evidence-against-alts", reason: "Why Bitcoin, not crypto" },
      { id: "history", reason: "How it all began" },
    ],
    advanced: [
      { id: "maximalism", reason: "The Bitcoin-only thesis" },
      { id: "cryptography", reason: "SHA-256 and elliptic curves" },
      { id: "developers", reason: "Build on Bitcoin" },
      { id: "pow-vs-pos", reason: "Why proof of work wins" },
      { id: "nodes", reason: "Don't trust, verify" },
      { id: "core-source-code", reason: "Bitcoin Core internals" },
    ],
  };

  var INTEREST_MAP = {
    "Why Bitcoin?": [
      "one-stop-shop",
      "money",
      "misconceptions-fud",
      "elevator_pitches",
      "orange-pilling",
      "analogies",
      "dominant",
      "faq-glossary",
      "whitepaper",
    ],
    "How to buy & use": [
      "investment-strategy",
      "self-custody",
      "apps-tools",
      "100_sats",
      "sats__or__bits",
      "swaps",
    ],
    "Security & wallets": [
      "self-custody",
      "hardware",
      "cryptography",
      "public_key_vs_private_key",
      "derivation_path",
      "utxos",
    ],
    "Lightning Network": [
      "layer-2-lightning",
      "fedi-ark",
      "lightning_node",
      "submarine_swap",
      "chaumian-mints",
    ],
    "Mining & energy": [
      "mining",
      "energy",
      "difficulty-adjustment",
      "environment___energy",
      "0_mining__hashing",
    ],
    "Privacy & freedom": [
      "privacy-nonkyc",
      "nostr",
      "coin_mixing_coinjoin_coin_control_utxo",
      "human_rights__social_justice_and_freedo",
      "peaceful",
    ],
    "History & culture": [
      "history",
      "satoshi-nakamoto",
      "fun-facts",
      "poems-stories",
    ],
    "Economics & money": [
      "money",
      "problems-of-money",
      "austrian_school_of_economics",
      "market_cap",
      "bitcoin_vs_real_estate",
    ],
    "Geopolitics & adoption": [
      "geopolitics___macroeconomics",
      "regulation",
      "news-adoption",
      "politics",
      "international",
      "predictions",
    ],
    "Technical deep dives": [
      "blockchain-timechain",
      "nodes",
      "pow-vs-pos",
      "taproot",
      "core-source-code",
      "consensus",
      "scalability",
    ],
    "Art, memes & media": [
      "art-inspiration",
      "memes-funny",
      "graphics",
      "music",
      "movies-tv",
      "videos",
      "poems-stories",
    ],
    "Books & learning": [
      "books",
      "articles-threads",
      "curriculum",
      "podcasts",
      "informational-sites",
      "research-theses",
    ],
    "Philosophy & ethics": [
      "philosophy",
      "faith___religion",
      "time_preference",
      "game_theory",
      "peace_and_anti-war",
      "feedback_loops",
    ],
    "Building & DIY": [
      "projects-diy",
      "hardware",
      "developers",
      "nodes",
      "free_and_open_source_software__foss",
      "ham_radio",
    ],
    "Bitcoin properties": [
      "scarce",
      "secure",
      "decentralized",
      "organic",
      "programmable",
      "supranational",
      "peaceful",
      "dominant",
    ],
    "Real-world use cases": [
      "use-cases",
      "jobs-earn",
      "swag-merch",
      "referral-links",
      "apps-tools",
      "layer-2-lightning",
    ],
  };

  // ---- Helpers ----
  window.getOnboardingProfile = function () {
    try {
      var s = localStorage.getItem(PROFILE_KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  };
  window.setOnboardingProfile = function (p) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      localStorage.setItem(DONE_KEY, "true");
    } catch (e) {}
  };
  window.isOnboardingComplete = function () {
    return localStorage.getItem(DONE_KEY) === "true";
  };
  window.getUserSimplificationLevel = function () {
    var p = window.getOnboardingProfile();
    if (!p) return "beginner";
    var v = [];
    try {
      v = JSON.parse(localStorage.getItem("btc_visited_channels") || "[]");
    } catch (e) {}
    if (v.length >= 15 || (v.length >= 8 && p.level !== "beginner"))
      return "full";
    return p.level || "beginner";
  };

  // ---- Two-Step Onboarding Wizard ----
  // Step 1: Welcome + pick level
  // Step 2: Interest picker (optional) — highlights channels for you
  window.showOnboardingWizard = function () {
    if (window._directLinkMode) return false;
    if (window.isOnboardingComplete()) return false;
    var visited = [];
    try {
      visited = JSON.parse(
        localStorage.getItem("btc_visited_channels") || "[]",
      );
    } catch (e) {}
    if (visited.length >= 3) {
      window.setOnboardingProfile({
        level: "intermediate",
        interests: [],
        skipped: true,
      });
      return false;
    }
    var hash = window.location.hash.replace("#", "");
    if (!hash && typeof _parseCleanUrl === "function")
      hash = _parseCleanUrl() || "";
    if (hash && hash.length > 0) {
      window.setOnboardingProfile({
        level: "intermediate",
        interests: [],
        skipped: true,
        directLink: hash,
      });
      return false;
    }

    var overlay = document.createElement("div");
    overlay.id = "onboardingOverlay";
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:#020617;display:flex;flex-direction:column;align-items:center;padding:20px;font-family:inherit;overflow-y:auto;-webkit-overflow-scrolling:touch;justify-content:flex-start;padding-top:30px;";

    var state = { step: 0, level: null, interests: [] };

    var ALL_INTEREST_TOPICS = [
      {
        label: "Why Bitcoin?",
        emoji: "❓",
        levels: ["beginner", "intermediate"],
      },
      {
        label: "How to buy & use",
        emoji: "🛒",
        levels: ["beginner", "intermediate"],
      },
      {
        label: "Security & wallets",
        emoji: "🔑",
        levels: ["beginner", "intermediate", "advanced"],
      },
      {
        label: "Lightning Network",
        emoji: "⚡",
        levels: ["beginner", "intermediate", "advanced"],
      },
      {
        label: "Mining & energy",
        emoji: "⛏️",
        levels: ["intermediate", "advanced"],
      },
      {
        label: "Privacy & freedom",
        emoji: "🕵️",
        levels: ["intermediate", "advanced"],
      },
      {
        label: "History & culture",
        emoji: "📜",
        levels: ["beginner", "intermediate"],
      },
      {
        label: "Economics & money",
        emoji: "💰",
        levels: ["beginner", "intermediate", "advanced"],
      },
      {
        label: "Geopolitics & adoption",
        emoji: "🌍",
        levels: ["intermediate", "advanced"],
      },
      { label: "Technical deep dives", emoji: "🔧", levels: ["advanced"] },
      {
        label: "Art, memes & media",
        emoji: "🎨",
        levels: ["beginner", "intermediate"],
      },
      {
        label: "Books & learning",
        emoji: "📚",
        levels: ["beginner", "intermediate", "advanced"],
      },
      {
        label: "Philosophy & ethics",
        emoji: "🍎",
        levels: ["intermediate", "advanced"],
      },
      { label: "Building & DIY", emoji: "🔨", levels: ["advanced"] },
      {
        label: "Bitcoin properties",
        emoji: "₿",
        levels: ["beginner", "intermediate", "advanced"],
      },
      {
        label: "Real-world use cases",
        emoji: "✅",
        levels: ["beginner", "intermediate", "advanced"],
      },
    ];

    function getTopicsForLevel(level) {
      return ALL_INTEREST_TOPICS.filter(function (t) {
        return t.levels.indexOf(level || "beginner") !== -1;
      });
    }

    function finish(level, interests) {
      window.setOnboardingProfile({
        level: level || "beginner",
        interests: interests || [],
        completedAt: Date.now(),
      });

      // Auto-submit to buddy pool if user opted in
      if (state.buddyRole) {
        _submitBuddyFromOnboarding(level || "beginner", state.buddyRole);
      }

      overlay.style.transition = "opacity 0.4s";
      overlay.style.opacity = "0";
      setTimeout(function () {
        overlay.remove();
        if (typeof window.applySimplifiedHome === "function")
          window.applySimplifiedHome();
        // Show the Quest Guide after onboarding
        if (typeof window.showGuide === "function") {
          setTimeout(function () {
            window.showGuide();
          }, 500);
        }
      }, 400);
    }

    window._submitBuddyFromOnboarding = function (level, goal) {
      // Delay to let auth settle
      setTimeout(function () {
        if (
          typeof firebase === "undefined" ||
          !firebase.auth ||
          !firebase.firestore
        )
          return;
        var _auth = firebase.auth();
        var doSubmit = function () {
          var user = _auth.currentUser;
          if (!user) return;
          var _db = firebase.firestore();
          var uid = user.uid;
          var username =
            typeof currentUser !== "undefined" &&
            currentUser &&
            currentUser.username
              ? currentUser.username
              : "New Bitcoiner";
          var tz =
            Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
          var isAnon = user.isAnonymous;

          // If anonymous, save preference locally — match when they sign up
          if (isAnon) {
            localStorage.setItem(
              "btc_buddy_pending",
              JSON.stringify({ level: level, goal: goal, tz: tz }),
            );
            if (typeof showToast === "function")
              showToast(
                "🤝 Buddy preference saved! Sign up to get matched with a " +
                  (goal === "learn" ? "teacher" : "learner") +
                  ".",
                6000,
              );
            return;
          }

          // Real user — search pool for complement
          _db
            .collection("buddy_pool")
            .limit(50)
            .get()
            .then(function (snap) {
              var match = null;
              var complementaryGoal = goal === "learn" ? "teach" : "learn";
              snap.forEach(function (doc) {
                var d = doc.data();
                if (!match && d.uid !== uid && d.goal === complementaryGoal) {
                  match = { id: doc.id, data: d };
                }
              });

              if (match) {
                // Instant match!
                _db.collection("buddy_pool").doc(match.id).delete();
                var matchDoc = {
                  user1: {
                    uid: uid,
                    username: username,
                    level: level,
                    goal: goal,
                  },
                  user2: {
                    uid: match.data.uid,
                    username: match.data.username,
                    level: match.data.level,
                    goal: match.data.goal,
                  },
                  matchedAt: firebase.firestore.FieldValue.serverTimestamp(),
                  tz1: tz,
                  tz2: match.data.tz || "Unknown",
                };
                _db.collection("buddy_matches").add(matchDoc);

                // Award points to both
                if (typeof awardPoints === "function")
                  awardPoints(20, "🤝 Bitcoin Buddy match!");

                // Notify BOTH users
                if (typeof sendNotification === "function") {
                  sendNotification(
                    match.data.uid,
                    "buddy",
                    "🤝 You've been matched with @" +
                      username +
                      "! Check your DMs to start learning together.",
                    "buddy_match",
                    null,
                  );
                }
                _db
                  .collection("notifications")
                  .add({
                    recipientId: uid,
                    senderId: "system",
                    senderName: "Nacho 🦌",
                    type: "buddy",
                    message:
                      "🤝 You've been matched with @" +
                      match.data.username +
                      "! Check your DMs.",
                    read: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  })
                  .catch(function () {});

                if (typeof showToast === "function")
                  showToast(
                    "🤝 Buddy matched with " +
                      (typeof escapeHtml === "function"
                        ? escapeHtml(match.data.username || "")
                        : (match.data.username || "")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")) +
                      "! Opening DMs...",
                    6000,
                  );

                // Create a DM conversation with a Nacho welcome message
                var convoId = [uid, match.data.uid].sort().join("_");
                var convoData = {
                  participants: [uid, match.data.uid],
                  lastMessage:
                    "🦌 Hey! I'm Nacho, and I matched you two as Bitcoin Buddies! " +
                    username +
                    " wants to " +
                    goal +
                    " and " +
                    match.data.username +
                    " wants to " +
                    match.data.goal +
                    '. Ask me anything about Bitcoin right here — just type "Hey Nacho" and I\'ll help! Have fun learning together! 🧡',
                  lastMessageTime:
                    firebase.firestore.FieldValue.serverTimestamp(),
                  lastSenderUid: "nacho",
                  isBuddyMatch: true,
                };
                convoData.participantNames = {};
                convoData.participantNames[uid] = username;
                convoData.participantNames[match.data.uid] =
                  match.data.username;
                var convoRef = _db.collection("dm_conversations").doc(convoId);
                convoRef
                  .set(convoData, { merge: true })
                  .then(function () {
                    // Add Nacho's welcome message
                    return convoRef.collection("messages").add({
                      senderUid: "nacho",
                      senderName: "Nacho 🦌",
                      text:
                        "🦌 Hey! I'm Nacho, and I matched you two as Bitcoin Buddies!\n\n" +
                        "👤 @" +
                        username +
                        " wants to " +
                        goal +
                        "\n" +
                        "👤 @" +
                        match.data.username +
                        " wants to " +
                        match.data.goal +
                        "\n\n" +
                        'Ask me anything about Bitcoin right here — just start your message with "Hey Nacho" and I\'ll jump in! 🧡\n\n' +
                        'Pro tip: Start with "What is Bitcoin?" if you\'re brand new, or "Explain the Lightning Network" if you want to go deeper!',
                      createdAt:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      isSystem: true,
                    });
                  })
                  .catch(function (e) {
                    console.error("[BUDDY] DM create error:", e);
                  });

                // Open DM for the current user after a delay
                setTimeout(function () {
                  if (typeof openDM === "function")
                    openDM(match.data.uid, match.data.username);
                  else if (typeof showInbox === "function") showInbox();
                }, 3000);
              } else {
                // No match — add to pool
                _db.collection("buddy_pool").add({
                  uid: uid,
                  username: username,
                  level: level,
                  goal: goal,
                  intro: "Joined via onboarding",
                  tz: tz,
                  joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
                if (typeof showToast === "function")
                  showToast(
                    "🤝 You're in the Buddy Pool! We'll notify you when a " +
                      (goal === "learn" ? "teacher" : "learner") +
                      " joins.",
                    5000,
                  );
              }
            })
            .catch(function (e) {
              console.error("[BUDDY onboarding]", e);
            });
        };

        if (_auth.currentUser) {
          doSubmit();
        } else {
          _auth
            .signInAnonymously()
            .then(function () {
              // Wait for auth state
              var unsub = _auth.onAuthStateChanged(function (u) {
                if (u) {
                  unsub();
                  doSubmit();
                }
              });
            })
            .catch(function () {});
        }
      }, 2000);
    };

    function render() {
      var html = "";

      // Step dots
      html += '<div style="display:flex;gap:8px;margin-bottom:24px;">';
      for (var d = 0; d < 2; d++) {
        var active = d === state.step;
        html +=
          '<div style="width:' +
          (active ? "24" : "8") +
          "px;height:8px;border-radius:4px;background:" +
          (d <= state.step ? "#f97316" : "#1e293b") +
          ';transition:all 0.4s;"></div>';
      }
      html += "</div>";

      html += '<div style="max-width:440px;width:100%;text-align:center;">';

      if (state.step === 0) {
        // ---- STEP 1: Welcome + Level Pick ----
        html +=
          '<div style="display:flex;justify-content:center;margin-bottom:12px;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>' +
          '<h1 style="color:#fff;font-size:1.5rem;font-weight:900;margin:0 0 6px;">Welcome to Bitcoin Education</h1>' +
          '<p style="color:#94a3b8;font-size:0.92rem;line-height:1.5;margin:0 0 6px;">146 channels of organized Bitcoin knowledge. Read channels, earn XP, stack bitcoin, &amp; level up. 7 embedded mini-apps make learning about Bitcoin fun and interactive.</p>' +
          '<p style="color:#475569;font-size:0.8rem;margin:0 0 20px;">Free forever. No account needed. No ads.</p>' +
          // How it works — identical neutral cards, accent on hover only
          (function () {
            var cards = [
              {
                svg: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
                label: "READ",
                sub: "Tap a channel",
              },
              {
                svg: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
                label: "EARN",
                sub: "Get XP & badges",
              },
              {
                svg: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
                label: "LEVEL UP",
                sub: "Climb the ranks",
              },
            ];
            var row =
              '<div style="display:flex;gap:10px;margin-bottom:20px;text-align:center;">';
            cards.forEach(function (c) {
              row +=
                "<div style=\"flex:1;padding:14px 8px;background:none;border:1px solid #1e293b;border-radius:12px;color:#94a3b8;transition:border-color 0.18s,color 0.18s;\" onmouseover=\"this.style.borderColor='var(--accent)';this.style.color='var(--accent)'\" onmouseout=\"this.style.borderColor='#1e293b';this.style.color='#94a3b8'\">" +
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                c.svg +
                "</svg>" +
                '<div style="font-size:0.7rem;font-weight:800;margin-top:6px;letter-spacing:0.5px;">' +
                c.label +
                "</div>" +
                '<div style="color:#475569;font-size:0.65rem;margin-top:2px;">' +
                c.sub +
                "</div>" +
                "</div>";
            });
            return row + "</div>";
          })() +
          // Earn Real Bitcoin — quiet bordered row, accent as 2px left border only
          '<div style="background:rgba(255,255,255,0.03);border:1px solid #1e293b;border-left:2px solid var(--accent);border-radius:12px;padding:14px 16px;margin-bottom:20px;">' +
          '<div style="color:#fff;font-size:0.85rem;font-weight:800;">Earn Real Bitcoin</div>' +
          '<div style="color:#94a3b8;font-size:0.72rem;line-height:1.5;margin-top:2px;">Your XP converts to real sats. Read, learn, and claim Bitcoin directly to your Lightning wallet. 1,000 XP = 100 sats.</div>' +
          "</div>" +
          '<div style="font-size:0.7rem;color:#64748b;text-transform:uppercase;letter-spacing:1.5px;font-weight:800;margin-bottom:10px;">How deep down the rabbit hole are you?</div>';

        var levels = [
          {
            value: "beginner",
            icon: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
            label: "New to Bitcoin",
            desc: "Guided intro, buying guide, simplified experience",
          },
          {
            value: "intermediate",
            icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
            label: "I know some Bitcoin",
            desc: "Deeper topics, learning trails, dashboard & tools",
          },
          {
            value: "advanced",
            icon: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
            label: "I'm a Bitcoiner",
            desc: "Full access — Scholar Cert, Global Chat, IRL Meetups",
          },
        ];

        levels.forEach(function (lv, idx) {
          var sel = state.level === lv.value;
          html +=
            "<button onclick=\"window._obSelectLevel('" +
            lv.value +
            '\')" style="display:flex;align-items:center;gap:14px;padding:15px 10px;background:none;border:none;border-top:1px solid #1e293b;' +
            (idx === levels.length - 1
              ? "border-bottom:1px solid #1e293b;"
              : "") +
            "border-left:2px solid " +
            (sel ? "var(--accent)" : "transparent") +
            ";cursor:pointer;width:100%;text-align:left;color:" +
            (sel ? "var(--accent)" : "#e2e8f0") +
            ';font-family:inherit;transition:color 0.18s,border-color 0.18s;">' +
            '<span style="flex-shrink:0;display:flex;color:' +
            (sel ? "var(--accent)" : "#94a3b8") +
            ';"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            lv.icon +
            "</svg></span>" +
            '<div style="flex:1;"><div style="font-weight:700;font-size:0.95rem;">' +
            lv.label +
            "</div>" +
            '<div style="color:#64748b;font-size:0.78rem;margin-top:2px;">' +
            lv.desc +
            "</div></div>" +
            (sel
              ? '<span style="color:var(--accent);font-size:1.1rem;">✓</span>'
              : "") +
            "</button>";
        });

        // Buddy opt-in
        if (state.level) {
          var buddyRole = state.buddyRole || null;
          html +=
            '<div style="margin-top:16px;padding:14px 16px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);border-radius:14px;">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
            '<span style="font-size:1.2rem;">🤝</span>' +
            '<div><div style="color:#22c55e;font-size:0.8rem;font-weight:800;">Find a Bitcoin Buddy</div>' +
            '<div style="color:#64748b;font-size:0.7rem;">Get paired with ' +
            (state.level === "advanced"
              ? "a learner to mentor"
              : "an experienced Bitcoiner") +
            "</div></div>" +
            "</div>" +
            '<div style="display:flex;gap:8px;">' +
            '<button onclick="window._obBuddyRole(\'learn\')" style="flex:1;padding:10px;border-radius:10px;background:' +
            (buddyRole === "learn"
              ? "rgba(249,115,22,0.15)"
              : "rgba(255,255,255,0.03)") +
            ";border:1.5px solid " +
            (buddyRole === "learn" ? "#f97316" : "#1e293b") +
            ";color:" +
            (buddyRole === "learn" ? "#f97316" : "#94a3b8") +
            ';font-size:0.8rem;font-weight:700;cursor:pointer;font-family:inherit;transition:0.2s;">📖 I want to learn</button>' +
            '<button onclick="window._obBuddyRole(\'teach\')" style="flex:1;padding:10px;border-radius:10px;background:' +
            (buddyRole === "teach"
              ? "rgba(249,115,22,0.15)"
              : "rgba(255,255,255,0.03)") +
            ";border:1.5px solid " +
            (buddyRole === "teach" ? "#f97316" : "#1e293b") +
            ";color:" +
            (buddyRole === "teach" ? "#f97316" : "#94a3b8") +
            ';font-size:0.8rem;font-weight:700;cursor:pointer;font-family:inherit;transition:0.2s;">🎓 I want to teach</button>' +
            "</div>" +
            (buddyRole
              ? '<div style="text-align:center;margin-top:6px;"><button onclick="window._obBuddyRole(null)" style="background:none;border:none;color:#475569;font-size:0.7rem;cursor:pointer;font-family:inherit;">Skip buddy matching</button></div>'
              : "") +
            "</div>";
        }

        // Continue button
        var canContinue = !!state.level;
        html +=
          '<div style="margin-top:14px;">' +
          '<button id="onboardingCTA" onclick="window._obAdvance()" ' +
          (canContinue ? "" : "disabled") +
          ' style="width:100%;padding:16px 0;background:' +
          (canContinue ? "var(--accent)" : "#1e293b") +
          ";color:" +
          (canContinue ? "#000" : "#475569") +
          ";border:none;border-radius:10px;font-size:1.05rem;font-weight:800;cursor:" +
          (canContinue ? "pointer" : "default") +
          ';font-family:inherit;transition:opacity 0.2s;">Continue</button>' +
          '<button onclick="window._obSignIn()" style="width:100%;margin-top:10px;padding:13px 0;background:none;border:1.5px solid #334155;border-radius:12px;color:#94a3b8;font-size:0.88rem;font-weight:600;cursor:pointer;font-family:inherit;">Already have an account? Sign in</button>' +
          '<button onclick="window._obSkip()" style="width:100%;margin-top:8px;padding:10px 0;background:none;border:none;color:#475569;font-size:0.78rem;cursor:pointer;font-family:inherit;">Skip — I\'ll explore on my own</button>' +
          "</div>";
      } else if (state.step === 1) {
        // ---- STEP 2: Interest Picker ----
        var intCount = state.interests.length;
        var intValid = intCount >= 3 && intCount <= 5;
        var intColor = intValid
          ? "#22c55e"
          : intCount > 5
            ? "#ef4444"
            : "#f97316";
        var intMsg =
          intCount === 0
            ? "Pick 3-5 topics"
            : intCount < 3
              ? 3 - intCount + " more needed"
              : intCount <= 5
                ? "✓ " + intCount + " selected"
                : "Max 5 — remove " + (intCount - 5);

        var step2Intro =
          state.level === "beginner"
            ? "We'll curate a beginner-friendly starting path just for you."
            : state.level === "intermediate"
              ? "We'll surface the most relevant channels and tools for you."
              : "We'll highlight the deep dives and advanced topics you care about.";

        html +=
          '<div style="font-size:3rem;margin-bottom:8px;">🎯</div>' +
          '<h1 style="color:#fff;font-size:1.4rem;font-weight:900;margin:0 0 6px;">What interests you?</h1>' +
          '<p style="color:#64748b;font-size:0.85rem;margin:0 0 6px;">' +
          step2Intro +
          "</p>" +
          '<p style="color:#475569;font-size:0.78rem;margin:0 0 6px;">Pick 3-5 topics.</p>' +
          '<div style="color:' +
          intColor +
          ';font-size:0.75rem;font-weight:700;margin-bottom:14px;">' +
          intMsg +
          "</div>" +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';

        var levelTopics = getTopicsForLevel(state.level);
        levelTopics.forEach(function (topic) {
          var sel = state.interests.indexOf(topic.label) !== -1;
          html +=
            "<button onclick=\"window._obToggleInterest('" +
            topic.label.replace(/'/g, "\\'") +
            '\')" style="padding:9px 14px;border-radius:20px;background:' +
            (sel ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)") +
            ";border:1.5px solid " +
            (sel ? "#f97316" : "#1e293b") +
            ";color:" +
            (sel ? "#f97316" : "#e2e8f0") +
            ';cursor:pointer;font-size:0.82rem;font-weight:600;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;gap:5px;">' +
            topic.emoji +
            " " +
            topic.label +
            "</button>";
        });

        html +=
          "</div>" +
          '<div style="margin-top:18px;">' +
          '<button onclick="window._obFinishWithInterests()" ' +
          (intValid ? "" : "disabled") +
          ' style="width:100%;padding:16px 0;background:' +
          (intValid ? "linear-gradient(135deg,#f97316,#ea580c)" : "#1e293b") +
          ";color:" +
          (intValid ? "#fff" : "#475569") +
          ";border:none;border-radius:14px;font-size:1.05rem;font-weight:800;cursor:" +
          (intValid ? "pointer" : "default") +
          ";font-family:inherit;box-shadow:" +
          (intValid ? "0 8px 30px rgba(249,115,22,0.3)" : "none") +
          ';transition:all 0.3s;">Start Exploring →</button>' +
          '<button onclick="window._obBack()" style="width:100%;margin-top:10px;padding:12px 0;background:none;border:1px solid #1e293b;border-radius:12px;color:#475569;font-size:0.85rem;cursor:pointer;font-family:inherit;">← Back</button>' +
          '<button onclick="window._obSkipInterests()" style="width:100%;margin-top:8px;padding:10px 0;background:none;border:none;color:#475569;font-size:0.78rem;cursor:pointer;font-family:inherit;">Skip — just show me everything</button>' +
          "</div>";
      }

      html += "</div>";
      overlay.innerHTML = html;
    }

    // Event handlers
    window._obSelectLevel = function (level) {
      state.level = level;
      render();
    };
    window._obBuddyRole = function (role) {
      state.buddyRole = role;
      render();
    };
    window._obAdvance = function () {
      if (state.level) {
        state.step = 1;
        render();
        overlay.scrollTop = 0;
      }
    };
    window._obBack = function () {
      state.step = 0;
      render();
      overlay.scrollTop = 0;
    };
    window._obToggleInterest = function (label) {
      var idx = state.interests.indexOf(label);
      if (idx !== -1) {
        state.interests.splice(idx, 1);
      } else if (state.interests.length < 5) {
        state.interests.push(label);
      }
      render();
    };
    window._obFinishWithInterests = function () {
      finish(state.level, state.interests);
    };
    window._obSkipInterests = function () {
      finish(state.level, []);
    };
    window._obSignIn = function () {
      finish("intermediate", []);
      setTimeout(function () {
        if (typeof showSignInOnly === "function") showSignInOnly();
        else if (typeof showUsernamePrompt === "function") showUsernamePrompt();
      }, 500);
    };
    window._obSkip = function () {
      finish("intermediate", []);
    };

    render();
    document.body.appendChild(overlay);
    return true;
  };

  // ---- Simplified Home (after onboarding) ----
  window.applySimplifiedHome = function () {
    var level = window.getUserSimplificationLevel();
    var profile = window.getOnboardingProfile();
    if (level === "full") return;

    // Hide elements based on level
    var hideSelectors = {
      beginner: [
        "#dailySpinBanner",
        "#progressRings",
        "#dailyChallengeCard",
        "#quoteOfDay",
        "#explorationMap",
        "#donateSection",
        '[onclick*="showSpinWheel"]',
        '[onclick*="showPricePrediction"]',
        ".desktop-only-apps",
        "#lbFloatBtn",
        "#desktopDMBtn",
        "#rankBar",
        "#activity-ticker",
        "#continueReading",
      ],
      intermediate: [
        "#dailySpinBanner",
        "#progressRings",
        "#explorationMap",
        "#activity-ticker",
      ],
      advanced: ["#dailySpinBanner"],
    };

    (hideSelectors[level] || []).forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.setAttribute("data-simplified-hidden", "true");
        el.style.display = "none";
      });
    });

    // For beginners: also hide Nacho floating sprite (less distraction)
    if (level === "beginner") {
      var nachoC = document.getElementById("nacho-container");
      if (nachoC) {
        nachoC.setAttribute("data-simplified-hidden", "true");
        nachoC.style.display = "none";
      }

      // Simplify bottom nav: only Home, Learn, Settings for first few channels
      var visited = [];
      try {
        visited = JSON.parse(
          localStorage.getItem("btc_visited_channels") || "[]",
        );
      } catch (e) {}
      if (visited.length < 5) {
        var bnavApps = document.getElementById("bnavApps");
        var bnavMsg =
          document.getElementById("bnavMsg") ||
          document.getElementById("bnavNotif");
        if (bnavApps) {
          bnavApps.setAttribute("data-simplified-hidden", "true");
          bnavApps.style.display = "none";
        }
        if (bnavMsg) {
          bnavMsg.setAttribute("data-simplified-hidden", "true");
          bnavMsg.style.display = "none";
        }
      }
    }

    // Build curated channel list
    var channels = STARTER_CHANNELS[level] || STARTER_CHANNELS.beginner;
    var curated = [];
    var seen = [];

    // Add interest-based channels — round-robin across interests for equal representation
    if (profile && profile.interests && profile.interests.length > 0) {
      var perInterest = [];
      profile.interests.forEach(function (interest) {
        perInterest.push({
          name: interest,
          channels: (INTEREST_MAP[interest] || []).slice(),
        });
      });
      // Round-robin: take 1 channel per interest at a time
      var maxPerInterest = Math.max(2, Math.ceil(8 / perInterest.length));
      var round = 0;
      while (curated.length < 8 && round < 10) {
        var added = false;
        for (var i = 0; i < perInterest.length; i++) {
          if (curated.length >= 8) break;
          var ch = null;
          while (perInterest[i].channels.length > 0) {
            var candidate = perInterest[i].channels.shift();
            if (seen.indexOf(candidate) === -1) {
              ch = candidate;
              break;
            }
          }
          if (ch) {
            seen.push(ch);
            curated.push({ id: ch, reason: perInterest[i].name });
            added = true;
          }
        }
        if (!added) break;
        round++;
      }
    }
    channels.forEach(function (ch) {
      if (seen.indexOf(ch.id) === -1 && curated.length < 8) {
        seen.push(ch.id);
        curated.push(ch);
      }
    });
    if (curated.length > 0) channels = curated;

    // Render curated section
    var home = document.getElementById("home");
    if (!home || document.getElementById("curatedStartSection")) return;

    var section = document.createElement("div");
    section.id = "curatedStartSection";
    section.style.cssText =
      "width:100%;margin:0 0 28px;text-align:left;padding-top:8px;padding-left:28px;padding-right:28px;box-sizing:border-box;";

    var visited = [];
    try {
      visited = JSON.parse(
        localStorage.getItem("btc_visited_channels") || "[]",
      );
    } catch (e) {}

    // Mission card for beginners
    var shtml = "";
    if (level === "beginner" && visited.length < 3) {
      shtml +=
        '<div style="background:linear-gradient(135deg,rgba(249,115,22,0.08),rgba(249,115,22,0.02));border:2px solid rgba(249,115,22,0.3);border-radius:16px;padding:16px 18px;margin-bottom:16px;text-align:center;">' +
        '<div style="font-size:1.8rem;margin-bottom:6px;">📖 → ⭐ → 🏆</div>' +
        '<div style="color:var(--heading);font-weight:800;font-size:0.95rem;">Read channels. Earn XP. Level up.</div>' +
        '<div style="color:var(--text-muted);font-size:0.78rem;margin-top:4px;">Tap any channel below to start your journey!</div>' +
        '<div style="margin-top:8px;display:flex;align-items:center;gap:6px;justify-content:center;">' +
        '<div style="flex:1;max-width:200px;height:6px;background:var(--border);border-radius:3px;overflow:hidden;">' +
        '<div style="height:100%;background:var(--accent);width:' +
        Math.round((visited.length / 6) * 100) +
        '%;border-radius:3px;transition:0.3s;"></div>' +
        "</div>" +
        '<span style="font-size:0.7rem;color:var(--text-faint);">' +
        visited.length +
        "/6 started</span>" +
        "</div>" +
        "</div>";
    }

    var heading =
      level === "beginner"
        ? "START HERE — tap your first channel"
        : level === "intermediate"
          ? "PICKED FOR YOU — based on your interests"
          : "DEEP CUTS — based on your interests";
    shtml +=
      '<div style="font-size:0.7rem;color:var(--text-faint);text-transform:uppercase;letter-spacing:1.5px;font-weight:800;margin-bottom:10px;">' +
      heading +
      "</div>";

    var _chIcons = {
      'one-stop-shop':         '<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>',
      'first-purchase':        '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
      'whitepaper':            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
      'money':                 '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      'misconceptions-fud':    '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      'self-custody':          '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      'elevator_pitches':      '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/>',
      'layer-2-lightning':     '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      'mining':                '<path d="M14.5 2.5l7 7-14 14-7-7 14-14z"/><line x1="7" y1="7" x2="17" y2="17"/>',
      'privacy-nonkyc':        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
      'investment-strategy':   '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
      'evidence-against-alts': '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>',
      'history':               '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      'maximalism':            '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
      'cryptography':          '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      'developers':            '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
      'pow-vs-pos':            '<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>',
      'nodes':                 '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
      'core-source-code':      '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
      'scarce':                '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      'secure':                '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      'decentralized':         '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/>',
      'organic':               '<path d="M17 8C8 10 5.9 16.17 3.82 19.56A1 1 0 0 0 5 21c7.68-4.91 11.5-9.97 12-13z"/>',
      'programmable':          '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
      'supranational':         '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
      'peaceful':              '<circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/>',
      'dominant':              '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/>',
      'use-cases':             '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
      'books':                 '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
      'videos':                '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
      'podcasts':              '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
      'articles-threads':      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
      'nostr':                 '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      'games':                 '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01M7 12h.01M17 12h.01"/>',
      'music':                 '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      'movies-tv':             '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>',
      'hardware':              '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/>',
      'apps-tools':            '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>',
      'art-inspiration':       '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
      'graphics':              '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
      'charts':                '<path d="M3 3v18h18"/><path d="M7 16l4-6 3 4 5-8"/>',
      'fun-facts':             '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
      'news-adoption':         '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/>',
      'international':         '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
      'satoshi-nakamoto':      '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      'health':                '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      'memes-funny':           '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
      'regulation':            '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      'faq-glossary':          '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      'energy':                '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      'difficulty-adjustment': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      'blockchain-timechain':  '<rect x="2" y="7" width="6" height="10" rx="1"/><rect x="9" y="4" width="6" height="16" rx="1"/><rect x="16" y="7" width="6" height="10" rx="1"/>',
      'consensus':             '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>',
      'fedi-ark':              '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      'chaumian-mints':        '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>',
      'orange-pilling':        '<circle cx="12" cy="12" r="10"/>',
      'analogies':             '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
      'swaps':                 '<path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>',
      'referral-links':        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
      'jobs-earn':             '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
      'social-media':          '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
      'swag-merch':            '<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>',
      'curriculum':            '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
      'research-theses':       '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
      'informational-sites':   '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>',
      'projects-diy':          '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      'lightning_node':        '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      'taproot':               '<path d="M17 8C8 10 5.9 16.17 3.82 19.56A1 1 0 0 0 5 21c7.68-4.91 11.5-9.97 12-13z"/>',
      'scalability':           '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>',
      'geopolitics___macroeconomics': '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>',
      'austrian_school_of_economics': '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      'environment___energy':  '<path d="M17 8C8 10 5.9 16.17 3.82 19.56A1 1 0 0 0 5 21c7.68-4.91 11.5-9.97 12-13z"/>',
      '0_mining__hashing':     '<path d="M14.5 2.5l7 7-14 14-7-7 14-14z"/>',
      'coin_mixing_coinjoin_coin_control_utxo': '<circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/>',
      'human_rights__social_justice_and_freedo': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
      'public_key_vs_private_key': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      'game_theory':           '<rect x="2" y="6" width="20" height="12" rx="2"/>',
      'time_preference':       '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      'philosophy':            '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>',
      'faith___religion':      '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
      'feedback_loops':        '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>',
      'peace_and_anti-war':    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/>',
      'submarine_swap':        '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      'free_and_open_source_software__foss': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
      'ham_radio':             '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>',
      'market_cap':            '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      'bitcoin_vs_real_estate':'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      'giga-chad':             '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
      'web5':                  '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>',
      'poems-stories':         '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
      'derivation_path':       '<path d="M5 12h14M12 5l7 7-7 7"/>',
      'utxos':                 '<rect x="2" y="7" width="6" height="10" rx="1"/><rect x="9" y="4" width="6" height="16" rx="1"/>',
      'sats__or__bits':        '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      '100_sats':              '<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>',
    };
    var _catIconPaths = {
      'Properties Layer 1': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      'Experienced Topics':  '<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>',
      'Resources':           '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
      'Additional Info':     '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
      'Referral Links':      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>',
    };
    channels.forEach(function (ch, idx) {
      var meta = typeof CHANNELS !== "undefined" ? CHANNELS[ch.id] : null;
      if (!meta) return;
      var _iconPath = _chIcons[ch.id] || (meta.cat && _catIconPaths[meta.cat]) || '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>';
      var _iconSvg = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + _iconPath + '</svg>';
      var name = ch.id.replace(/-/g, " ").replace(/\b\w/g, function (c) {
        return c.toUpperCase();
      });
      var isRead = visited.indexOf(ch.id) !== -1;
      var highlight = idx === 0 && !isRead && level === "beginner";

      shtml +=
        "<button onclick=\"go('" +
        ch.id +
        '\')" style="display:flex;align-items:center;gap:14px;padding:16px 18px;background:' +
        (highlight ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.03)") +
        ";border:" +
        (highlight
          ? "2px solid rgba(249,115,22,0.5)"
          : "1px solid var(--border)") +
        ";border-radius:14px;cursor:pointer;text-align:left;font-family:inherit;color:var(--text);width:100%;margin-bottom:8px;transition:all 0.2s;animation:obSlideIn 0.4s ease-out " +
        0.06 * idx +
        "s both;" +
        (highlight ? "box-shadow:0 0 20px rgba(249,115,22,0.15);" : "") +
        '">' +
        '<span style="width:44px;height:44px;border-radius:12px;background:rgba(247,147,26,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--accent);">' +
        _iconSvg +
        "</span>" +
        '<div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:0.92rem;letter-spacing:-0.1px;">' +
        name +
        "</div>" +
        '<div style="color:var(--text-muted);font-size:0.78rem;margin-top:3px;line-height:1.4;">' +
        (ch.reason || "") +
        "</div></div>" +
        (isRead
          ? '<span style="color:#22c55e;flex-shrink:0;display:flex;align-items:center;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>'
          : '<span style="color:var(--text-faint);flex-shrink:0;display:flex;align-items:center;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>') +
        "</button>";
    });

    // Quick action cards — level-specific
    shtml +=
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;">';
    if (level === "beginner") {
      // Beginners: First Purchase + Trails — always shown
      shtml +=
        '<div onclick="go(\'first-purchase\')" style="padding:14px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">🛒</div><div style="font-weight:700;font-size:0.78rem;color:#22c55e;margin-top:4px;">Buy Your First Bitcoin</div></div>';
      shtml +=
        '<div onclick="go(\'trails\')" style="padding:14px;background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">🦌</div><div style="font-weight:700;font-size:0.78rem;color:var(--accent);margin-top:4px;">Nacho\'s Trails</div></div>';
    } else if (level === "intermediate") {
      // Intermediate: Trails + First Purchase + Dashboard + Nacho
      shtml +=
        '<div onclick="go(\'trails\')" style="padding:14px;background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">🦌</div><div style="font-weight:700;font-size:0.78rem;color:var(--accent);margin-top:4px;">Nacho\'s Trails</div></div>';
      shtml +=
        '<div onclick="go(\'first-purchase\')" style="padding:14px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">🛒</div><div style="font-weight:700;font-size:0.78rem;color:#22c55e;margin-top:4px;">Buy Bitcoin Guide</div></div>';
      shtml +=
        '<div onclick="if(typeof toggleDashboard===\'function\')toggleDashboard()" style="padding:14px;background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">📊</div><div style="font-weight:700;font-size:0.78rem;color:#6366f1;margin-top:4px;">Bitcoin Network Metrics</div></div>';
      shtml +=
        '<div onclick="if(typeof enterNachoMode===\'function\')enterNachoMode()" style="padding:14px;background:rgba(249,115,22,0.04);border:1px dashed rgba(249,115,22,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">🦌</div><div style="font-weight:700;font-size:0.78rem;color:var(--accent);margin-top:4px;">Ask Nacho</div></div>';
    } else {
      // Advanced: Dashboard + Global Chat + Scholar Cert + IRL Meetups
      // Wrap auth-required actions to prompt sign-in
      var _obNeedAuth =
        "if(typeof auth!=='undefined'&&auth&&auth.currentUser&&!auth.currentUser.isAnonymous){";
      var _obElseSignIn =
        "}else{if(typeof showToast==='function')showToast('🔐 Sign in to access this feature');if(typeof showUsernamePrompt==='function')setTimeout(showUsernamePrompt,300);}";
      shtml +=
        '<div onclick="if(typeof toggleDashboard===\'function\')toggleDashboard()" style="padding:14px;background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">📊</div><div style="font-weight:700;font-size:0.78rem;color:#6366f1;margin-top:4px;">Bitcoin Network Metrics</div></div>';
      shtml +=
        '<div onclick="' +
        _obNeedAuth +
        "if(typeof toggleChatOverlay==='function'){var p=document.getElementById('chatOverlay');if(!p||p.style.transform==='translateY(100%)')toggleChatOverlay();}else if(typeof renderChatHub==='function')renderChatHub('global');" +
        _obElseSignIn +
        '" style="padding:14px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">🌍</div><div style="font-weight:700;font-size:0.78rem;color:#22c55e;margin-top:4px;">Global Chat</div></div>';
      shtml +=
        '<div onclick="' +
        _obNeedAuth +
        "showSettings();setTimeout(function(){showSettingsPage('scholar')},100);" +
        _obElseSignIn +
        '" style="padding:14px;background:rgba(168,85,247,0.06);border:1px solid rgba(168,85,247,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">🎓</div><div style="font-weight:700;font-size:0.78rem;color:#a855f7;margin-top:4px;">Scholar Cert</div></div>';
      shtml +=
        '<div onclick="go(\'irl-sync\')" style="padding:14px;background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.2);border-radius:12px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:1.3rem;">🤝</div><div style="font-weight:700;font-size:0.78rem;color:var(--accent);margin-top:4px;">IRL Meetups</div></div>';
    }
    shtml += "</div>";

    // Ask Nacho card (for beginners after 2 channels, skip for others who have it in grid)
    if (level === "beginner" && visited.length >= 2) {
      shtml +=
        '<div onclick="if(typeof enterNachoMode===\'function\')enterNachoMode()" style="padding:16px;background:linear-gradient(135deg,rgba(249,115,22,0.04),rgba(249,115,22,0.01));border:1px dashed rgba(249,115,22,0.2);border-radius:14px;margin-top:14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:0.2s;">' +
        '<span style="font-size:1.5rem;">🦌</span>' +
        '<div><div style="font-weight:700;font-size:0.85rem;color:var(--heading);">Ask Nacho anything</div>' +
        '<div style="color:var(--text-muted);font-size:0.75rem;margin-top:2px;">AI tutor — explains Bitcoin in plain language</div></div></div>';
    }

    section.innerHTML = shtml;
    var anchor = home.querySelector(".home-subtitle");
    if (anchor) anchor.parentNode.insertBefore(section, anchor.nextSibling);

    if (!document.getElementById("obAnimStyle")) {
      var style = document.createElement("style");
      style.id = "obAnimStyle";
      style.textContent =
        "@keyframes obSlideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }";
      document.head.appendChild(style);
    }

    // Dim the auth button for beginners
    var authBtn = document.getElementById("authBtn");
    var au = typeof auth !== "undefined" && auth && auth.currentUser;
    var isReal = au && !au.isAnonymous;
    if (authBtn && level === "beginner" && !isReal) {
      authBtn.style.background = "none";
      authBtn.style.border = "1px solid var(--border)";
      authBtn.style.color = "var(--text-muted)";
      authBtn.style.fontSize = "0.85rem";
      authBtn.style.fontWeight = "600";
      authBtn.textContent = "🔐 Create account to save progress";
    }

    // Collapse all channel categories for beginners
    if (level === "beginner") {
      document.querySelectorAll(".cat-toggle").forEach(function (el) {
        el.setAttribute("data-expanded", "false");
        var group = el.nextElementSibling;
        if (group && group.classList.contains("cat-group"))
          group.style.display = "none";
        var arrow = el.querySelector(".cat-arrow");
        if (arrow) arrow.textContent = "›";
      });
    }

    // Sponsor is now a collapsible button — no need to hide
  };

  // ---- Progressive reveal ----
  window.checkProgressiveReveal = function () {
    var v = [];
    try {
      v = JSON.parse(localStorage.getItem("btc_visited_channels") || "[]");
    } catch (e) {}

    // After 3 channels: show Nacho, Explore Apps, Chat
    if (v.length >= 3) {
      ["#nacho-container", "#bnavApps", "#bnavNotif"].forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          if (el.getAttribute("data-simplified-hidden")) {
            el.style.display = "";
            el.removeAttribute("data-simplified-hidden");
          }
        });
      });
    }

    // After 5: leaderboard, spin
    if (v.length >= 5) {
      ["#lbFloatBtn", '[onclick*="showSpinWheel"]'].forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          if (el.getAttribute("data-simplified-hidden")) {
            el.style.display = "";
            el.removeAttribute("data-simplified-hidden");
          }
        });
      });
    }

    // After 10: show everything
    if (v.length >= 10) {
      document
        .querySelectorAll("[data-simplified-hidden]")
        .forEach(function (el) {
          el.style.display = "";
          el.removeAttribute("data-simplified-hidden");
        });
    }
  };

  // ---- Progress breadcrumb ----
  window.showProgressBreadcrumb = function () {
    var home = document.getElementById("home");
    if (!home || document.getElementById("progressBreadcrumb")) return;
    var profile = window.getOnboardingProfile();
    if (!profile) return;
    var visited = [];
    try {
      visited = JSON.parse(
        localStorage.getItem("btc_visited_channels") || "[]",
      );
    } catch (e) {}
    if (visited.length >= 15) return;

    var level = profile.level || "beginner";
    var starters = STARTER_CHANNELS[level] || STARTER_CHANNELS.beginner;
    var next = null;
    for (var i = 0; i < starters.length; i++) {
      if (visited.indexOf(starters[i].id) === -1) {
        next = starters[i];
        break;
      }
    }
    if (!next) return;

    var meta = typeof CHANNELS !== "undefined" ? CHANNELS[next.id] : null;
    if (!meta) return;

    var emoji = meta.title
      ? (meta.title.match(
          /^([\u{1F000}-\u{1FFFF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]+)/u,
        ) || ["📄"])[0]
      : "📄";
    var name = next.id.replace(/-/g, " ").replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
    var done = Math.min(visited.length, starters.length);

    var bc = document.createElement("div");
    bc.id = "progressBreadcrumb";
    bc.style.cssText = "margin:0 28px 20px;cursor:pointer;";
    bc.innerHTML =
      "<div onclick=\"go('" +
      next.id +
      '\')" style="display:flex;align-items:center;gap:14px;padding:14px 18px;background:linear-gradient(135deg,rgba(249,115,22,0.06),rgba(249,115,22,0.02));border:1px solid rgba(249,115,22,0.2);border-radius:14px;transition:0.2s;">' +
      '<span style="font-size:1.4rem;width:44px;height:44px;border-radius:12px;background:rgba(249,115,22,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
      emoji +
      "</span>" +
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:0.65rem;color:var(--accent);font-weight:800;text-transform:uppercase;letter-spacing:1px;">📍 Up next for you</div>' +
      '<div style="font-weight:700;font-size:0.95rem;color:var(--heading);margin-top:2px;">' +
      name +
      "</div>" +
      '<div style="color:var(--text-muted);font-size:0.75rem;margin-top:1px;">' +
      (next.reason || "") +
      "</div>" +
      "</div>" +
      '<span style="color:var(--text-faint);font-size:1rem;flex-shrink:0;">→</span>' +
      "</div>" +
      '<div style="margin-top:8px;display:flex;align-items:center;gap:6px;">' +
      '<div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden;">' +
      '<div style="height:100%;background:var(--accent);width:' +
      Math.round((done / starters.length) * 100) +
      '%;border-radius:2px;transition:0.3s;"></div>' +
      "</div>" +
      '<span style="font-size:0.65rem;color:var(--text-faint);white-space:nowrap;">' +
      done +
      "/" +
      starters.length +
      " done</span>" +
      "</div>";

    var anchor =
      document.getElementById("curatedStartSection") ||
      home.querySelector(".home-subtitle");
    if (anchor) anchor.parentNode.insertBefore(bc, anchor.nextSibling);
  };

  // ---- Init ----
  function init() {
    window.showOnboardingWizard() || window.applySimplifiedHome();
    setTimeout(function () {
      if (typeof window.showProgressBreadcrumb === "function")
        window.showProgressBreadcrumb();
    }, 1000);

    // Wrap go() to update progressive reveal on navigation
    var origGo = window.go;
    if (typeof origGo === "function") {
      window.go = function () {
        var result = origGo.apply(this, arguments);
        setTimeout(window.checkProgressiveReveal, 1000);
        setTimeout(function () {
          var bc = document.getElementById("progressBreadcrumb");
          if (bc) bc.remove();
          if (typeof window.showProgressBreadcrumb === "function")
            window.showProgressBreadcrumb();
        }, 1200);
        return result;
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }

  console.log("[ONBOARDING] System loaded");
})();
