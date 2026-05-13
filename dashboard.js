// ===================== AUTH CHECK =====================
(function() {
  const role = localStorage.getItem('erp_role');
  const page = location.pathname;
  if (!role) {
    if (!page.includes('login') && !page.includes('index')) window.location.href = 'login.html';
  }
})();

// ===================== SIDEBAR TOGGLE =====================
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ===================== NOTIFICATION PANEL =====================
document.getElementById('notifBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('notifPanel')?.classList.toggle('open');
});
document.addEventListener('click', () => {
  document.getElementById('notifPanel')?.classList.remove('open');
});

// ===================== NAV ROUTING =====================
function showSection(name) {
  document.querySelectorAll('[id^="section-"]').forEach(s => s.classList.add('hidden'));
  const el = document.getElementById('section-' + name);
  if (el) el.classList.remove('hidden');
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  const active = document.querySelector(`.sidebar-nav a[data-section="${name}"]`);
  if (active) active.classList.add('active');
  const titles = {
    dashboard:'Dashboard', students:'Student Management', staff:'Staff Management',
    fees:'Fees Collection', income:'Income & Expense', assignments:'Assignments',
    idcards:'ID / Marksheet Generator', bus:'Bus Tracking', chat:'Chat',
    notifications:'Notifications'
  };
  const pt = document.getElementById('pageTitle');
  if (pt) pt.textContent = titles[name] || name;
}

document.querySelectorAll('.sidebar-nav a[data-section]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    showSection(a.dataset.section);
    if (window.innerWidth < 900) document.getElementById('sidebar')?.classList.remove('open');
  });
});

// ===================== DATA STORE =====================
const DB = {
  students: [
    { id:1, name:'Arjun Sharma',  cls:'Class 10', sec:'A', phone:'+91 98765 43210', parent:'Rakesh Sharma',   fee:'Paid' },
    { id:2, name:'Priya Singh',   cls:'Class 9',  sec:'B', phone:'+91 87654 32109', parent:'Anil Singh',      fee:'Pending' },
    { id:3, name:'Rohit Verma',   cls:'Class 10', sec:'A', phone:'+91 76543 21098', parent:'Sunil Verma',     fee:'Paid' },
    { id:4, name:'Ananya Gupta',  cls:'Class 8',  sec:'C', phone:'+91 65432 10987', parent:'Vivek Gupta',     fee:'Partial' },
    { id:5, name:'Vikram Patel',  cls:'Class 7',  sec:'A', phone:'+91 54321 09876', parent:'Mahesh Patel',    fee:'Paid' },
    { id:6, name:'Sneha Kumar',   cls:'Class 9',  sec:'A', phone:'+91 43210 98765', parent:'Dinesh Kumar',    fee:'Pending' },
  ],
  staff: [
    { id:1, name:'Meera Joshi',    role:'Teacher', subject:'Mathematics',    cls:'Class 10', contact:'+91 98765 11111' },
    { id:2, name:'Rahul Nair',     role:'Teacher', subject:'Science',        cls:'Class 9',  contact:'+91 87654 22222' },
    { id:3, name:'Sunita Rao',     role:'Teacher', subject:'English',        cls:'Class 8',  contact:'+91 76543 33333' },
    { id:4, name:'Suresh Admin',   role:'Admin',   subject:'—',              cls:'All',      contact:'+91 65432 44444' },
  ],
  fees: [
    { id:'RC001', student:'Arjun Sharma',  cls:'Class 10', amount:5000, date:'2025-04-01', status:'Paid' },
    { id:'RC002', student:'Priya Singh',   cls:'Class 9',  amount:4500, date:'2025-04-03', status:'Pending' },
    { id:'RC003', student:'Rohit Verma',   cls:'Class 10', amount:5000, date:'2025-04-05', status:'Paid' },
    { id:'RC004', student:'Ananya Gupta',  cls:'Class 8',  amount:2000, date:'2025-04-08', status:'Partial' },
    { id:'RC005', student:'Vikram Patel',  cls:'Class 7',  amount:4000, date:'2025-04-10', status:'Paid' },
  ],
  income: [
    { date:'2025-04-01', type:'Income',  cat:'Fees',       desc:'Term 1 fee collection',      amount:85000 },
    { date:'2025-04-05', type:'Expense', cat:'Salary',     desc:'Staff salaries April',        amount:45000 },
    { date:'2025-04-10', type:'Income',  cat:'Donation',   desc:'Alumni donation',             amount:15000 },
    { date:'2025-04-15', type:'Expense', cat:'Utilities',  desc:'Electricity & water bills',   amount:8500 },
    { date:'2025-04-20', type:'Expense', cat:'Maintenance',desc:'Building repair work',        amount:12000 },
  ],
  assignments: [
    { subject:'Mathematics', cls:'Class 10', title:'Chapter 5 – Quadratic Equations', due:'2025-05-10', teacher:'Meera Joshi',   status:'Active' },
    { subject:'Science',     cls:'Class 9',  title:'Lab Report – Photosynthesis',     due:'2025-05-12', teacher:'Rahul Nair',    status:'Active' },
    { subject:'English',     cls:'Class 8',  title:'Essay: My Favourite Season',      due:'2025-05-08', teacher:'Sunita Rao',    status:'Due Soon' },
    { subject:'History',     cls:'Class 7',  title:'Project: Mughal Empire',          due:'2025-04-30', teacher:'Deepa Menon',   status:'Overdue' },
  ],
  notifications: [],
  chatMessages: {
    'Meera Joshi': [
      { from:'me', text:'Good morning! Has the Math assignment been uploaded?', time:'9:00 AM' },
      { from:'other', text:'Yes, I uploaded it this morning for Class 10-A.', time:'9:05 AM' },
    ],
    'Arjun Sharma': [
      { from:'other', text:'Sir, my fee receipt is not showing.', time:'10:30 AM' },
      { from:'me', text:'Please check again after clearing your cache.', time:'10:32 AM' },
    ]
  }
};

