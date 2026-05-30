const app = document.getElementById('app');
const navButtons = [...document.querySelectorAll('.bottomNav button')];

const STORAGE_KEY = 'family-room-v1-state';
const defaultState = {
  starterStatus: 'occupied',
  family: [
    { name:'Bird', icon:'🎨', location:'Arkansas', time:'11:00 AM', weather:'Hot', status:'Creating' },
    { name:'Denise', icon:'🌻', location:'California', time:'9:00 AM', weather:'Sunny', status:'Happy' },
    { name:'Ashton', icon:'🎧', location:'California', time:'9:00 AM', weather:'Sunny', status:'Busy' },
    { name:'Nick', icon:'🛠️', location:'Montana', time:'10:00 AM', weather:'Cold', status:'Working' }
  ],
  submissions: [],
  completed: []
};
let state = loadState();
let currentRoom = 'home';

function loadState(){
  try { return { ...defaultState, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) }; }
  catch { return defaultState; }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function toast(msg){
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2200);
}
function setRoom(room){
  currentRoom = room;
  navButtons.forEach(btn=>btn.classList.toggle('active', btn.dataset.room === room));
  render();
  window.scrollTo({top:0, behavior:'smooth'});
}
navButtons.forEach(btn=>btn.addEventListener('click',()=>setRoom(btn.dataset.room)));
document.getElementById('notifyBtn').addEventListener('click',()=>toast('Notifications placeholder 🔔'));

function familyCards(){
  return `<div class="familyRow">${state.family.map(member=>`
    <button class="familyCard" onclick="openMyRoom('${member.name}')">
      <div class="avatar">${member.icon}</div>
      <b>${member.name}</b>
      <small>${member.location}</small>
      <small>${member.time} · ${member.weather}</small>
      <span class="tag">${member.status}</span>
    </button>`).join('')}</div>`;
}
window.openMyRoom = function(name){ setRoom('myroom'); setTimeout(()=>toast(`${name}'s room placeholder 🛏️`),100); };

function home(){
  return `<section class="roomPage">
    <div class="hero">
      <span class="tag">🌞 Today is ready</span>
      <h2>Today’s Family Pick is live!</h2>
      <p>Daily challenge, game, question, fact, and vote are waiting for the family.</p>
      <div class="heroActions">
        <button class="primary" onclick="setRoom('kitchen')">Join Challenge</button>
        <button class="secondary" onclick="setRoom('backyard')">Play Game</button>
      </div>
    </div>

    <div class="sectionTitle"><h3>Tomorrow’s Starter</h3><span>private mission</span></div>
    <div class="card mission big">
      <h4><span class="pulse">🚪</span> The Bathroom is occupied.</h4>
      <p>Someone has been selected to create tomorrow’s family mission. The topic stays secret until morning.</p>
      <div class="heroActions"><button class="secondary" onclick="setRoom('bathroom')">Bathroom</button></div>
    </div>

    <div class="sectionTitle"><h3>Daily Lineup</h3><span>5 things every day</span></div>
    <div class="grid">
      <div class="card"><h4>🍳 Daily Challenge</h4><p>Created by yesterday’s Family Starter.</p></div>
      <div class="card"><h4>🌳 Daily Game</h4><p>Random from family submissions and stockpile.</p></div>
      <div class="card"><h4>💬 Question of the Day</h4><p>Sweet, funny, chaotic, or nostalgic.</p></div>
      <div class="card"><h4>🧠 Word / Fact</h4><p>A tiny daily sparkle for everybody.</p></div>
      <div class="card big"><h4>🍽️ Vote at the Dining Room Table</h4><p>Vote on past challenge entries. Winners move to The Fridge.</p></div>
    </div>

    <div class="sectionTitle"><h3>Our Family</h3><span>time · weather · status</span></div>
    ${familyCards()}

    <div class="sectionTitle"><h3>Featured</h3><span>house previews</span></div>
    <div class="grid">
      <div class="card"><h4>🧲 The Fridge</h4><p>Challenge Hall of Fame and featured winners.</p></div>
      <div class="card"><h4>📌 Bulletin Board</h4><p>Announcements, events, and important posts.</p></div>
    </div>
  </section>`;
}
function roomTemplate(icon, title, desc, items){
  return `<section class="roomPage"><div class="roomHeader"><h2>${icon} ${title}</h2><p>${desc}</p></div><div class="list">${items.map(i=>`<div class="listItem"><strong>${i[0]}</strong><span>${i[1]}</span></div>`).join('')}</div></section>`;
}
function kitchen(){return roomTemplate('🍳','The Kitchen','Challenges are cooked up here.',[
  ['Daily Challenge','Today’s main family challenge lives here.'],['Active Challenges','Photo, drawing, craft, memory, silly, and food challenges.'],['Challenge Responses','Everyone’s submissions collect under each challenge.'],['Cook Up a Challenge','Create a new challenge from My Desk or the Kitchen.']]);}
function backyard(){return roomTemplate('🌳','The Backyard','Games and playful family stuff.',[
  ['Daily Game','Random game selected from submissions and stockpile.'],['Bingo','Family bingo cards.'],['I Spy','Post a photo and let everyone guess.'],['Trivia & Quizzes','Family knowledge, favorites, and funny facts.'],['Coloring / Dares / Word Search','Simple games for kids and adults.']]);}
