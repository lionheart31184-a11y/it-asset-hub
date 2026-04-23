const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initDB() {
  db.serialize(() => {
    // 1. Assets
    db.run(`CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      tag TEXT,
      isNew TEXT,
      serial TEXT,
      financeTag TEXT,
      type TEXT,
      model TEXT,
      doNumber TEXT,
      software TEXT,
      entity TEXT,
      region TEXT,
      warranty TEXT,
      lastAudit TEXT,
      assetTag TEXT,
      remark TEXT,
      processor TEXT,
      ram TEXT,
      storage TEXT,
      status TEXT,
      site TEXT,
      storeroom TEXT,
      rack TEXT,
      row TEXT,
      owner TEXT,
      dept TEXT,
      location TEXT,
      assignedDate TEXT,
      confirmDate TEXT,
      brand TEXT,
      user TEXT,
      spec TEXT
    )`);

    // 2. Employees
    db.run(`CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT,
      dept TEXT,
      role TEXT,
      type TEXT,
      email TEXT,
      location TEXT,
      manager TEXT,
      status TEXT,
      joinDate TEXT,
      offboardDate TEXT,
      offboardReason TEXT
    )`);
    db.run("ALTER TABLE employees ADD COLUMN offboardDate TEXT", () => {});
    db.run("ALTER TABLE employees ADD COLUMN offboardReason TEXT", () => {});

    // 3. New Hires
    db.run(`CREATE TABLE IF NOT EXISTS new_hires (
      id TEXT PRIMARY KEY,
      name TEXT,
      dept TEXT,
      type TEXT,
      role TEXT,
      email TEXT,
      joinDate TEXT,
      manager TEXT,
      equipment TEXT,
      itStatus TEXT,
      pipelineStage INTEGER
    )`);
    db.run("ALTER TABLE new_hires ADD COLUMN email TEXT", () => {});

    // 4. Q2 Plan
    db.run(`CREATE TABLE IF NOT EXISTS q2_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT,
      role TEXT,
      type TEXT,
      model TEXT,
      spec TEXT,
      capitalFTE INTEGER,
      capitalBPO INTEGER,
      sgcFTE INTEGER,
      sgcBPO INTEGER,
      q2Total INTEGER,
      newHiresJoint INTEGER
    )`);

    // 5. Users (auth)
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password_hash TEXT,
      role TEXT,
      name TEXT,
      createdAt TEXT
    )`);

    // Seed DB only if ALL tables are empty (cold start)
    db.get("SELECT (SELECT COUNT(*) FROM assets) + (SELECT COUNT(*) FROM new_hires) as total", (err, row) => {
      if (row && row.total === 0) {
        seedDB();
      } else {
        console.log("Database initialized & ready.");
      }
    });
  });
}

function seedDB() {
  console.log("Seeding Database from local files...");

  let assetCatalog = [];
  try {
    const assetsJs = fs.readFileSync(path.join(__dirname, 'assets.js'), 'utf8');
    eval(assetsJs);
  } catch(e) { console.error("Could not read assets.js", e); }

  let q2RecruitmentPlan = [];
  try {
    const q2Js = fs.readFileSync(path.join(__dirname, 'headcount-q2.js'), 'utf8');
    eval(q2Js);
  } catch(e) { console.error("Could not read headcount-q2.js", e); }

  const deployedAssets = [
    {id:'DA-001',type:'Laptop',brand:'Dell',model:'XPS 15',spec:'Intel i7, 16GB, 512GB SSD',serial:'SN-DL001',user:'Sarah Chen',dept:'Engineering',location:'HQ F3',status:'In Use',warranty:'2026-08-15'},
    {id:'DA-002',type:'Laptop',brand:'Apple',model:'MacBook Pro 14',spec:'Apple M2 Pro, 16GB, 512GB SSD',serial:'SN-AP002',user:'Marcus Reid',dept:'Engineering',location:'HQ F3',status:'In Use',warranty:'2027-01-20'},
    {id:'DA-003',type:'Monitor',brand:'LG',model:'27UK850',spec:'27" 4K UHD IPS',serial:'SN-LG003',user:'',dept:'IT',location:'IT Storeroom',status:'Available',warranty:'2025-12-31'},
    {id:'DA-004',type:'Desktop PC',brand:'HP',model:'EliteDesk 800',spec:'Intel i5, 8GB, 256GB SSD',serial:'SN-HP004',user:'Linda Torres',dept:'Finance',location:'HQ F2',status:'In Use',warranty:'2025-06-30'},
    {id:'DA-005',type:'Phone',brand:'Samsung',model:'Galaxy S24',spec:'Snapdragon 8 Gen 3, 12GB, 256GB',serial:'SN-SG005',user:'James Park',dept:'Sales',location:'Remote',status:'In Use',warranty:'2026-03-10'},
    {id:'DA-006',type:'Printer',brand:'Canon',model:'ImageRUNNER',spec:'Colour laser A3 MFP',serial:'SN-CN006',user:'',dept:'HR',location:'HQ F1',status:'Maintenance',warranty:'2024-12-31'},
    {id:'DA-007',type:'Network',brand:'Cisco',model:'Catalyst 9300',spec:'48-port PoE+, 25G uplink',serial:'SN-CS007',user:'',dept:'IT',location:'Server Room',status:'In Use',warranty:'2028-05-01'},
    {id:'DA-008',type:'Tablet',brand:'Apple',model:'iPad Pro 12.9',spec:'Apple M2, 8GB, 256GB',serial:'SN-AP008',user:'Mia Long',dept:'Marketing',location:'HQ F4',status:'In Use',warranty:'2026-11-22'},
    {id:'DA-009',type:'Laptop',brand:'Lenovo',model:'ThinkPad X1',spec:'Intel i7, 16GB, 512GB SSD',serial:'SN-LV009',user:'',dept:'IT',location:'IT Storeroom',status:'Available',warranty:'2027-03-15'},
    {id:'DA-010',type:'Monitor',brand:'Dell',model:'UltraSharp U27',spec:'27" QHD IPS',serial:'SN-DL010',user:'Carlos Diaz',dept:'Operations',location:'HQ F2',status:'In Use',warranty:'2026-07-18'},
    {id:'DA-011',type:'Software',brand:'Microsoft',model:'Office 365',spec:'Microsoft 365 Business Standard',serial:'SW-M365-011',user:'All Staff',dept:'IT',location:'Cloud',status:'In Use',warranty:'2025-12-31'},
    {id:'DA-012',type:'Laptop',brand:'Dell',model:'Latitude 5530',spec:'Intel i5, 16GB, 512GB SSD',serial:'SN-DL012',user:'',dept:'IT',location:'IT Storeroom',status:'Available',warranty:'2027-09-30'}
  ];

  const employees = [
    {id:'EMP-001',name:'Sarah Chen',dept:'Engineering',role:'Senior Developer',email:'s.chen@corp.com',location:'HQ F3',manager:'David Kim',status:'Active'},
    {id:'EMP-002',name:'Marcus Reid',dept:'Engineering',role:'Lead Engineer',email:'m.reid@corp.com',location:'HQ F3',manager:'David Kim',status:'Active'},
    {id:'EMP-003',name:'Linda Torres',dept:'Finance',role:'Finance Analyst',email:'l.torres@corp.com',location:'HQ F2',manager:'Karen Wu',status:'Active'},
    {id:'EMP-004',name:'James Park',dept:'Sales',role:'Sales Manager',email:'j.park@corp.com',location:'Remote',manager:'CEO',status:'Active'},
    {id:'EMP-005',name:'Mia Long',dept:'Marketing',role:'Creative Director',email:'m.long@corp.com',location:'HQ F4',manager:'VP Mktg',status:'Active'},
    {id:'EMP-006',name:'Carlos Diaz',dept:'Operations',role:'Ops Coordinator',email:'c.diaz@corp.com',location:'HQ F2',manager:'Ops Head',status:'Active'},
    {id:'EMP-007',name:'Priya Nair',dept:'HR',role:'HR Business Partner',email:'p.nair@corp.com',location:'HQ F1',manager:'HR Director',status:'On Leave'},
    {id:'EMP-008',name:'Tom Walsh',dept:'IT',role:'IT Support',email:'t.walsh@corp.com',location:'HQ F5',manager:'IT Manager',status:'Active'}
  ];

  const newHires = [
    {id:'NH-001',name:'Alex Johnson',dept:'Engineering',role:'Backend Developer',joinDate:'2026-04-14',manager:'Marcus Reid',equipment:'Laptop, Monitor, Keyboard, Mouse',itStatus:'In Progress',pipelineStage:1},
    {id:'NH-002',name:'Bella Morris',dept:'Marketing',role:'Digital Marketer',joinDate:'2026-04-21',manager:'Mia Long',equipment:'Laptop, Headset',itStatus:'Pending',pipelineStage:0},
    {id:'NH-003',name:'Chris Nguyen',dept:'Finance',role:'Junior Analyst',joinDate:'2026-04-07',manager:'Linda Torres',equipment:'Desktop, Monitor, Phone',itStatus:'Ready',pipelineStage:3},
    {id:'NH-004',name:'Diana Sousa',dept:'HR',role:'HR Coordinator',joinDate:'2026-03-31',manager:'Priya Nair',equipment:'Laptop, Monitor',itStatus:'Completed',pipelineStage:5}
  ];

  const stmtAsset = db.prepare('INSERT OR IGNORE INTO assets (id,tag,isNew,serial,financeTag,type,model,doNumber,software,entity,region,warranty,lastAudit,assetTag,remark,processor,ram,storage,status,site,storeroom,rack,row,owner,dept,location,assignedDate,confirmDate,brand,user,spec) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  assetCatalog.forEach(a => {
    stmtAsset.run(a.id, a.tag||'', a.isNew||'', a.serial||'', a.financeTag||'', a.type||'', a.model||'', a.doNumber||'', a.software||'', a.entity||'', a.region||'', a.warranty||'', a.lastAudit||'', a.assetTag||'', a.remark||'', a.processor||'', a.ram||'', a.storage||'', a.status||'', a.site||'', a.storeroom||'', a.rack||'', a.row||'', a.owner||'', a.dept||'', a.location||'', a.assignedDate||'', a.confirmDate||'', a.brand||'', a.user||'', a.spec||'');
  });
  deployedAssets.forEach(a => {
    stmtAsset.run(a.id, '', '', a.serial||'', '', a.type||'', a.model||'', '', '', '', '',
      a.warranty||'', '', '', '', '', '', '', a.status||'', '',
      '', '', '', '', a.dept||'', a.location||'', '', '', a.brand||'', a.user||'', a.spec||'');
  });
  stmtAsset.finalize();

  const stmtEmp = db.prepare('INSERT OR IGNORE INTO employees (id,name,dept,role,type,email,location,manager,status,joinDate) VALUES (?,?,?,?,?,?,?,?,?,?)');
  employees.forEach(e => stmtEmp.run(e.id, e.name, e.dept, e.role, e.type||'', e.email, e.location, e.manager, e.status, e.joinDate||''));
  stmtEmp.finalize();

  const stmtHire = db.prepare('INSERT OR IGNORE INTO new_hires (id,name,dept,type,role,email,joinDate,manager,equipment,itStatus,pipelineStage) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  newHires.forEach(h => stmtHire.run(h.id, h.name, h.dept, h.type||'New Hire', h.role, h.email||'', h.joinDate||'', h.manager||'', h.equipment||'', h.itStatus||'Pending', h.pipelineStage||0));
  stmtHire.finalize();

  const stmtQ2 = db.prepare('INSERT INTO q2_plan (group_name, role, type, model, spec, capitalFTE, capitalBPO, sgcFTE, sgcBPO, q2Total, newHiresJoint) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  q2RecruitmentPlan.forEach(q => {
    stmtQ2.run(q.group||'', q.role||'', q.type||'', q.model||'', q.spec||'',
      q.capitalFTE||0, q.capitalBPO||0, q.sgcFTE||0, q.sgcBPO||0, q.q2Total||0, q.newHiresJoint||0);
  });
  stmtQ2.finalize();

  // Seed default users (all passwords are "password123" — bcrypt hash)
  const defaultUsers = [
    { id: 'USR-001', username: 'admin', password_hash: '$2b$10$1l2OAtIqJoViOuk.siaVWuPauVVwhLkNtRmg28H0hIJrZWUmDastW', role: 'admin', name: 'Admin User', createdAt: new Date().toISOString() },
    { id: 'USR-002', username: 'hr', password_hash: '$2b$10$1l2OAtIqJoViOuk.siaVWuPauVVwhLkNtRmg28H0hIJrZWUmDastW', role: 'hr', name: 'HR Manager', createdAt: new Date().toISOString() },
    { id: 'USR-003', username: 'itstaff', password_hash: '$2b$10$1l2OAtIqJoViOuk.siaVWuPauVVwhLkNtRmg28H0hIJrZWUmDastW', role: 'itstaff', name: 'IT Staff', createdAt: new Date().toISOString() },
    { id: 'USR-004', username: 'viewer', password_hash: '$2b$10$1l2OAtIqJoViOuk.siaVWuPauVVwhLkNtRmg28H0hIJrZWUmDastW', role: 'viewer', name: 'Viewer', createdAt: new Date().toISOString() },
  ];
  const stmtUser = db.prepare('INSERT OR IGNORE INTO users (id,username,password_hash,role,name,createdAt) VALUES (?,?,?,?,?,?)');
  defaultUsers.forEach(u => stmtUser.run(u.id, u.username, u.password_hash, u.role, u.name, u.createdAt));
  stmtUser.finalize();

  console.log("Database seeded successfully!");
}

module.exports = { db, initDB };