// ===================== RENDER STUDENTS =====================
function renderStudents(list) {
  const tbody = document.getElementById('studentTable');
  if (!tbody) return;
  tbody.innerHTML = list.map((s,i) => `
    <tr>
      <td>${s.id}</td>
      <td><strong>${s.name}</strong></td>
      <td>${s.cls}</td>
      <td>${s.sec}</td>
      <td>${s.phone}</td>
      <td><span class="badge badge-${s.fee==='Paid'?'success':s.fee==='Pending'?'danger':'warning'}">${s.fee}</span></td>
      <td><button class="btn-outline" style="padding:5px 14px;font-size:0.78rem" onclick="deleteStudent(${s.id})">Delete</button></td>
    </tr>
  `).join('');
}

function filterStudents() {
  const q   = document.getElementById('studentSearch')?.value.toLowerCase() || '';
  const cls = document.getElementById('classFilter')?.value || '';
  const filtered = DB.students.filter(s =>
    s.name.toLowerCase().includes(q) && (cls === '' || s.cls === cls)
  );
  renderStudents(filtered);
}

function addStudent() {
  const fn = document.getElementById('sFirstName')?.value.trim();
  const ln = document.getElementById('sLastName')?.value.trim();
  if (!fn) { toast('Enter first name', 'error'); return; }
  DB.students.push({
    id: DB.students.length+1,
    name: `${fn} ${ln}`,
    cls: document.getElementById('sClass').value,
    sec: document.getElementById('sSection').value,
    phone: document.getElementById('sPhone').value,
    parent: document.getElementById('sParent').value,
    fee: 'Pending'
  });
  renderStudents(DB.students);
  closeModal('addStudentModal');
  toast('Student added successfully!');
}

function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  const idx = DB.students.findIndex(s => s.id === id);
  if (idx > -1) DB.students.splice(idx, 1);
  renderStudents(DB.students);
  toast('Student deleted.', 'warn');
}

