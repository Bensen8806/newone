
    // Data structures
    const DEPTS = { CSE:{name:'Computer Science',hod:'HOD - CSE'}, ME:{name:'Mechanical',hod:'HOD - ME'}, ICE:{name:'ICE',hod:'HOD - ICE'}, CE:{name:'Civil',hod:'HOD - CE'}, ECE:{name:'Electronics',hod:'HOD - ECE'}, EEE:{name:'Electrical',hod:'HOD - EEE'}, ADM:{name:'Administration',hod:'HOD - ADM'} };
    const ROLE_DEPT = { HOD_CSE:'CSE', HOD_ME:'ME', HOD_ICE:'ICE', HOD_CE:'CE', HOD_ECE:'ECE', HOD_EEE:'EEE', HOD_ADM:'ADM' };
    const CLUBS = ['IEEE Student Chapter',"IE(I) Students Chapter",'SAEINDIA','ISTE','IIC','iEDC','TinkerHub','NSS','Women Development Cell','Music Club','Dance Club','Sports Club'];
    const VENUES = [
      {id:'V-CSE-01',name:'CSE Seminar Hall',dept:'CSE',cap:100,feats:['Projector','Smart Board','AC']},
      {id:'V-CSE-02',name:'CSE Lab',dept:'CSE',cap:40,feats:['Computers (40)','AC']},
      {id:'V-ME-01',name:'ME Seminar Hall',dept:'ME',cap:80,feats:['Projector','Whiteboard']},
      {id:'V-ME-02',name:'ME CAD Lab',dept:'ME',cap:30,feats:['Computers (30)','CAD Software']},
      {id:'V-ICE-01',name:'ICE Seminar Hall',dept:'ICE',cap:60,feats:['Projector']},
      {id:'V-ICE-02',name:'ICE Lab',dept:'ICE',cap:30,feats:['Computers (30)']},
      {id:'V-CE-01',name:'Civil VM Hall',dept:'CE',cap:80,feats:['Projector']},
      {id:'V-CE-02',name:'Civil Drafting Lab',dept:'CE',cap:40,feats:['Drafting Tables']},
      {id:'V-CE-03',name:'Material Testing',dept:'CE',cap:30,feats:['Testing Equipment']},
      {id:'V-CE-04',name:'Survey Lab',dept:'CE',cap:30,feats:['Survey Instruments']},
      {id:'V-ECE-01',name:'ECE Seminar Hall',dept:'ECE',cap:100,feats:['Projector','AC']},
      {id:'V-ECE-02',name:'ECE Analog Lab',dept:'ECE',cap:30,feats:['Oscilloscopes']},
      {id:'V-ECE-03',name:'ECE Circuits Lab',dept:'ECE',cap:30,feats:['Breadboards']},
      {id:'V-ECE-04',name:'ECE PG Lab',dept:'ECE',cap:20,feats:['Research Equipment']},
      {id:'V-EEE-01',name:'EEE Seminar Hall',dept:'EEE',cap:60,feats:['Projector']},
      {id:'V-EEE-02',name:'EEE Analog Lab',dept:'EEE',cap:30,feats:['Power Supplies']},
      {id:'V-EEE-03',name:'EEE Power Sys',dept:'EEE',cap:30,feats:['HV Setup']},
      {id:'V-ADM-01',name:'PTIB Hall',dept:'ADM',cap:150,feats:['Projector','PA System','AC']},
      {id:'V-ADM-02',name:'Seminar Hall',dept:'ADM',cap:100,feats:['Projector','AC']},
      {id:'V-ADM-03',name:'E-One Hall',dept:'ADM',cap:200,feats:['Projector','PA System']},
      {id:'V-ADM-04',name:'Auditorium',dept:'ADM',cap:800,feats:['PA System','Stage','AC']},
      {id:'V-ADM-05',name:'CNC Lab',dept:'ADM',cap:20,feats:['CNC Machines']},
      {id:'V-ADM-06',name:'Skill Dev Center',dept:'ADM',cap:60,feats:['Computers (60)','AC']}
    ];

    const LAYOUT = {
      depts: [
        {dept:'ADM',x:5,y:5,w:990,h:215,lx:500,ly:24},
        {dept:'CSE',x:5,y:230,w:320,h:215,lx:165,ly:249},
        {dept:'ECE',x:340,y:230,w:320,h:215,lx:500,ly:249},
        {dept:'EEE',x:675,y:230,w:320,h:215,lx:835,ly:249},
        {dept:'ME',x:5,y:460,w:320,h:215,lx:165,ly:479},
        {dept:'ICE',x:340,y:460,w:320,h:215,lx:500,ly:479},
        {dept:'CE',x:675,y:460,w:320,h:215,lx:835,ly:479}
      ],
      venues: {
        'V-ADM-04':{x:15,y:35,w:250,h:173},'V-ADM-01':{x:280,y:35,w:175,h:80},'V-ADM-03':{x:280,y:125,w:175,h:80},
        'V-ADM-02':{x:470,y:35,w:175,h:80},'V-ADM-05':{x:470,y:125,w:175,h:80},'V-ADM-06':{x:660,y:35,w:328,h:173},
        'V-CSE-01':{x:15,y:265,w:300,h:80},'V-CSE-02':{x:15,y:355,w:300,h:80},
        'V-ECE-01':{x:350,y:265,w:300,h:68},'V-ECE-02':{x:350,y:343,w:143,h:48},'V-ECE-03':{x:503,y:343,w:147,h:48},'V-ECE-04':{x:350,y:401,w:300,h:37},
        'V-EEE-01':{x:685,y:265,w:300,h:80},'V-EEE-02':{x:685,y:355,w:143,h:80},'V-EEE-03':{x:838,y:355,w:147,h:80},
        'V-ME-01':{x:15,y:495,w:300,h:80},'V-ME-02':{x:15,y:585,w:300,h:78},
        'V-ICE-01':{x:350,y:495,w:300,h:80},'V-ICE-02':{x:350,y:585,w:300,h:78},
        'V-CE-01':{x:685,y:495,w:300,h:55},'V-CE-02':{x:685,y:560,w:143,h:50},'V-CE-03':{x:838,y:560,w:147,h:50},'V-CE-04':{x:685,y:620,w:300,h:48}
      }
    };

    // State
    const S = { role: 'CLUB_HEAD', venueId: null, sd: '', st: '09:00', ed: '', et: '17:00', avail: {}, checked: false, selReqId: null };
    const KEY = 'nssce_events_shadcn';

    const getEvts = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
    const saveEvts = e => localStorage.setItem(KEY, JSON.stringify(e));
    const addEvt = e => { const a = getEvts(); a.push(e); saveEvts(a); };
    const updEvt = (id, u) => { const a = getEvts(); const i = a.findIndex(e => e.id === id); if(i >= 0){ a[i] = { ...a[i], ...u }; saveEvts(a); } };
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    function seed() {
      if(getEvts().length > 0) return;
      const t = new Date(), fmt = d => d.toISOString().split('T')[0];
      const d1 = new Date(t); d1.setDate(t.getDate() + 1);
      const d2 = new Date(t); d2.setDate(t.getDate() + 2);
      saveEvts([
        { id:'s1', title:'IEEE Workshop on Embedded Systems', desc:'Hands-on workshop on Arduino.', venueId:'V-ECE-01', club:'IEEE Student Chapter', cat:'TECHNICAL', att:80, ktu:true, ktuCat:'SEG2', spec:'Need 10 kits', sd:fmt(d1), st:'09:00', ed:fmt(d1), et:'17:00', status:'APPROVED', hodRmk:'Approved for ECE Hall.', prinRmk:'Excellent initiative.', subAt:new Date(t - 5*864e5).toISOString(), hodAt:new Date(t - 3*864e5).toISOString(), prinAt:new Date(t - 2*864e5).toISOString() },
        { id:'s2', title:'Dance Club Showcase', desc:'Dance performances.', venueId:'V-ADM-04', club:'Dance Club', cat:'CULTURAL', att:500, ktu:true, ktuCat:'SEG6', spec:'Stage lighting', sd:fmt(d2), st:'14:00', ed:fmt(d2), et:'20:00', status:'PENDING_PRINCIPAL', hodRmk:'Forwarding.', prinRmk:'', subAt:new Date(t - 3*864e5).toISOString(), hodAt:new Date(t - 864e5).toISOString(), prinAt:null },
        { id:'s3', title:'NSS Blood Donation Drive', desc:'Donation camp.', venueId:'V-ADM-02', club:'NSS', cat:'SOCIAL', att:200, ktu:true, ktuCat:'SEG7', spec:'Medical beds', sd:fmt(t), st:'09:00', ed:fmt(t), et:'14:00', status:'REJECTED_BY_HOD', hodRmk:'Seminar Hall reserved for dept exam.', prinRmk:'', subAt:new Date(t - 4*864e5).toISOString(), hodAt:new Date(t - 2*864e5).toISOString(), prinAt:null }
      ]);
    }

    const toMs = (d, t) => new Date(d + 'T' + t + ':00').getTime();
    function overlaps(e, sd, st, ed, et) { return toMs(e.sd, e.st) < toMs(ed, et) && toMs(e.ed, e.et) > toMs(sd, st); }
    function computeAvail(sd, st, ed, et) {
      const a = {}; VENUES.forEach(v => { a[v.id] = 'AVAILABLE'; });
      getEvts().forEach(e => {
        if(!overlaps(e, sd, st, ed, et)) return;
        if(e.status === 'APPROVED') a[e.venueId] = 'BOOKED';
        else if(['PENDING_HOD', 'PENDING_PRINCIPAL'].includes(e.status) && a[e.venueId] !== 'BOOKED') a[e.venueId] = 'PENDING';
      });
      return a;
    }

    function getSty(status) {
      switch(status) {
        case 'AVAILABLE': return { fill: 'rgba(22, 163, 74, 0.1)', stroke: '#16a34a', sw: 1.5 };
        case 'PENDING': return { fill: 'rgba(217, 119, 6, 0.1)', stroke: '#d97706', sw: 1.5 };
        case 'BOOKED': return { fill: 'rgba(220, 38, 38, 0.1)', stroke: '#dc2626', sw: 1.5 };
        default: return { fill: '#09090b', stroke: '#27272a', sw: 1 };
      }
    }

    function renderSVG() {
      const svg = document.getElementById('csvg'); let h = '';
      // Base grids/paths
      h += '<rect width="1000" height="685" fill="#000000" rx="8"/>';
      
      LAYOUT.depts.forEach(b => {
        h += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="8" fill="#09090b" stroke="#27272a" stroke-width="1"/>
              <text x="${b.lx}" y="${b.ly}" text-anchor="middle" font-family="Inter" font-size="10" font-weight="600" fill="#a1a1aa" letter-spacing="1">${DEPTS[b.dept].name.toUpperCase()}</text>`;
      });

      VENUES.forEach(venue => {
        const l = LAYOUT.venues[venue.id]; if(!l) return;
        const av = S.avail[venue.id]; const sty = getSty(S.checked ? av : undefined);
        const cx = l.x + l.w / 2, cy = l.y + l.h / 2;
        const sel = venue.id === S.venueId;
        const stroke = sel ? '#fafafa' : sty.stroke;
        const sw = sel ? 2 : sty.sw;
        const dotFill = S.checked ? (av === 'AVAILABLE' ? '#16a34a' : av === 'PENDING' ? '#d97706' : av === 'BOOKED' ? '#dc2626' : '#3f3f46') : '#3f3f46';
        
        h += `<g class="venue-group" onclick="onVC('${venue.id}')" onmouseenter="showTT(event,'${venue.id}')" onmouseleave="hideTT()">
          <rect id="vr-${venue.id}" class="vr" x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}" rx="6" fill="${sty.fill}" stroke="${stroke}" stroke-width="${sw}"/>
          <text x="${cx}" y="${cy+4}" text-anchor="middle" font-family="Inter" font-weight="500" font-size="${l.h < 45 ? 9 : 11}" fill="#fafafa" style="pointer-events:none">${venue.name}</text>
          <circle id="dot-${venue.id}" cx="${l.x + l.w - 10}" cy="${l.y + 10}" r="4" fill="${dotFill}" style="pointer-events:none"/>
        </g>`;
      });
      svg.innerHTML = h;
    }

    function refreshMap() {
      VENUES.forEach(v => {
        const r = document.getElementById('vr-' + v.id); if(!r) return;
        const av = S.avail[v.id]; const sty = getSty(S.checked ? av : undefined);
        r.setAttribute('fill', sty.fill);
        r.setAttribute('stroke', v.id === S.venueId ? '#fafafa' : sty.stroke);
        r.setAttribute('stroke-width', v.id === S.venueId ? 2 : sty.sw);
        const dot = document.getElementById('dot-' + v.id);
        if(dot) dot.setAttribute('fill', S.checked ? (av === 'AVAILABLE' ? '#16a34a' : av === 'PENDING' ? '#d97706' : av === 'BOOKED' ? '#dc2626' : '#3f3f46') : '#3f3f46');
      });
    }

    function showTT(evt, id) {
      const v = VENUES.find(x => x.id === id); if(!v) return;
      const av = S.avail[id];
      document.getElementById('tt-name').textContent = v.name;
      document.getElementById('tt-dept').textContent = DEPTS[v.dept].name;
      document.getElementById('tt-cap').textContent = 'Capacity: ' + v.cap;
      
      let st = 'Unselected', color = '#3f3f46';
      if(S.checked) {
        if(av === 'AVAILABLE'){ st = 'Available'; color = '#16a34a'; }
        else if(av === 'PENDING'){ st = 'Pending Request'; color = '#d97706'; }
        else { st = 'Booked'; color = '#dc2626'; }
      }
      document.getElementById('tt-st').textContent = st;
      document.getElementById('tt-dot').style.background = color;
      
      const tt = document.getElementById('tt');
      tt.style.display = 'block';
      moveTT(evt);
    }
    
    function moveTT(e) {
      const tt = document.getElementById('tt');
      tt.style.left = Math.min(e.clientX + 16, window.innerWidth - tt.offsetWidth - 10) + 'px';
      tt.style.top = (e.clientY - 10) + 'px';
    }
    
    function hideTT() { document.getElementById('tt').style.display = 'none'; }
    document.addEventListener('mousemove', e => { if(document.getElementById('tt').style.display !== 'none') moveTT(e); });

    function checkAvail() {
      const sd = document.getElementById('sd').value, st = document.getElementById('st').value, ed = document.getElementById('ed').value, et = document.getElementById('et').value;
      if(!sd || !st || !ed || !et) { toast('Fill in all date and time fields', 'error'); return; }
      if(toMs(sd, st) >= toMs(ed, et)) { toast('End time must be after start time', 'error'); return; }
      
      S.sd = sd; S.st = st; S.ed = ed; S.et = et; S.checked = true;
      S.avail = computeAvail(sd, st, ed, et);
      refreshMap();
      
      const bk = Object.values(S.avail).filter(v => v === 'BOOKED').length;
      const pe = Object.values(S.avail).filter(v => v === 'PENDING').length;
      const av = Object.values(S.avail).filter(v => v === 'AVAILABLE').length;
      
      toast(`${av} available, ${pe} pending, ${bk} booked.`, 'success', 'Availability Updated');
      if(S.venueId) openVP(S.venueId);
    }

    function onVC(id) { hideTT(); openVP(id); }
    
    function openVP(id) {
      const v = VENUES.find(x => x.id === id); if(!v) return;
      S.venueId = id; refreshMap();
      const dep = DEPTS[v.dept], av = S.avail[id];
      
      document.getElementById('vp-name').textContent = v.name;
      document.getElementById('vp-dept').textContent = dep.name;
      document.getElementById('vp-cap').textContent = v.cap;
      document.getElementById('vp-hod').textContent = dep.hod;
      
      const chip = document.getElementById('vp-chip');
      chip.className = 'badge';
      if(!S.checked) { chip.classList.add('badge-outline'); chip.textContent = 'Select time range first'; }
      else if(av === 'AVAILABLE') { chip.classList.add('badge-avail'); chip.textContent = 'Available for selected time'; }
      else if(av === 'PENDING') { chip.classList.add('badge-pend'); chip.textContent = 'Pending request in slot'; }
      else { chip.classList.add('badge-booked'); chip.textContent = 'Booked in slot'; }
      
      document.getElementById('vp-feats').innerHTML = v.feats.map(f => `<div class="feat-chip">${f}</div>`).join('');
      
      const bks = getEvts().filter(e => e.venueId === id && ['APPROVED','PENDING_HOD','PENDING_PRINCIPAL'].includes(e.status) && toMs(e.ed, e.et) > Date.now()).sort((a,b) => toMs(a.sd, a.st) - toMs(b.sd, b.st));
      const bc = document.getElementById('vp-bks');
      
      bc.innerHTML = bks.length ? bks.slice(0, 5).map(e => `
        <div class="card" style="padding: 12px; margin-bottom: 8px;">
          <div style="font-size:13px; font-weight:500; margin-bottom:4px;">${e.title}</div>
          <div style="display:flex; gap:12px; font-size:12px; color:var(--muted-foreground); margin-bottom:8px;">
            <span>${fmtRange(e.sd, e.st, e.ed, e.et)}</span>
            <span>${e.club}</span>
          </div>
          <span class="badge ${e.status === 'APPROVED' ? 'badge-avail' : 'badge-pend'}">${e.status === 'APPROVED' ? 'Approved' : 'Pending'}</span>
        </div>
      `).join('') : '<div class="empty-state">No upcoming bookings</div>';
      
      const bb = document.getElementById('bookBtn'), bh = document.getElementById('bookHint');
      if(S.role === 'CLUB_HEAD') {
        bb.style.display = 'inline-flex';
        if(!S.checked) { bb.disabled = true; bh.textContent = 'Select a time range first'; }
        else if(av === 'BOOKED') { bb.disabled = true; bh.textContent = 'Venue booked for this slot'; }
        else { bb.disabled = false; bh.textContent = av === 'PENDING' ? 'Another request is pending for this slot' : ''; }
      } else {
        bb.style.display = 'none'; bh.textContent = 'Switch to Club Head role to request a venue';
      }
      
      document.getElementById('vpanel').classList.add('open');
    }
    
    function closeVP() { S.venueId = null; refreshMap(); document.getElementById('vpanel').classList.remove('open'); }
    
    let ktuOn = false;
    function setKtu(v) { 
      ktuOn = v; 
      document.getElementById('ktu-y').classList.toggle('active', v); 
      document.getElementById('ktu-n').classList.toggle('active', !v); 
      document.getElementById('ktu-cat-g').style.display = v ? 'block' : 'none'; 
    }
    
    function openReqForm() {
      if(!S.venueId) return;
      const v = VENUES.find(x => x.id === S.venueId);
      document.getElementById('r-club').innerHTML = '<option value="">Select club...</option>' + CLUBS.map(c => `<option>${c}</option>`).join('');
      document.getElementById('ri-venue').textContent = v.name;
      document.getElementById('ri-date').textContent = S.sd === S.ed ? fmtDate(S.sd) : `${fmtDate(S.sd)} - ${fmtDate(S.ed)}`;
      document.getElementById('ri-time').textContent = `${S.st} - ${S.et}`;
      ['r-title','r-desc','r-spec'].forEach(i => document.getElementById(i).value = '');
      document.getElementById('r-club').value = ''; document.getElementById('r-cat').value = ''; document.getElementById('r-att').value = '';
      setKtu(false); openModal('reqModal');
    }
    
    function submitReq() {
      const title = document.getElementById('r-title').value.trim(), desc = document.getElementById('r-desc').value.trim(), club = document.getElementById('r-club').value, cat = document.getElementById('r-cat').value, att = document.getElementById('r-att').value;
      if(!title || !desc || !club || !cat || !att) { toast('Fill in all required fields', 'error'); return; }
      
      addEvt({ id:uid(), title, desc, venueId:S.venueId, club, cat, att:parseInt(att), ktu:ktuOn, ktuCat:ktuOn ? document.getElementById('r-ktu').value : '', spec:document.getElementById('r-spec').value.trim(), sd:S.sd, st:S.st, ed:S.ed, et:S.et, status:'PENDING_HOD', hodRmk:'', prinRmk:'', subAt:new Date().toISOString(), hodAt:null, prinAt:null });
      
      closeModal('reqModal'); closeVP();
      if(S.checked) { S.avail = computeAvail(S.sd, S.st, S.ed, S.et); refreshMap(); }
      updBadge();
      toast('Request submitted successfully for HOD review.', 'success');
    }
    
    function getPending(role) {
      const evts = getEvts();
      if(role === 'PRINCIPAL') return evts.filter(e => e.status === 'PENDING_PRINCIPAL');
      const dept = ROLE_DEPT[role];
      if(!dept) return [];
      return evts.filter(e => {
        if(e.status !== 'PENDING_HOD') return false;
        const v = VENUES.find(x => x.id === e.venueId);
        return v && v.dept === dept;
      });
    }
    
    function updBadge() {
      const p = getPending(S.role), badge = document.getElementById('nbadge'), sec = document.getElementById('actSec');
      if(p.length > 0 && S.role !== 'CLUB_HEAD') {
        badge.textContent = p.length; badge.style.display = 'flex'; sec.style.display = 'block';
        document.getElementById('actTitle').textContent = S.role === 'PRINCIPAL' ? 'Final Approvals Needed' : 'Venue Reviews Needed';
        document.getElementById('actDesc').textContent = `You have ${p.length} request(s) awaiting your decision.`;
      } else {
        badge.style.display = 'none'; sec.style.display = 'none';
      }
    }
    
    function openApprovalModal() {
      if(S.role === 'CLUB_HEAD') { openPipelineModal(); return; }
      const p = getPending(S.role); S.selReqId = null;
      document.getElementById('am-title').textContent = S.role === 'PRINCIPAL' ? 'Principal Reviews' : 'HOD Reviews';
      renderApprList(p);
      document.getElementById('am-form').style.display = 'none';
      openModal('apprModal');
    }
    
    function renderApprList(evts) {
      const c = document.getElementById('am-list');
      if(!evts.length) { c.innerHTML = '<div class="empty-state">No pending requests</div>'; return; }
      c.innerHTML = evts.map(e => {
        const v = VENUES.find(x => x.id === e.venueId);
        return `<div class="req-card" id="rc-${e.id}" onclick="selReq('${e.id}')">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <div style="font-weight:600; font-size:14px;">${e.title}</div>
            <span class="badge ${e.status.includes('PRINCIPAL') ? 'badge-pend' : 'badge-outline'}">${e.status.includes('PRINCIPAL') ? 'Pending Principal' : 'Pending HOD'}</span>
          </div>
          <div style="font-size:12px; color:var(--muted-foreground); display:flex; gap:12px;">
            <span>${v ? v.name : '?'}</span>
            <span>${e.club}</span>
            <span>${fmtRange(e.sd, e.st, e.ed, e.et)}</span>
          </div>
        </div>`;
      }).join('');
    }
    
    function selReq(id) {
      S.selReqId = id;
      document.querySelectorAll('.req-card').forEach(c => c.classList.remove('sel'));
      const card = document.getElementById('rc-' + id); if(card) card.classList.add('sel');
      
      const e = getEvts().find(x => x.id === id); if(!e) return;
      const v = VENUES.find(x => x.id === e.venueId);
      
      document.getElementById('am-form').style.display = 'block';
      document.getElementById('am-detail').innerHTML = `
        <div class="grid-2" style="margin-bottom: 16px;">
          <div><div class="label">Venue</div><div style="font-size:13px">${v ? v.name : '?'}</div></div>
          <div><div class="label">Club</div><div style="font-size:13px">${e.club}</div></div>
          <div><div class="label">Date & Time</div><div style="font-size:13px">${fmtRange(e.sd, e.st, e.ed, e.et)}</div></div>
          <div><div class="label">Category</div><div style="font-size:13px">${e.cat} (Att: ${e.att})</div></div>
        </div>
        ${e.desc ? `<div class="label">Description</div><div style="font-size:13px; color:var(--muted-foreground); margin-bottom:12px;">${e.desc}</div>` : ''}
        ${e.hodRmk && S.role === 'PRINCIPAL' ? `<div style="background:var(--secondary); border-left:2px solid var(--ring); padding:12px; border-radius:4px; margin-top:16px;">
          <div style="font-size:11px; color:var(--muted-foreground); text-transform:uppercase; font-weight:600; margin-bottom:4px;">HOD Remark</div>
          <div style="font-size:13px;">${e.hodRmk}</div>
        </div>` : ''}
      `;
      document.getElementById('am-rmk').value = '';
    }
    
    function doApprove() {
      const rmk = document.getElementById('am-rmk').value.trim();
      if(!rmk) { toast('Review remark is mandatory', 'error'); return; }
      
      if(S.role === 'PRINCIPAL') {
        updEvt(S.selReqId, { status: 'APPROVED', prinRmk: rmk, prinAt: new Date().toISOString() });
        toast('Event approved and published.', 'success');
      } else {
        updEvt(S.selReqId, { status: 'PENDING_PRINCIPAL', hodRmk: rmk, hodAt: new Date().toISOString() });
        toast('Forwarded to Principal for final approval.', 'success');
      }
      closeModal('apprModal');
      if(S.checked) { S.avail = computeAvail(S.sd, S.st, S.ed, S.et); refreshMap(); }
      updBadge(); S.selReqId = null;
    }
    
    function doReject() {
      const rmk = document.getElementById('am-rmk').value.trim();
      if(!rmk) { toast('Review remark is mandatory', 'error'); return; }
      
      if(S.role === 'PRINCIPAL') updEvt(S.selReqId, { status: 'REJECTED_BY_PRINCIPAL', prinRmk: rmk, prinAt: new Date().toISOString() });
      else updEvt(S.selReqId, { status: 'REJECTED_BY_HOD', hodRmk: rmk, hodAt: new Date().toISOString() });
      
      toast('Request rejected.', 'success');
      closeModal('apprModal'); updBadge(); S.selReqId = null;
    }
    
    function openPipelineModal() { renderPipeline(); openModal('pipeModal'); }
    
    function renderPipeline() {
      const evts = getEvts();
      const cols = [
        { key: 'PENDING_HOD', label: 'Pending HOD' },
        { key: 'PENDING_PRINCIPAL', label: 'Pending Principal' },
        { key: 'APPROVED', label: 'Approved' },
        { key: 'REJECTED', label: 'Rejected' }
      ];
      
      document.getElementById('pipeboard').innerHTML = cols.map(col => {
        const ce = evts.filter(e => col.key === 'REJECTED' ? e.status.startsWith('REJECTED') : e.status === col.key);
        return `<div class="pipe-col">
          <div class="pipe-hdr"><span>${col.label}</span><span class="pipe-cnt">${ce.length}</span></div>
          ${ce.length ? ce.map(e => {
            const v = VENUES.find(x => x.id === e.venueId);
            return `<div class="pipe-card" onclick="openEvtDetail('${e.id}')">
              <div style="font-weight:600; margin-bottom:4px;">${e.title}</div>
              <div class="pc-meta">
                <svg class="icon" style="width:12px;height:12px;" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${v ? v.name : '?'}
              </div>
              <div class="pc-meta">
                <svg class="icon" style="width:12px;height:12px;" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${fmtDate(e.sd)}
              </div>
            </div>`;
          }).join('') : '<div class="empty-state" style="padding:16px 0; font-size:12px;">No events</div>'}
        </div>`;
      }).join('');
    }
    
    function openEvtDetail(id) {
      const e = getEvts().find(x => x.id === id); if(!e) return;
      const v = VENUES.find(x => x.id === e.venueId);
      document.getElementById('ev-title').textContent = e.title;
      
      const stEl = document.getElementById('ev-st');
      stEl.className = 'badge';
      if(e.status === 'APPROVED') stEl.classList.add('badge-avail');
      else if(e.status.startsWith('REJECTED')) stEl.classList.add('badge-booked');
      else stEl.classList.add('badge-pend');
      stEl.textContent = e.status.replace(/_/g, ' ');

      const items = [{ action: 'Submitted', role: 'Club Head', rmk: e.desc, time: e.subAt }];
      if(e.hodAt) items.push({ action: e.status === 'REJECTED_BY_HOD' ? 'Rejected' : 'Approved', role: 'HOD', rmk: e.hodRmk, time: e.hodAt });
      if(e.prinAt) items.push({ action: e.status === 'REJECTED_BY_PRINCIPAL' ? 'Rejected' : 'Approved', role: 'Principal', rmk: e.prinRmk, time: e.prinAt });
      
      document.getElementById('ev-body').innerHTML = `
        <div class="card" style="margin-bottom:24px;">
          <div class="grid-2">
            <div><div class="label">Venue</div><div style="font-size:13px">${v ? v.name : '?'}</div></div>
            <div><div class="label">Club</div><div style="font-size:13px">${e.club}</div></div>
            <div><div class="label">Date & Time</div><div style="font-size:13px">${fmtRange(e.sd, e.st, e.ed, e.et)}</div></div>
            <div><div class="label">Category</div><div style="font-size:13px">${e.cat} (Att: ${e.att})</div></div>
          </div>
        </div>
        <div class="label" style="margin-bottom: 16px;">Approval Trail</div>
        <div style="display:flex; flex-direction:column; gap:16px; position:relative; padding-left:16px;">
          <div style="position:absolute; left:7px; top:8px; bottom:8px; width:2px; background:var(--border);"></div>
          ${items.map(i => `
            <div style="position:relative;">
              <div style="position:absolute; left:-21px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--background); border:2px solid ${i.action === 'Rejected' ? 'var(--booked)' : (i.action === 'Approved' ? 'var(--avail)' : 'var(--ring)')};"></div>
              <div style="font-size:13px; font-weight:600;">${i.action} <span style="font-weight:400; color:var(--muted-foreground);">by ${i.role}</span></div>
              <div style="font-size:11px; color:var(--muted-foreground); margin-bottom:4px;">${fmtDT(i.time)}</div>
              ${i.rmk ? `<div style="font-size:13px; background:var(--secondary); padding:8px 12px; border-radius:4px; margin-top:4px;">${i.rmk}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
      
      closeModal('pipeModal'); openModal('evtModal');
    }
    
    function openModal(id) { document.getElementById(id).classList.add('open'); }
    function closeModal(id) { document.getElementById(id).classList.remove('open'); }
    document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', e => { if(e.target === o) closeModal(o.id); }));
    document.addEventListener('keydown', e => { if(e.key === 'Escape') { const open = [...document.querySelectorAll('.overlay.open')]; if(open.length) closeModal(open[open.length - 1].id); else closeVP(); } });
    
    function onRoleChange() { S.role = document.getElementById('roleSelect').value; updBadge(); if(S.venueId) openVP(S.venueId); }
    
    function toast(msg, type = 'info', title = '') {
      const c = document.getElementById('toasts'), t = document.createElement('div');
      t.className = `toast`;
      const icon = type === 'success' ? '<svg class="icon" style="color:var(--avail)" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' : 
                   type === 'error' ? '<svg class="icon" style="color:var(--booked)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' : 
                   '<svg class="icon" style="color:var(--foreground)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      t.innerHTML = `<div class="toast-icon">${icon}</div><div class="toast-content">${title ? `<div class="toast-title">${title}</div>` : ''}<div class="toast-desc">${msg}</div></div>`;
      c.appendChild(t); setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 200); }, 3000);
    }
    
    function fmtDate(s) { return s ? new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '--'; }
    function fmtDT(s) { return s ? new Date(s).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '--'; }
    function fmtRange(sd, st, ed, et) { return sd === ed ? `${fmtDate(sd)}, ${st}-${et}` : `${fmtDate(sd)} ${st} - ${fmtDate(ed)} ${et}`; }
    
    function resetDemo() {
      if(!confirm('Reset all demo data?')) return;
      localStorage.removeItem(KEY); seed();
      if(S.checked) S.avail = computeAvail(S.sd, S.st, S.ed, S.et);
      refreshMap(); updBadge();
      toast('Demo data reset', 'success');
    }
    
    function init() {
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('sd').value = today; document.getElementById('ed').value = today;
      seed(); renderSVG(); updBadge();
    }
    
    init();
  