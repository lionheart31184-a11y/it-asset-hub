const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initDB } = require('./database');
const notif = require('./notifications');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize Database
initDB();

const JWT_SECRET = 'it-asset-hub-secret-2026';
const SALT_ROUNDS = 10;

// ============================================================
// AUTH MIDDLEWARE
// ============================================================
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden: insufficient role' });
    next();
  };
}

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Compare password (handle legacy unhashed seed passwords)
    const comparePassword = (plain, hash, cb) => {
      if (hash.startsWith('$2')) {
        bcrypt.compare(plain, hash, cb);
      } else {
        cb(null, plain === hash);
      }
    };

    comparePassword(password, user.password_hash, (err, match) => {
      if (err) return res.status(500).json({ error: 'Auth error' });
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '8h' }
      );
      res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
    });
  });
});

// GET /api/auth/me — get current user from token
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/users — list all users (admin only)
app.get('/api/auth/users', requireAuth, requireRole('admin'), (req, res) => {
  db.all('SELECT id, username, role, name, createdAt FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/auth/users — create new user (admin only)
app.post('/api/auth/users', requireAuth, requireRole('admin'), (req, res) => {
  const { username, password, role, name } = req.body;
  if (!username || !password || !role || !name) return res.status(400).json({ error: 'All fields required' });
  if (!['admin','hr','itstaff','viewer'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const id = 'USR-' + Date.now().toString(36).toUpperCase();
  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Hash error' });
    db.run(
      'INSERT INTO users (id,username,password_hash,role,name,createdAt) VALUES (?,?,?,?,?,?)',
      [id, username, hash, role, name, new Date().toISOString()],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Username already exists' });
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id, user: { id, username, role, name } });
      }
    );
  });
});