// ===================== RENDER STAFF =====================
function renderStaff() {
  const tbody = document.getElementById('staffTable');
  if (!tbody) return;
  tbody.innerHTML = DB.staff.map(s => `
    <tr>
      <td>${s.id}</td>
      <td><strong>${s.name}</strong></td>
      <td><span class="badge badge-info">${s.role}</span></td>
      <td>${s.subject}</td>
      <td>${s.cls}</td>
      <td>${s.contact}</td>
      <td><button class="btn-outline" style="padding:5px 14px;font-size:0.78rem" onclick="deleteStaff(${s.id})">Delete</button></td>
    </tr>
  `).join('');
}

function addStaff() {
  const nm = document.getElementById('stName')?.value.trim();
  if (!nm) { toast('Enter staff name', 'error'); return; }
  DB.staff.push({
    id: DB.staff.length+1,
    name: nm,
    role: document.getElementById('stRole').value,
    subject: document.getElementById('stSubject').value,
    cls: document.getElementById('stClass').value,
    contact: document.getElementById('stContact').value
  });
  renderStaff();
  closeModal('addStaffModal');
  toast('Staff member added!');
}

function deleteStaff(id) {
  if (!confirm('Delete this staff member?')) return;
  const idx = DB.staff.findIndex(s => s.id === id);
  if (idx > -1) DB.staff.splice(idx, 1);
  renderStaff();
  toast('Staff deleted.', 'warn');
}

// ===================== RENDER FEES =====================
function renderFees() {
  const tbody = document.getElementById('feeTable');
  if (!tbody) return;
  tbody.innerHTML = DB.fees.map(f => `
    <tr>
      <td>${f.id}</td>
      <td><strong>${f.student}</strong></td>
      <td>${f.cls}</td>
      <td>₹${f.amount.toLocaleString()}</td>
      <td>${f.date}</td>
      <td><span class="badge badge-${f.status==='Paid'?'success':f.status==='Pending'?'danger':'warning'}">${f.status}</span></td>
      <td><button class="btn-secondary" style="font-size:0.78rem;padding:5px 12px" onclick="alert('Receipt for ${f.student} – ₹${f.amount}')">Receipt</button></td>
    </tr>
  `).join('');
}

function addFee() {
  const st = document.getElementById('fStudent')?.value.trim();
  if (!st) { toast('Enter student name', 'error'); return; }
  const id = 'RC' + String(DB.fees.length+1).padStart(3,'0');
  DB.fees.push({
    id,
    student: st,
    cls: document.getElementById('fClass').value,
    amount: parseInt(document.getElementById('fAmount').value) || 0,
    date: new Date().toISOString().slice(0,10),
    status: document.getElementById('fStatus').value
  });
  renderFees();
  closeModal('addFeeModal');
  toast('Fee payment recorded!');
}

// ===================== RENDER INCOME =====================
function renderIncome() {
  const tbody = document.getElementById('incomeTable');
  if (!tbody) return;
  tbody.innerHTML = DB.income.map(r => `
    <tr>
      <td>${r.date}</td>
      <td><span class="badge badge-${r.type==='Income'?'success':'danger'}">${r.type}</span></td>
      <td>${r.cat}</td>
      <td>${r.desc}</td>
      <td class="${r.type==='Income'?'income-positive':'income-negative'}">
        ${r.type==='Income'?'+':'−'} ₹${r.amount.toLocaleString()}
      </td>
    </tr>
  `).join('');
}

function addIncome() {
  DB.income.unshift({
    type: document.getElementById('ieType').value,
    cat: document.getElementById('ieCat').value,
    desc: document.getElementById('ieDesc').value,
    amount: parseInt(document.getElementById('ieAmount').value) || 0,
    date: document.getElementById('ieDate').value || new Date().toISOString().slice(0,10)
  });
  renderIncome();
  closeModal('addIncomeModal');
  toast('Record added!');
}

// ===================== RENDER ASSIGNMENTS =====================
function renderAssignments() {
  const tbody = document.getElementById('assignTable');
  if (!tbody) return;
  tbody.innerHTML = DB.assignments.map(a => `
    <tr>
      <td>${a.subject}</td>
      <td>${a.cls}</td>
      <td><strong>${a.title}</strong></td>
      <td>${a.due}</td>
      <td>${a.teacher}</td>
      <td><span class="badge badge-${a.status==='Active'?'success':a.status==='Due Soon'?'warning':'danger'}">${a.status}</span></td>
    </tr>
  `).join('');
}

