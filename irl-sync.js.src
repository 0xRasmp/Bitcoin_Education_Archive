/**
 * IRL Sync - Bitcoin Events & Meetups
 * Redesigned: clean dark UI, FA icons, no emoji
 */

(function() {
    const db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;
    const auth = (typeof firebase !== 'undefined') ? firebase.auth() : null;

    window.renderIRLSync = function(options = {}) {
        const container = document.getElementById('forumContainer');
        if (!container) return;

        let html = `
            <div id="irl-sync-view" style="max-width:960px;margin:0 auto;padding:32px 24px 80px;font-family:inherit;color:var(--text);">

                <!-- Nav row -->
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
                    <button onclick="goHome()" style="display:inline-flex;align-items:center;gap:7px;padding:8px 14px;background:var(--card-bg);border:1px solid var(--border);border-radius:8px;color:var(--text-muted);font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;transition:0.15s;" onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">
                        <i class="fa-solid fa-house" style="font-size:0.72rem;"></i> Home
                    </button>
                    <button onclick="showDonateModal()" style="display:inline-flex;align-items:center;gap:7px;padding:8px 14px;background:var(--card-bg);border:1px solid var(--border);border-radius:8px;color:var(--text-muted);font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;transition:0.15s;" onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">
                        <i class="fa-solid fa-bolt" style="font-size:0.72rem;color:var(--accent);"></i> Donate
                    </button>
                </div>

                <!-- Page header -->
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;gap:16px;flex-wrap:wrap;">
                    <div>
                        <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:8px;">
                            <div style="width:36px;height:36px;border-radius:10px;background:var(--accent-bg);border:1px solid var(--accent-glow);display:flex;align-items:center;justify-content:center;">
                                <i class="fa-solid fa-handshake" style="color:var(--accent);font-size:0.9rem;"></i>
                            </div>
                            <h1 style="font-size:1.75rem;font-weight:900;color:var(--heading);margin:0;letter-spacing:-0.5px;">IRL Sync</h1>
                        </div>
                        <p style="color:var(--text-muted);margin:0;font-size:0.88rem;line-height:1.5;max-width:400px;">Find Bitcoin meetups and orange-pill your local community.</p>
                    </div>
                    <button onclick="showHostEventModal()" style="display:inline-flex;align-items:center;gap:8px;padding:12px 22px;background:var(--accent);color:#fff;border:none;border-radius:12px;font-weight:700;font-size:0.88rem;cursor:pointer;font-family:inherit;transition:0.2s;white-space:nowrap;flex-shrink:0;" onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">
                        <i class="fa-solid fa-plus" style="font-size:0.75rem;"></i> Host an Event
                    </button>
                </div>

                <!-- Rules accordion -->
                <div id="irlRulesAccordion" style="background:var(--card-bg);border:1px solid var(--border);border-radius:14px;margin-bottom:20px;overflow:hidden;">
                    <button onclick="var b=document.getElementById('irlRulesBody');var arr=document.getElementById('irlRulesArrow');var open=b.style.display!=='none';b.style.display=open?'none':'block';arr.style.transform=open?'':'rotate(90deg)';" style="width:100%;display:flex;align-items:center;gap:12px;padding:16px 20px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;">
                        <i class="fa-solid fa-clipboard-list" style="color:var(--accent);font-size:0.9rem;flex-shrink:0;"></i>
                        <span style="flex:1;font-size:0.9rem;font-weight:700;color:var(--heading);">IRL Sync Rules &amp; Guidelines</span>
                        <i id="irlRulesArrow" class="fa-solid fa-chevron-right" style="color:var(--text-faint);font-size:0.65rem;transition:transform 0.2s;"></i>
                    </button>
                    <div id="irlRulesBody" style="display:none;padding:0 20px 20px;">
                        <div style="height:1px;background:var(--border);margin-bottom:16px;"></div>
                        ${_rulesHtml()}
                    </div>
                </div>

                <!-- Search bar -->
                <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:14px;padding:16px 20px;margin-bottom:32px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
                    <div style="flex:1;min-width:220px;position:relative;">
                        <i class="fa-solid fa-magnifying-glass" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-faint);font-size:0.8rem;pointer-events:none;"></i>
                        <input type="text" id="eventSearch" placeholder="Search events..." oninput="filterEvents()" style="width:100%;padding:11px 12px 11px 38px;background:var(--bg-side);border:1px solid var(--border);border-radius:10px;color:var(--text);outline:none;font-family:inherit;font-size:0.88rem;box-sizing:border-box;transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
                    </div>
                    <div style="flex:1;min-width:180px;position:relative;">
                        <i class="fa-solid fa-location-dot" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-faint);font-size:0.8rem;pointer-events:none;"></i>
                        <input type="text" id="eventLocation" placeholder="Location..." oninput="filterEvents()" style="width:100%;padding:11px 12px 11px 38px;background:var(--bg-side);border:1px solid var(--border);border-radius:10px;color:var(--text);outline:none;font-family:inherit;font-size:0.88rem;box-sizing:border-box;transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
                    </div>
                    <button onclick="filterEvents()" style="display:inline-flex;align-items:center;gap:7px;padding:11px 22px;background:var(--accent);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:0.85rem;cursor:pointer;font-family:inherit;white-space:nowrap;transition:0.2s;" onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">
                        <i class="fa-solid fa-magnifying-glass" style="font-size:0.75rem;"></i> Find Events
                    </button>
                </div>

                <!-- Section heading -->
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
                    <h2 style="font-size:1.05rem;font-weight:800;color:var(--heading);margin:0;letter-spacing:-0.2px;">
                        <i class="fa-solid fa-calendar-days" style="color:var(--accent);margin-right:8px;font-size:0.9rem;"></i>Upcoming Events
                    </h2>
                    <span id="eventCount" style="font-size:0.75rem;color:var(--text-faint);font-weight:600;"></span>
                </div>

                <!-- Event grid -->
                <div id="eventGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:20px;">
                    <div style="grid-column:1/-1;text-align:center;padding:60px 0;">
                        <i class="fa-solid fa-circle-notch fa-spin" style="font-size:1.5rem;color:var(--accent);opacity:0.6;"></i>
                        <div style="color:var(--text-faint);font-size:0.85rem;margin-top:12px;">Loading events...</div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        container.style.display = 'block';
        if (typeof setFloatingElementsVisible === 'function') setFloatingElementsVisible(true);
        loadEvents();
    };

    function _rulesHtml() {
        const rules = [
            ['fa-bitcoin-sign', 'Bitcoin-only', 'This platform is for Bitcoin meetups only. No altcoin or crypto events.'],
            ['fa-shield-halved', 'Be respectful', 'Treat all attendees with respect. No harassment or hate speech.'],
            ['fa-location-dot', 'Real locations only', 'Events must have a genuine physical location. No fake or vague entries.'],
            ['fa-clock', 'Keep it current', 'Only post upcoming events. Past events will be removed automatically.'],
            ['fa-flag', 'Report bad actors', 'Use the report button on any event that violates these guidelines.'],
        ];
        return rules.map(([icon, title, desc]) => `
            <div style="display:flex;gap:12px;margin-bottom:12px;align-items:flex-start;">
                <div style="width:30px;height:30px;border-radius:8px;background:var(--accent-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                    <i class="fa-solid ${icon}" style="color:var(--accent);font-size:0.72rem;"></i>
                </div>
                <div>
                    <div style="font-size:0.82rem;font-weight:700;color:var(--heading);margin-bottom:2px;">${title}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);line-height:1.5;">${desc}</div>
                </div>
            </div>
        `).join('');
    }

    var _allEvents = [];

    async function loadEvents() {
        const grid = document.getElementById('eventGrid');
        if (!grid || !db) return;

        try {
            const snap = await db.collection('irl_events')
                .where('date', '>=', new Date().toISOString())
                .orderBy('date', 'asc')
                .limit(30)
                .get();

            if (snap.empty) {
                _allEvents = [];
                _renderEmpty(grid);
                return;
            }

            _allEvents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            _renderGrid(_allEvents, grid);

        } catch (e) {
            console.error('IRL Sync Load Error:', e);
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-muted);font-size:0.88rem;"><i class="fa-solid fa-triangle-exclamation" style="color:var(--accent);margin-right:8px;"></i>Could not load events. Try refreshing.</div>`;
        }
    }

    window.filterEvents = function() {
        var q = (document.getElementById('eventSearch') || {}).value || '';
        var loc = (document.getElementById('eventLocation') || {}).value || '';
        var grid = document.getElementById('eventGrid');
        if (!grid) return;
        var filtered = _allEvents.filter(function(ev) {
            var matchQ = !q || (ev.title || '').toLowerCase().includes(q.toLowerCase()) || (ev.description || '').toLowerCase().includes(q.toLowerCase());
            var matchL = !loc || (ev.locationName || ev.location || '').toLowerCase().includes(loc.toLowerCase());
            return matchQ && matchL;
        });
        if (!filtered.length) { _renderEmpty(grid); return; }
        _renderGrid(filtered, grid);
    };

    function _renderEmpty(grid) {
        var countEl = document.getElementById('eventCount');
        if (countEl) countEl.textContent = '';
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;background:var(--card-bg);padding:56px 32px;border-radius:16px;border:1px dashed var(--border);">
                <div style="width:56px;height:56px;border-radius:14px;background:var(--accent-bg);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;">
                    <i class="fa-solid fa-map-pin" style="color:var(--accent);font-size:1.3rem;"></i>
                </div>
                <h3 style="color:var(--heading);margin:0 0 8px;font-size:1.05rem;">No events found</h3>
                <p style="color:var(--text-muted);margin:0 0 20px;font-size:0.85rem;line-height:1.5;">Be the first to plant a Bitcoin flag in your city.</p>
                <button onclick="showHostEventModal()" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;background:none;border:1px solid var(--accent);color:var(--accent);border-radius:10px;font-weight:700;font-size:0.82rem;cursor:pointer;font-family:inherit;transition:0.2s;" onmouseover="this.style.background='var(--accent-bg)'" onmouseout="this.style.background='none'">
                    <i class="fa-solid fa-plus" style="font-size:0.72rem;"></i> Host the First Event
                </button>
            </div>
        `;
    }

    function _renderGrid(events, grid) {
        var countEl = document.getElementById('eventCount');
        if (countEl) countEl.textContent = events.length + ' event' + (events.length !== 1 ? 's' : '');

        var uid = (auth && auth.currentUser) ? auth.currentUser.uid : '';
        grid.innerHTML = events.map(function(ev) {
            var d = new Date(ev.date);
            var dateStr = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            var timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
            var isGoing = (ev.attendees || []).indexOf(uid) !== -1;
            var count = (ev.attendees || []).length || ev.attendeesCount || 0;

            var coverBg = ev.coverUrl
                ? 'background:url(' + ev.coverUrl + ') center/cover no-repeat;'
                : 'background:linear-gradient(135deg,var(--secondary) 0%,var(--card-bg) 100%);display:flex;align-items:center;justify-content:center;';

            var coverInner = ev.coverUrl ? '' : '<i class="fa-solid fa-handshake" style="font-size:2rem;color:var(--accent);opacity:0.35;"></i>';

            return `
                <div class="irl-event-card" onclick="viewEvent('${ev.id}')" data-id="${ev.id}"
                    style="background:var(--card-bg);border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;transition:border-color 0.18s,transform 0.18s,box-shadow 0.18s;display:flex;flex-direction:column;"
                    onmouseover="this.style.transform='translateY(-3px)';this.style.borderColor='var(--accent)';this.style.boxShadow='0 8px 28px rgba(247,147,26,0.1)'"
                    onmouseout="this.style.transform='';this.style.borderColor='var(--border)';this.style.boxShadow=''">

                    <!-- Cover -->
                    <div style="height:148px;${coverBg}">${coverInner}</div>

                    <!-- Date pill -->
                    <div style="padding:14px 16px 0;">
                        <div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:var(--accent-bg);border:1px solid var(--accent-glow);border-radius:999px;margin-bottom:10px;">
                            <i class="fa-regular fa-calendar" style="color:var(--accent);font-size:0.65rem;"></i>
                            <span style="color:var(--accent);font-size:0.68rem;font-weight:800;letter-spacing:0.3px;">${dateStr} &middot; ${timeStr}</span>
                        </div>
                    </div>

                    <!-- Body -->
                    <div style="padding:0 16px 16px;flex:1;display:flex;flex-direction:column;">
                        <h3 style="font-size:0.98rem;font-weight:700;color:var(--heading);margin:0 0 8px;line-height:1.4;">${typeof escapeHtml === 'function' ? escapeHtml(ev.title) : ev.title}</h3>

                        <div style="display:flex;align-items:center;gap:6px;color:var(--text-muted);font-size:0.78rem;margin-bottom:${ev.description ? '8px' : '14px'};">
                            <i class="fa-solid fa-location-dot" style="color:var(--accent);font-size:0.7rem;flex-shrink:0;"></i>
                            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${typeof escapeHtml === 'function' ? escapeHtml(ev.locationName || 'TBD') : (ev.locationName || 'TBD')}</span>
                        </div>

                        ${ev.description ? `<div style="color:var(--text-dim);font-size:0.78rem;line-height:1.55;margin-bottom:14px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${typeof escapeHtml === 'function' ? escapeHtml(ev.description) : ev.description}</div>` : ''}

                        <!-- Footer -->
                        <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border);">
                            <div style="display:flex;align-items:center;gap:5px;color:var(--text-faint);font-size:0.75rem;">
                                <i class="fa-solid fa-user-group" style="font-size:0.68rem;"></i>
                                <span id="rsvp-count-${ev.id}">${count} attending</span>
                            </div>
                            <button id="rsvp-btn-${ev.id}" onclick="event.stopPropagation();toggleRSVP('${ev.id}')"
                                style="display:inline-flex;align-items:center;gap:5px;padding:6px 13px;background:${isGoing ? 'var(--accent)' : 'var(--secondary)'};color:${isGoing ? '#fff' : 'var(--text)'};border:1px solid ${isGoing ? 'var(--accent)' : 'var(--border)'};border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit;transition:0.15s;touch-action:manipulation;">
                                <i class="fa-solid ${isGoing ? 'fa-circle-check' : 'fa-calendar-plus'}" style="font-size:0.65rem;"></i>
                                ${isGoing ? "Going" : "RSVP"}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.toggleRSVP = async function(eventId) {
        if (!auth || !auth.currentUser || auth.currentUser.isAnonymous) {
            if (typeof showSignInPrompt === 'function') showSignInPrompt();
            else if (typeof showToast === 'function') showToast('Sign in to RSVP!');
            return;
        }
        var uid = auth.currentUser.uid;
        var btn = document.getElementById('rsvp-btn-' + eventId);
        var countEl = document.getElementById('rsvp-count-' + eventId);
        try {
            var ref = db.collection('irl_events').doc(eventId);
            var doc = await ref.get();
            if (!doc.exists) return;
            var attendees = doc.data().attendees || [];
            var isGoing = attendees.indexOf(uid) !== -1;
            if (isGoing) {
                await ref.update({ attendees: firebase.firestore.FieldValue.arrayRemove(uid) });
                if (btn) { btn.innerHTML = '<i class="fa-solid fa-calendar-plus" style="font-size:0.65rem;"></i> RSVP'; btn.style.background = 'var(--secondary)'; btn.style.color = 'var(--text)'; btn.style.borderColor = 'var(--border)'; }
                if (countEl) countEl.textContent = Math.max(0, attendees.length - 1) + ' attending';
                if (typeof showToast === 'function') showToast('RSVP removed');
            } else {
                await ref.update({ attendees: firebase.firestore.FieldValue.arrayUnion(uid) });
                if (btn) { btn.innerHTML = '<i class="fa-solid fa-circle-check" style="font-size:0.65rem;"></i> Going'; btn.style.background = 'var(--accent)'; btn.style.color = '#fff'; btn.style.borderColor = 'var(--accent)'; }
                if (countEl) countEl.textContent = (attendees.length + 1) + ' attending';
                if (typeof showToast === 'function') showToast("You're going! See you there.");
            }
        } catch(e) {
            console.error('RSVP error:', e);
            if (typeof showToast === 'function') showToast('Could not update RSVP. Try again.');
        }
    };

    function _inputStyle() {
        return 'width:100%;padding:12px 14px;background:var(--input-bg);border:1px solid var(--border);border-radius:10px;color:var(--text);outline:none;font-family:inherit;font-size:0.88rem;box-sizing:border-box;transition:border-color 0.2s;';
    }
    function _labelHtml(icon, text) {
        return `<label style="display:flex;align-items:center;gap:6px;font-size:0.7rem;font-weight:800;color:var(--text-faint);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.6px;"><i class="fa-solid ${icon}" style="color:var(--accent);font-size:0.65rem;"></i>${text}</label>`;
    }

    window.showHostEventModal = function() {
        if (!auth || !auth.currentUser) {
            if (typeof showSignInPrompt === 'function') showSignInPrompt();
            return;
        }
        var modalHtml = `
            <div id="hostEventModal" style="position:fixed;inset:0;z-index:100000;display:flex;align-items:flex-start;justify-content:center;background:rgba(0,0,0,0.78);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:20px;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                <div style="background:var(--bg-side);border:1px solid var(--border);width:100%;max-width:500px;border-radius:20px;padding:28px;position:relative;margin:auto;box-shadow:var(--shadow-lg);">
                    <button onclick="document.getElementById('hostEventModal').remove()" style="position:absolute;top:16px;right:16px;width:30px;height:30px;background:var(--secondary);border:1px solid var(--border);border-radius:7px;color:var(--text-muted);font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
                        <div style="width:36px;height:36px;border-radius:10px;background:var(--accent-bg);border:1px solid var(--accent-glow);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <i class="fa-solid fa-calendar-plus" style="color:var(--accent);font-size:0.85rem;"></i>
                        </div>
                        <div>
                            <h2 style="margin:0;color:var(--heading);font-size:1.1rem;font-weight:800;">Host an Event</h2>
                            <p style="margin:2px 0 0;color:var(--text-muted);font-size:0.76rem;">Gather your local Bitcoiners for a meetup.</p>
                        </div>
                    </div>

                    <div style="margin-bottom:14px;">
                        ${_labelHtml('fa-pen', 'Event Title')}
                        <input type="text" id="evTitle" placeholder="e.g. Satoshi's Coffee Meetup" style="${_inputStyle()}" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
                    </div>

                    <div style="margin-bottom:14px;">
                        ${_labelHtml('fa-clock', 'Date & Time')}
                        <input type="datetime-local" id="evDate" style="${_inputStyle()}" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
                    </div>

                    <div style="margin-bottom:14px;">
                        ${_labelHtml('fa-location-dot', 'Location (City, Venue)')}
                        <input type="text" id="evLoc" placeholder="e.g. Austin, TX @ The Bitcoin Commons" style="${_inputStyle()}" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
                    </div>

                    <div style="margin-bottom:14px;">
                        ${_labelHtml('fa-link', 'Link (optional)')}
                        <input type="url" id="evLink" placeholder="https://meetup.com/your-event" style="${_inputStyle()}" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
                    </div>

                    <div style="margin-bottom:14px;">
                        ${_labelHtml('fa-align-left', 'Description (optional)')}
                        <textarea id="evDesc" placeholder="What's the event about? What should attendees expect?" rows="3" maxlength="1000" style="${_inputStyle()}resize:vertical;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'"></textarea>
                        <div style="font-size:0.62rem;color:var(--text-faint);text-align:right;margin-top:3px;">Max 1000 characters</div>
                    </div>

                    <div style="margin-bottom:22px;">
                        ${_labelHtml('fa-image', 'Event Photo (optional)')}
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div id="evCoverPreview" onclick="document.getElementById('evCoverFile').click()" style="width:72px;height:72px;border-radius:12px;border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;background:var(--secondary);cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
                                <i class="fa-solid fa-camera" style="color:var(--text-faint);font-size:1.1rem;"></i>
                            </div>
                            <div style="flex:1;">
                                <input type="file" id="evCoverFile" accept="image/jpeg,image/jpg,image/png,image/webp" style="width:100%;padding:8px;background:var(--secondary);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.78rem;box-sizing:border-box;" onchange="var f=this.files[0];if(f){var r=new FileReader();r.onload=function(e){var p=document.getElementById('evCoverPreview');if(p)p.innerHTML='<img src=&quot;'+e.target.result+'&quot; style=&quot;width:100%;height:100%;object-fit:cover;&quot;>';};r.readAsDataURL(f);}">
                                <div style="font-size:0.62rem;color:var(--text-faint);margin-top:4px;">JPG, PNG, or WebP — max 3MB</div>
                            </div>
                        </div>
                    </div>

                    <button onclick="submitEvent()" id="evSubmitBtn" style="width:100%;padding:13px;background:var(--accent);color:#fff;border:none;border-radius:12px;font-weight:800;font-size:0.9rem;cursor:pointer;font-family:inherit;transition:0.2s;display:flex;align-items:center;justify-content:center;gap:8px;" onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">
                        <i class="fa-solid fa-tower-broadcast" style="font-size:0.8rem;"></i> Broadcast to Network
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    window.submitEvent = async function() {
        const title = (document.getElementById('evTitle').value || '').trim();
        const date = document.getElementById('evDate').value;
        const loc = (document.getElementById('evLoc').value || '').trim();
        const btn = document.getElementById('evSubmitBtn');

        if (!title || !date || !loc) {
            if (typeof showToast === 'function') showToast('Please fill in title, date, and location.');
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" style="font-size:0.8rem;"></i> Broadcasting...';

        try {
            var evLink = document.getElementById('evLink');
            var linkVal = evLink ? evLink.value.trim() : '';
            var coverFileInput = document.getElementById('evCoverFile');
            var coverFile = coverFileInput && coverFileInput.files && coverFileInput.files[0] ? coverFileInput.files[0] : null;

            if (coverFile) {
                if (coverFile.size > 3 * 1024 * 1024) { if (typeof showToast === 'function') showToast('Image too large. Max 3MB.'); btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-tower-broadcast" style="font-size:0.8rem;"></i> Broadcast to Network'; return; }
                if (!coverFile.type.match(/image\/(jpeg|jpg|png|webp)/)) { if (typeof showToast === 'function') showToast('Use JPG, PNG, or WebP.'); btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-tower-broadcast" style="font-size:0.8rem;"></i> Broadcast to Network'; return; }
            }

            var coverUrl = '';
            if (coverFile) {
                var storage = null;
                try { storage = firebase.storage(); } catch(e) {}
                if (storage) {
                    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" style="font-size:0.8rem;"></i> Uploading photo...';
                    var ts = Date.now();
                    var sref = storage.ref('irl-events/' + auth.currentUser.uid + '/' + ts + '_' + coverFile.name.replace(/[^a-zA-Z0-9._-]/g, '_'));
                    var snap = await sref.put(coverFile);
                    coverUrl = await snap.ref.getDownloadURL();
                } else if (coverFile.size < 200 * 1024) {
                    coverUrl = await new Promise(function(resolve) { var reader = new FileReader(); reader.onload = function(e) { resolve(e.target.result); }; reader.readAsDataURL(coverFile); });
                }
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" style="font-size:0.8rem;"></i> Broadcasting...';
            }

            var evDescEl = document.getElementById('evDesc');
            var descVal = evDescEl ? evDescEl.value.trim().substring(0, 1000) : '';
            var eventData = {
                title: title,
                date: new Date(date).toISOString(),
                location: loc,
                locationName: loc,
                hostId: auth.currentUser.uid,
                hostName: auth.currentUser.displayName || 'Anonymous Pleb',
                attendeesCount: 1,
                attendees: [auth.currentUser.uid],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (linkVal) eventData.link = linkVal;
            if (descVal) eventData.description = descVal;
            if (coverUrl) eventData.coverUrl = coverUrl;

            await db.collection('irl_events').add(eventData);
            document.getElementById('hostEventModal').remove();
            if (typeof showToast === 'function') showToast('Event published!');
            if (typeof awardPoints === 'function') awardPoints(15, 'IRL event created');
            if (typeof awardTickets === 'function') awardTickets(10, 'Event hosted');
            loadEvents();
        } catch (e) {
            if (typeof showToast === 'function') showToast('Error: ' + e.message);
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-tower-broadcast" style="font-size:0.8rem;"></i> Retry';
        }
    };

    window.viewEvent = async function(eventId) {
        if (!db) return;
        try {
            var doc = await db.collection('irl_events').doc(eventId).get();
            if (!doc.exists) { if (typeof showToast === 'function') showToast('Event not found'); return; }
            var ev = doc.data();
            var d = new Date(ev.date);
            var dateStr = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            var timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
            var esc = typeof escapeHtml === 'function' ? escapeHtml : function(s) { return s; };
            var isHost = auth && auth.currentUser && auth.currentUser.uid === ev.hostId;
            var isGoing = auth && auth.currentUser && (ev.attendees || []).indexOf(auth.currentUser.uid) !== -1;

            var overlay = document.createElement('div');
            overlay.id = 'eventDetailOverlay';
            overlay.style.cssText = 'position:fixed;inset:0;z-index:100010;background:rgba(0,0,0,0.82);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;-webkit-overflow-scrolling:touch;';
            overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

            var html = '<div style="background:var(--bg-side);border:1px solid var(--border);border-radius:20px;max-width:520px;width:100%;margin:auto;overflow:hidden;box-shadow:var(--shadow-lg);">';

            if (ev.coverUrl) {
                html += '<div style="height:220px;background:url(' + esc(ev.coverUrl) + ') center/cover no-repeat;"></div>';
            } else {
                html += '<div style="height:100px;background:linear-gradient(135deg,var(--secondary) 0%,var(--card-bg) 100%);display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-handshake" style="font-size:2.5rem;color:var(--accent);opacity:0.3;"></i></div>';
            }

            html += '<div style="padding:24px;">';
            html += '<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:var(--accent-bg);border:1px solid var(--accent-glow);border-radius:999px;margin-bottom:12px;"><i class="fa-regular fa-calendar" style="color:var(--accent);font-size:0.65rem;"></i><span style="color:var(--accent);font-size:0.7rem;font-weight:800;">' + dateStr + ' &middot; ' + timeStr + '</span></div>';
            html += '<h2 style="color:var(--heading);font-size:1.3rem;font-weight:900;margin:0 0 12px;line-height:1.3;">' + esc(ev.title) + '</h2>';
            html += '<div style="display:flex;align-items:center;gap:7px;color:var(--text-muted);font-size:0.85rem;margin-bottom:14px;"><i class="fa-solid fa-location-dot" style="color:var(--accent);font-size:0.8rem;flex-shrink:0;"></i>' + esc(ev.locationName || 'TBD') + '</div>';

            if (ev.description) {
                html += '<div style="color:var(--text-dim);font-size:0.88rem;line-height:1.7;margin-bottom:18px;white-space:pre-wrap;">' + esc(ev.description) + '</div>';
            }
            if (ev.link) {
                html += '<a href="' + esc(ev.link) + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:7px;padding:9px 16px;background:var(--accent-bg);border:1px solid var(--accent-glow);border-radius:10px;color:var(--accent);font-size:0.82rem;font-weight:700;text-decoration:none;margin-bottom:16px;"><i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7rem;"></i>Event Link</a>';
            }

            html += '<div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:16px;">';
            html += '<div style="display:flex;align-items:center;gap:6px;color:var(--text-muted);font-size:0.8rem;"><i class="fa-solid fa-user-group" style="font-size:0.72rem;"></i>' + ((ev.attendees || []).length || 0) + ' attending</div>';
            html += '<div style="color:var(--text-faint);font-size:0.78rem;">Hosted by <span style="color:var(--text-dim);font-weight:600;">' + esc(ev.hostName || 'Anonymous Pleb') + '</span></div>';
            html += '</div>';

            html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
            html += '<button onclick="event.stopPropagation();toggleRSVP(\'' + eventId + '\');document.getElementById(\'eventDetailOverlay\').remove()" style="flex:1;min-width:120px;padding:11px;display:flex;align-items:center;justify-content:center;gap:7px;background:' + (isGoing ? 'var(--accent)' : 'var(--secondary)') + ';color:' + (isGoing ? '#fff' : 'var(--text)') + ';border:1px solid ' + (isGoing ? 'var(--accent)' : 'var(--border)') + ';border-radius:10px;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit;"><i class="fa-solid ' + (isGoing ? 'fa-circle-check' : 'fa-calendar-plus') + '" style="font-size:0.78rem;"></i>' + (isGoing ? "Going" : "RSVP") + '</button>';
            if (isHost) {
                html += '<button onclick="event.stopPropagation();document.getElementById(\'eventDetailOverlay\').remove();editEvent(\'' + eventId + '\')" style="padding:11px 14px;display:flex;align-items:center;gap:6px;background:none;border:1px solid var(--border);border-radius:10px;color:var(--text-muted);font-size:0.82rem;cursor:pointer;font-family:inherit;"><i class="fa-solid fa-pen" style="font-size:0.72rem;"></i>Edit</button>';
                html += '<button onclick="event.stopPropagation();deleteEvent(\'' + eventId + '\')" style="padding:11px 14px;display:flex;align-items:center;gap:6px;background:none;border:1px solid rgba(239,68,68,0.4);border-radius:10px;color:#ef4444;font-size:0.82rem;cursor:pointer;font-family:inherit;"><i class="fa-solid fa-trash" style="font-size:0.72rem;"></i></button>';
            }
            html += '</div>';
            html += '<button onclick="document.getElementById(\'eventDetailOverlay\').remove()" style="width:100%;margin-top:10px;padding:10px;background:none;border:1px solid var(--border);border-radius:10px;color:var(--text-faint);font-size:0.82rem;cursor:pointer;font-family:inherit;transition:0.15s;" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\'">Close</button>';
            html += '</div></div>';

            overlay.innerHTML = html;
            document.body.appendChild(overlay);
        } catch(err) {
            console.error('Event view error:', err);
            if (typeof showToast === 'function') showToast('Error loading event');
        }
    };

    window.editEvent = async function(eventId) {
        if (!db || !auth || !auth.currentUser) return;
        try {
            var doc = await db.collection('irl_events').doc(eventId).get();
            if (!doc.exists) return;
            var ev = doc.data();
            if (auth.currentUser.uid !== ev.hostId) { if (typeof showToast === 'function') showToast('Only the host can edit'); return; }

            var overlay = document.createElement('div');
            overlay.id = 'editEventOverlay';
            overlay.style.cssText = 'position:fixed;inset:0;z-index:100010;background:rgba(0,0,0,0.82);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;-webkit-overflow-scrolling:touch;';
            overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

            var evDate = ev.date ? new Date(ev.date).toISOString().slice(0, 16) : '';
            var is = _inputStyle();
            var esc = typeof escapeHtml === 'function' ? escapeHtml : function(s) { return s; };

            var html = '<div style="background:var(--bg-side);border:1px solid var(--border);border-radius:20px;padding:28px;max-width:500px;width:100%;margin:auto;box-shadow:var(--shadow-lg);">';
            html += '<h2 style="color:var(--heading);margin:0 0 18px;font-size:1.1rem;font-weight:800;display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-pen" style="color:var(--accent);font-size:0.9rem;"></i>Edit Event</h2>';

            html += _labelHtml('fa-pen', 'Title') + '<input type="text" id="editEvTitle" value="' + esc(ev.title || '') + '" style="' + is + 'margin-bottom:14px;" onfocus="this.style.borderColor=\'var(--accent)\'" onblur="this.style.borderColor=\'var(--border)\'">';
            html += _labelHtml('fa-clock', 'Date & Time') + '<input type="datetime-local" id="editEvDate" value="' + evDate + '" style="' + is + 'margin-bottom:14px;" onfocus="this.style.borderColor=\'var(--accent)\'" onblur="this.style.borderColor=\'var(--border)\'">';
            html += _labelHtml('fa-location-dot', 'Location') + '<input type="text" id="editEvLoc" value="' + esc(ev.locationName || ev.location || '') + '" style="' + is + 'margin-bottom:14px;" onfocus="this.style.borderColor=\'var(--accent)\'" onblur="this.style.borderColor=\'var(--border)\'">';
            html += _labelHtml('fa-link', 'Link (optional)') + '<input type="url" id="editEvLink" value="' + esc(ev.link || '') + '" style="' + is + 'margin-bottom:14px;" onfocus="this.style.borderColor=\'var(--accent)\'" onblur="this.style.borderColor=\'var(--border)\'">';
            html += _labelHtml('fa-align-left', 'Description') + '<textarea id="editEvDesc" rows="4" maxlength="1000" style="' + is + 'resize:vertical;margin-bottom:18px;" onfocus="this.style.borderColor=\'var(--accent)\'" onblur="this.style.borderColor=\'var(--border)\'">' + esc(ev.description || '') + '</textarea>';

            html += '<button onclick="submitEditEvent(\'' + eventId + '\')" id="editEvBtn" style="width:100%;padding:13px;background:var(--accent);color:#fff;border:none;border-radius:12px;font-weight:800;font-size:0.9rem;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;" onmouseover="this.style.opacity=\'0.88\'" onmouseout="this.style.opacity=\'1\'"><i class="fa-solid fa-floppy-disk" style="font-size:0.8rem;"></i>Save Changes</button>';
            html += '<button onclick="document.getElementById(\'editEventOverlay\').remove()" style="width:100%;margin-top:8px;padding:10px;background:none;border:1px solid var(--border);border-radius:10px;color:var(--text-faint);font-size:0.82rem;cursor:pointer;font-family:inherit;">Cancel</button>';
            html += '</div>';

            overlay.innerHTML = html;
            document.body.appendChild(overlay);
        } catch(err) {
            if (typeof showToast === 'function') showToast('Error loading event for edit');
        }
    };

    window.submitEditEvent = async function(eventId) {
        var btn = document.getElementById('editEvBtn');
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" style="font-size:0.8rem;"></i> Saving...'; }
        try {
            var title = (document.getElementById('editEvTitle').value || '').trim();
            var date = document.getElementById('editEvDate').value;
            var loc = (document.getElementById('editEvLoc').value || '').trim();
            var link = (document.getElementById('editEvLink').value || '').trim();
            var desc = (document.getElementById('editEvDesc').value || '').trim();
            if (!title || !date || !loc) { if (typeof showToast === 'function') showToast('Fill in title, date, and location'); if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-floppy-disk" style="font-size:0.8rem;"></i>Save Changes'; } return; }
            await db.collection('irl_events').doc(eventId).update({
                title: title,
                date: new Date(date).toISOString(),
                location: loc,
                locationName: loc,
                link: link || null,
                description: desc.substring(0, 1000) || null,
            });
            document.getElementById('editEventOverlay').remove();
            if (typeof showToast === 'function') showToast('Event updated!');
            loadEvents();
        } catch(err) {
            if (typeof showToast === 'function') showToast('Error saving: ' + err.message);
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-floppy-disk" style="font-size:0.8rem;"></i>Save Changes'; }
        }
    };

    window.deleteEvent = async function(eventId) {
        if (!confirm('Delete this event? This cannot be undone.')) return;
        try {
            await db.collection('irl_events').doc(eventId).delete();
            var overlay = document.getElementById('eventDetailOverlay');
            if (overlay) overlay.remove();
            if (typeof showToast === 'function') showToast('Event deleted');
            loadEvents();
        } catch(err) {
            if (typeof showToast === 'function') showToast('Error deleting event');
        }
    };

})();