// PUT /api/auth/users/:id — update user (admin only)
app.put('/api/auth/users/:id', requireAuth, requireRole('admin'), (req, res) => {
  const { username, role, name, password } = req.body;
  const { id } = req.params;
  if (role && !['admin','hr','itstaff','viewer'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  if (password) {
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Hash error' });
      db.run('UPDATE users SET username=?,role=?,name=?,password_hash=? WHERE id=?',
        [username||'', role||'', name||'', hash, id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        });
    });
  } else {
    db.run('UPDATE users SET username=?,role=?,name=? WHERE id=?',
      [username||'', role||'', name||'', id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
  }
});

// DELETE /api/auth/users/:id (admin only, cannot delete self)
app.delete('/api/auth/users/:id', requireAuth, requireRole('admin'), (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// ============================================================
// PROTECTED DATA ROUTES
// ============================================================

// Assets — admin/itstaff: CRUD, hr/viewer: R
app.get('/api/assets', requireAuth, (req, res) => {
  db.all('SELECT * FROM assets', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/assets', requireAuth, requireRole('admin','itstaff'), (req, res) => {
  const b = req.body;
  const id = b.id || '';
  const cols = ['tag','isNew','serial','financeTag','type','model','doNumber','software','entity','region',
    'warranty','lastAudit','assetTag','remark','processor','ram','storage','status',
    'site','storeroom','rack','row','owner','dept','location','assignedDate','confirmDate','brand','user','spec'];
  const setClause = cols.map(c => c + '=excluded.' + c).join(', ');
  const sql = 'INSERT INTO assets (id,' + cols.join(',') + ') VALUES (?' + ',?'.repeat(cols.length) + ') ON CONFLICT(id) DO UPDATE SET ' + setClause;
  const values = [id, b.tag||'', b.isNew||'', b.serial||'', b.financeTag||'', b.type||'', b.model||'',
    b.doNumber||'', b.software||'', b.entity||'', b.region||'', b.warranty||'', b.lastAudit||'',
    b.assetTag||'', b.remark||'', b.processor||'', b.ram||'', b.storage||'', b.status||'',
    b.site||'', b.storeroom||'', b.rack||'', b.row||'', b.owner||'', b.dept||'',
    b.location||'', b.assignedDate||'', b.confirmDate||'', b.brand||'', b.user||'', b.spec||''];
  db.run(sql, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id });
  });
});

app.delete('/api/assets/:id', requireAuth, requireRole('admin','itstaff'), (req, res) => {
  db.run('DELETE FROM assets WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// Employees — admin/hr: CRUD, itstaff/viewer: R
app.get('/api/employees', requireAuth, (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/employees', requireAuth, requireRole('admin','hr'), (req, res) => {
  const { id, name, dept, role, type, email, location, manager, status, joinDate, offboardDate, offboardReason } = req.body;
  const sql = `INSERT INTO employees (id,name,dept,role,type,email,location,manager,status,joinDate,offboardDate,offboardReason) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, dept=excluded.dept, role=excluded.role, type=excluded.type, email=excluded.email,
    location=excluded.location, manager=excluded.manager, status=excluded.status, joinDate=excluded.joinDate,
    offboardDate=excluded.offboardDate, offboardReason=excluded.offboardReason`;
  db.run(sql, [id, name||'', dept||'', role||'', type||'', email||'', location||'', manager||'', status||'', joinDate||'', offboardDate||'', offboardReason||''], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id });
  });
});

app.delete('/api/employees/:id', requireAuth, requireRole('admin','hr'), (req, res) => {
  db.run('DELETE FROM employees WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// New Hires — admin/hr: CRUD, itstaff: update IT status only, viewer: R
app.get('/api/newhires', requireAuth, (req, res) => {
  db.all('SELECT * FROM new_hires', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/newhires', requireAuth, requireRole('admin','hr','itstaff'), (req, res) => {
  const { id, name, dept, type, role, email, joinDate, manager, equipment, itStatus, pipelineStage } = req.body;
  const sql = `INSERT INTO new_hires (id,name,dept,type,role,email,joinDate,manager,equipment,itStatus,pipelineStage) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, dept=excluded.dept, type=excluded.type, role=excluded.role, email=excluded.email, joinDate=excluded.joinDate,
    manager=excluded.manager, equipment=excluded.equipment, itStatus=excluded.itStatus, pipelineStage=excluded.pipelineStage`;
  db.run(sql, [id||'', name||'', dept||'', type||'', role||'', email||'', joinDate||'', manager||'', equipment||'', itStatus||'', pipelineStage||0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: id||'' });
  });
});

app.delete('/api/newhires/:id', requireAuth, requireRole('admin','hr'), (req, res) => {
  db.run('DELETE FROM new_hires WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// Planning — admin/hr/itstaff: R, admin: CRUD
app.get('/api/planning', requireAuth, (req, res) => {
  db.all('SELECT * FROM q2_plan', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const returned = rows.map(r => ({
      id: r.id, group: r.group_name, role: r.role, type: r.type, model: r.model,
      spec: r.spec, capitalFTE: r.capitalFTE, capitalBPO: r.capitalBPO,
      sgcFTE: r.sgcFTE, sgcBPO: r.sgcBPO, q2Total: r.q2Total, newHiresJoint: r.newHiresJoint
    }));
    res.json(returned);
  });
});

app.post('/api/planning', requireAuth, requireRole('admin'), (req, res) => {
  const { id, group, role, type, model, spec, capitalFTE, capitalBPO, sgcFTE, sgcBPO, q2Total, newHiresJoint } = req.body;
  if (id && typeof id === 'number') {
    const sql = `UPDATE q2_plan SET group_name=?, role=?, type=?, model=?, spec=?, capitalFTE=?, capitalBPO=?, sgcFTE=?, sgcBPO=?, q2Total=?, newHiresJoint=? WHERE id=?`;
    db.run(sql, [group||'', role||'', type||'', model||'', spec||'',
      capitalFTE||0, capitalBPO||0, sgcFTE||0, sgcBPO||0, q2Total||0, newHiresJoint||0, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id });
      }
    );
  } else {
    const sql = `INSERT INTO q2_plan (group_name, role, type, model, spec, capitalFTE, capitalBPO, sgcFTE, sgcBPO, q2Total, newHiresJoint) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    db.run(sql, [group||'', role||'', type||'', model||'', spec||'',
      capitalFTE||0, capitalBPO||0, sgcFTE||0, sgcBPO||0, q2Total||0, newHiresJoint||0],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
      }
    );
  }
});

app.get('/api/q2plan', requireAuth, (req, res) => {
  db.all('SELECT * FROM q2_plan', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const returned = rows.map(r => ({
      id: r.id, group: r.group_name, role: r.role, type: r.type, model: r.model,
      spec: r.spec, capitalFTE: r.capitalFTE, capitalBPO: r.capitalBPO,
      sgcFTE: r.sgcFTE, sgcBPO: r.sgcBPO, q2Total: r.q2Total, newHiresJoint: r.newHiresJoint
    }));
    res.json(returned);
  });
});

app.put('/api/q2plan/:id', requireAuth, requireRole('admin'), (req, res) => {
  const { newHiresJoint } = req.body;
  db.run('UPDATE q2_plan SET newHiresJoint = ? WHERE id = ?', [newHiresJoint, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/planning/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.run('DELETE FROM q2_plan WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Default accounts: admin / password123, hr / password123, itstaff / password123, viewer / password123');
});