function addAssignment() {
  const t = document.getElementById('aTitle')?.value.trim();
  if (!t) { toast('Enter assignment title', 'error'); return; }
  DB.assignments.unshift({
    subject: document.getElementById('aSubject').value,
    cls: document.getElementById('aClass').value,
    title: t,
    due: document.getElementById('aDue').value,
    teacher: document.getElementById('aTeacher').value,
    status: 'Active'
  });
  renderAssignments();
  closeModal('addAssignModal');
  toast('Assignment posted!');
}

// ===================== RECENT FEE TABLE (DASHBOARD) =====================
function renderRecentFees() {
  const tbody = document.getElementById('recentFeeTable');
  if (!tbody) return;
  tbody.innerHTML = DB.fees.slice(0,5).map(f => `
    <tr>
      <td><strong>${f.student}</strong></td>
      <td>${f.cls}</td>
      <td>₹${f.amount.toLocaleString()}</td>
      <td>${f.date}</td>
      <td><span class="badge badge-${f.status==='Paid'?'success':f.status==='Pending'?'danger':'warning'}">${f.status}</span></td>
    </tr>
  `).join('');
}

// ===================== CHARTS =====================
function initCharts() {
  const ic = document.getElementById('incomeChart');
  if (ic) {
    new Chart(ic, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          { label:'Income', data:[80000,92000,88000,95000,102000,88000,75000,91000,105000,98000,110000,125000], backgroundColor:'rgba(46,204,113,0.7)', borderRadius:6 },
          { label:'Expense', data:[55000,62000,58000,65000,70000,58000,52000,61000,72000,65000,75000,80000], backgroundColor:'rgba(231,76,60,0.65)', borderRadius:6 }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'top'}}, scales:{y:{beginAtZero:true}} }
    });
  }
  const fc = document.getElementById('feeChart');
  if (fc) {
    new Chart(fc, {
      type: 'doughnut',
      data: {
        labels:['Paid','Pending','Partial'],
        datasets:[{ data:[1140,108,0], backgroundColor:['#2ecc71','#e74c3c','#f39c12'], borderWidth:0 }]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} }
    });
  }
}

// ===================== CHAT =====================
let activeChatUser = null;
function renderChatList() {
  const cl = document.getElementById('chatList');
  if (!cl) return;
  cl.innerHTML = Object.keys(DB.chatMessages).map(u => `
    <div onclick="openChat('${u}')" style="padding:10px 12px;border-radius:10px;cursor:pointer;background:${activeChatUser===u?'var(--primary)':'var(--bg)'};color:${activeChatUser===u?'#fff':'var(--text)'};font-size:0.88rem;transition:all 0.2s">
      💬 ${u}
    </div>
  `).join('');
}

function openChat(user) {
  activeChatUser = user;
  const cw = document.getElementById('chatWith');
  if (cw) cw.textContent = user;
  renderChatList();
  const win = document.getElementById('chatWindow');
  if (!win) return;
  win.innerHTML = (DB.chatMessages[user] || []).map(m => `
    <div class="msg ${m.from==='me'?'sent':'recv'}">
      ${m.text}
      <div class="msg-meta">${m.time}</div>
    </div>
  `).join('');
  win.scrollTop = win.scrollHeight;
}

function sendMessage() {
  const inp = document.getElementById('chatInput');
  if (!inp || !inp.value.trim() || !activeChatUser) return;
  DB.chatMessages[activeChatUser] = DB.chatMessages[activeChatUser] || [];
  DB.chatMessages[activeChatUser].push({ from:'me', text:inp.value.trim(), time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) });
  inp.value = '';
  openChat(activeChatUser);
}
document.getElementById('chatInput')?.addEventListener('keydown', e => { if (e.key==='Enter') sendMessage(); });

// ===================== NOTIFICATIONS =====================
function sendNotif() {
  const msg = document.getElementById('notifMsg')?.value.trim();
  if (!msg) { toast('Enter a message', 'error'); return; }
  const target = document.getElementById('notifTarget')?.value;
  DB.notifications.unshift({ target, msg, time: new Date().toLocaleTimeString() });
  document.getElementById('notifMsg').value = '';
  renderNotifLog();
  toast('Notification sent!');
}