function hallway(){return roomTemplate('🖼️','The Hallway','Gallery, albums, places, times, and memories.',[
  ['New Photos','Recent family pictures.'],['Old Photos','Memory albums and old family photos.'],['Challenge Gallery','Photos and drawings from activities.'],['AI Photos','Funny or creative AI family images.']]);}
function bathroom(){return `<section class="roomPage"><div class="roomHeader"><h2>🚪 The Bathroom</h2><p>Private daily starter mission area.</p></div><div class="card mission big"><h4>You’re in The Bathroom.</h4><p>Your mission placeholder: create tomorrow’s contribution topic before bed. The public only sees that the bathroom is occupied.</p><div class="heroActions"><button class="primary" onclick="acceptMission()">Accept Mission</button><button class="secondary" onclick="submitMission()">Submit Mission</button></div></div></section>`;}
window.acceptMission=()=>{state.starterStatus='accepted';saveState();toast('Mission accepted. The Bathroom is occupied. 🫡')};
window.submitMission=()=>{state.starterStatus='submitted';saveState();toast('Tomorrow’s Starter has submitted the mission. 📬')};
function myRoom(){return `<section class="roomPage"><div class="roomHeader"><h2>🛏️ My Room</h2><p>Profile, personal activity, records, and My Desk.</p></div><div class="grid"><div class="card big"><h4>✏️ My Desk</h4><p>Submit challenges, games, questions, prompts, dares, trivia, and ideas.</p><div class="heroActions"><button class="primary" onclick="setRoom('desk')">Go to My Desk</button></div></div><div class="card"><h4>📬 My Submissions</h4><p>${state.submissions.length} saved so far.</p></div><div class="card"><h4>✅ Completed Stuff</h4><p>Games, votes, questions, and challenges you finished.</p></div></div></section>`;}
function desk(){return `<section class="roomPage"><div class="roomHeader"><h2>✏️ My Desk</h2><p>Create something for the family anytime.</p></div><form class="card form" onsubmit="addSubmission(event)"><div class="field"><label>Type</label><select id="subType"><option>Challenge</option><option>Game</option><option>Question of the Day</option><option>Trivia</option><option>I Spy</option><option>Dare</option><option>Voting Idea</option><option>Word / Fact</option></select></div><div class="field"><label>Title</label><input id="subTitle" placeholder="Name your idea" required /></div><div class="field"><label>Details</label><textarea id="subDetails" placeholder="Write the prompt, instructions, question, or idea"></textarea></div><button class="primary" type="submit">Save Submission</button></form></section>`;}
window.addSubmission=(e)=>{e.preventDefault();state.submissions.unshift({type:subType.value,title:subTitle.value,details:subDetails.value,created:new Date().toISOString()});saveState();toast('Saved to My Submissions ✨');setRoom('myroom');};
function more(){return `<section class="roomPage"><div class="roomHeader"><h2>✨ More Rooms</h2><p>The rest of the family house.</p></div><div class="moreGrid">
  ${mini('🛏️','My Room','Profile + activity hub','myroom')}${mini('✏️','My Desk','Submit family ideas','desk')}${mini('🚪','Bathroom','Private starter mission','bathroom')}${mini('🍽️','Dining Room Table','Voting and polls','dining')}${mini('🧲','The Fridge','Hall of Fame winners','fridge')}${mini('📌','Bulletin Board','Family announcements','board')}${mini('🗂️','The Office','Archive + settings','office')}
  </div></section>`;}
function mini(icon,title,desc,room){return `<button class="miniRoom" onclick="setRoom('${room}')"><span style="font-size:26px">${icon}</span><b>${title}</b><span>${desc}</span></button>`;}
function dining(){return roomTemplate('🍽️','The Dining Room Table','Voting, polls, and family picks.',[
  ['Vote of the Day','Pick favorites from past challenges.'],['Polls','This-or-that and family decisions.'],['Voting History','Past votes move to The Office.'],['Winners','Winning entries get featured on The Fridge.']]);}
function fridge(){return roomTemplate('🧲','The Fridge','Challenge Hall of Fame and featured winners.',[
  ['Challenge Hall of Fame','Best drawings, photos, outfits, crafts, and funny posts.'],['Featured Winners','Weekly and daily winners displayed proudly.'],['Family Favorites','The stuff moms would put on the fridge.']]);}
function board(){return roomTemplate('📌','Bulletin Board','Announcements and important family posts.',[
  ['Announcements','Family news, health updates, travel, events.'],['Birthdays','Birthday reminders and celebration posts.'],['Important Notes','Pinned info everyone should see.']]);}
function office(){return roomTemplate('🗂️','The Office','Completed archive, family records, and settings.',[
  ['Completed Archive','All completed challenges, games, votes, and questions.'],['Family Records','Daily Starter history, participation, winners.'],['Settings','Members, privacy, notifications, deadlines, unlock times.']]);}

function render(){
  const views = {home,kitchen,backyard,hallway,more,bathroom,myroom,desk,dining,fridge,board,office};
  app.innerHTML = (views[currentRoom] || home)();
}
window.setRoom = setRoom;

if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
render();