function renderNotifLog() {
  const el = document.getElementById('notifLog');
  if (!el) return;
  el.innerHTML = DB.notifications.map(n => `
    <div style="background:var(--bg);border-radius:10px;padding:14px;border-left:3px solid var(--accent)">
      <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:4px">To: <strong>${n.target}</strong> · ${n.time}</div>
      <div style="font-size:0.9rem">${n.msg}</div>
    </div>
  `).join('') || '<div style="color:var(--text-muted);font-size:0.9rem">No notifications sent yet.</div>';
}

// ===================== ID CARD / ADMIT / MARKSHEET =====================
function generateIdCard() {
  const name = document.getElementById('idName')?.value;
  const cls  = document.getElementById('idClass')?.value;
  const roll = document.getElementById('idRoll')?.value;
  document.getElementById('previewName').textContent = name;
  document.getElementById('previewClass').textContent = cls;
  document.getElementById('previewRoll').textContent = roll;
  document.getElementById('idCardPreview').style.display = 'block';
  toast('ID Card generated!');
}

function downloadIdCard() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:[85,55] });
  doc.setFillColor(15,37,64);
  doc.rect(0,0,85,55,'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(7);
  doc.text('EDUCORE SCHOOL — STUDENT ID CARD', 42.5, 8, {align:'center'});
  doc.setFontSize(12);
  doc.text(document.getElementById('idName').value, 42.5, 22, {align:'center'});
  doc.setFontSize(8);
  doc.text(document.getElementById('idClass').value, 42.5, 30, {align:'center'});
  doc.text('Roll: ' + document.getElementById('idRoll').value, 42.5, 37, {align:'center'});
  doc.setFontSize(6);
  doc.text('Valid: 2024-25', 10, 50);
  doc.text('EduCore ERP', 75, 50, {align:'right'});
  doc.save('id-card.pdf');
}

function generateAdmit() {
  const name = document.getElementById('admitName')?.value;
  const exam = document.getElementById('admitExam')?.value;
  const roll = document.getElementById('admitRoll')?.value;
  document.getElementById('admitNameP').textContent = name;
  document.getElementById('admitExamTitle').textContent = exam;
  document.getElementById('admitRollP').textContent = roll;
  document.getElementById('admitPreview').style.display = 'block';
  toast('Admit card generated!');
}

function generateMarksheet() {
  const name = document.getElementById('markName')?.value;
  document.getElementById('markNameP').textContent = name;
  document.getElementById('marksheetPreview').style.display = 'block';
  toast('Marksheet generated!');
}

// ===================== MODAL HELPERS =====================
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ===================== TOAST =====================
function toast(msg, type='success') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast ${type==='error'?'error':type==='warn'?'warn':''}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('erp_user') || 'Admin';
  const sn = document.getElementById('sidebarName');
  if (sn) sn.textContent = user.charAt(0).toUpperCase() + user.slice(1);

  renderStudents(DB.students);
  renderStaff();
  renderFees();
  renderIncome();
  renderAssignments();
  renderRecentFees();
  renderChatList();
  renderNotifLog();
  initCharts();

  // Default date for income modal
  const ieDate = document.getElementById('ieDate');
  const aDue   = document.getElementById('aDue');
  const today  = new Date().toISOString().slice(0,10);
  if (ieDate) ieDate.value = today;
  if (aDue)   aDue.value   = today;
});




/* ================= CALENDAR ================= */

const holidayData = {

  0: [
    { day: 1, name: "New Year" },
    { day: 26, name: "Republic Day" }
  ],

  1: [
    { day: 14, name: "Maha Shivaratri" }
  ],

  2: [
    { day: 14, name: "Holi" }
  ],

  3: [
    { day: 10, name: "Ram Navami" },
    { day: 14, name: "Dr. Ambedkar Jayanti" }
  ],

  4: [
    { day: 1, name: "Labour Day" }
  ],

  5: [
    { day: 15, name: "Raja Festival" }
  ],

  6: [
    { day: 6, name: "Muharram" }
  ],

  7: [
    { day: 15, name: "Independence Day" },
    { day: 27, name: "Ganesh Puja" }
  ],

  8: [
    { day: 5, name: "Teachers' Day" }
  ],

  9: [
    { day: 2, name: "Gandhi Jayanti" },
    { day: 20, name: "Durga Puja" }
  ],

  10: [
    { day: 5, name: "Kartik Purnima" }
  ],

  11: [
    { day: 25, name: "Christmas" }
  ]
};

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

let currentDate = new Date();



  function renderCalendar(){

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("calendarMonth").innerText =
    `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  let html = "";

  days.forEach(day=>{
    html += `<div class="day-name">${day}</div>`;
  });

  for(let i=0;i<firstDay;i++){
    html += `<div></div>`;
  }

  const monthHolidays = holidayData[month] || [];

  for(let day=1; day<=totalDays; day++){

    let classes = "calendar-day";

    const today = new Date();

    if(
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ){
      classes += " today";
    }

    const isHoliday = monthHolidays.find(h => h.day === day);

    if(isHoliday){
      classes += " holiday";
    }

    html += `
      <div class="${classes}">
        ${day}
      </div>
    `;
  }

  document.getElementById("calendarGrid").innerHTML = html;

  renderHolidayList(month);
}

function renderHolidayList(month){

  const holidayBox =
    document.getElementById("holidayList");

  const holidays =
    holidayData[month] || [];

  if(!holidays.length){

    holidayBox.innerHTML = `
      <div class="holiday-item">
        No holidays this month
      </div>
    `;

    return;
  }

  holidayBox.innerHTML =
    holidays.map(h => `
      <div class="holiday-item">
        🎉 ${h.name} — ${h.day} ${monthNames[month]}
      </div>
    `).join('');
}

function prevMonth(){
  currentDate.setMonth(currentDate.getMonth()-1);
  renderCalendar();
}

function nextMonth(){
  currentDate.setMonth(currentDate.getMonth()+1);
  renderCalendar();
}

/* ================= CUSTOM HOLIDAYS ================= */

let customHolidays =
  JSON.parse(localStorage.getItem("customHolidays")) || [];

/* OPEN MODAL */
function openHolidayModal(){
  document.getElementById("holidayModal")
    .style.display = "flex";
}

/* CLOSE MODAL */
function closeHolidayModal(){
  document.getElementById("holidayModal")
    .style.display = "none";
}

/* SAVE HOLIDAY */
function saveHoliday(){

  const date =
    document.getElementById("holidayDate").value;

  const name =
    document.getElementById("holidayName").value;

  if(!date || !name){
    alert("Please fill all fields");
    return;
  }

  const selectedDate = new Date(date);

  const month = selectedDate.getMonth();
  const day = selectedDate.getDate();

  if(!holidayData[month]){
    holidayData[month] = [];
  }

  holidayData[month].push({
    day: day,
    name: name
  });

  customHolidays.push({
    month,
    day,
    name
  });

  localStorage.setItem(
    "customHolidays",
    JSON.stringify(customHolidays)
  );

  renderCalendar();

  closeHolidayModal();

  document.getElementById("holidayDate").value = "";
  document.getElementById("holidayName").value = "";
}

/* LOAD SAVED HOLIDAYS */
customHolidays.forEach(h=>{

  if(!holidayData[h.month]){
    holidayData[h.month] = [];
  }

  holidayData[h.month].push({
    day: h.day,
    name: h.name
  });

});
/* ================= TIMETABLE ================= */



/* ================= TIMETABLE DATA ================= */

const timetableData =
JSON.parse(localStorage.getItem("schoolTimetable")) || {

  1: [
    ["Monday","English","Math","EVS","Lunch","GK","Drawing","Games"],
    ["Tuesday","Math","English","Hindi","Lunch","EVS","Music","Games"],
    ["Wednesday","EVS","Math","English","Lunch","GK","Drawing","Sports"],
    ["Thursday","English","Hindi","Math","Lunch","EVS","Music","Library"],
    ["Friday","Math","English","GK","Lunch","Drawing","Games","Computer"],
    ["Saturday","Activity","Music","Games","Lunch","Drawing","Library","Sports"]
  ],

  2: [
    ["Monday","English","Math","Science","Lunch","GK","Computer","Games"],
    ["Tuesday","Math","English","Hindi","Lunch","Science","Music","Sports"],
    ["Wednesday","Science","Math","English","Lunch","GK","Computer","Games"],
    ["Thursday","English","Hindi","Math","Lunch","Science","Library","Sports"],
    ["Friday","Math","English","GK","Lunch","Drawing","Games","Computer"],
    ["Saturday","Activity","Music","Games","Lunch","Drawing","Library","Sports"]
  ]
};

/* AUTO CREATE CLASS 3-10 */

for(let i=3;i<=10;i++){

  if(!timetableData[i]){

    timetableData[i] = [
      ["Monday","Math","English","Science","Lunch","SST","Computer","Games"],
      ["Tuesday","English","Math","Physics","Lunch","Chemistry","Biology","Library"],
      ["Wednesday","Science","Math","English","Lunch","GK","Computer","Sports"],
      ["Thursday","English","History","Math","Lunch","Geography","Computer","Games"],
      ["Friday","Math","English","Science","Lunch","Computer","Library","Sports"],
      ["Saturday","Activity","Music","Games","Lunch","Drawing","Library","Sports"]
    ];

  }

}

/* ================= RENDER TIMETABLE ================= */

function renderTimetable(){

  const selectedClass =
    document.getElementById("classSelector").value;

  const data = timetableData[selectedClass];

  let html = "";

  data.forEach(row=>{

  html += `
    <tr>

      <td>
        <strong>${row[0]}</strong>
      </td>

      <td>${row[1]}</td>

      <td>${row[2]}</td>

      <td>${row[3]}</td>

      <td class="lunch-cell">
        ${row[4]}
      </td>

      <td>${row[5]}</td>

      <td>${row[6]}</td>

      <td>${row[7]}</td>

    </tr>
  `;

});

  document.getElementById("timetableBody").innerHTML = html;
}

/* ================= OPEN EDITOR ================= */

function openTimetableEditor(){

  const selectedClass =
    document.getElementById("classSelector").value;

  const data = timetableData[selectedClass];

  let html = `
    <table class="editor-table">

      <thead>
        <tr>
          <th>Day</th>
          <th>P1</th>
          <th>P2</th>
          <th>P3</th>
          <th>Lunch</th>
          <th>P4</th>
          <th>P5</th>
          <th>P6</th>
        </tr>
      </thead>

      <tbody>
  `;

  data.forEach((row,rowIndex)=>{

    html += `
      <tr>
    `;

    row.forEach((cell,colIndex)=>{

      if(colIndex === 0){

        html += `
          <td><strong>${cell}</strong></td>
        `;

      }else{

        html += `
          <td>
            <input
              value="${cell}"
              id="edit-${rowIndex}-${colIndex}">
          </td>
        `;

      }

    });

    html += `</tr>`;

  });

  html += `
      </tbody>
    </table>
  `;

  document.getElementById(
    "timetableEditorContent"
  ).innerHTML = html;

  document.getElementById(
    "timetableModal"
  ).style.display = "flex";
}

/* ================= CLOSE EDITOR ================= */

function closeTimetableEditor(){

  document.getElementById(
    "timetableModal"
  ).style.display = "none";
}

/* ================= SAVE CHANGES ================= */

function saveTimetableChanges(){

  const selectedClass =
    document.getElementById("classSelector").value;

  const data = timetableData[selectedClass];

  data.forEach((row,rowIndex)=>{

    for(let col=1; col<7; col++){

      row[col] =
        document.getElementById(
          `edit-${rowIndex}-${col}`
        ).value;

    }

  });

  localStorage.setItem(
    "schoolTimetable",
    JSON.stringify(timetableData)
  );

  renderTimetable();

  closeTimetableEditor();

  alert("Timetable updated successfully!");

}

/* ================= INIT ================= */

renderTimetable();

