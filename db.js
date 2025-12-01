const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync('form.db');
db.exec(`
CREATE TABLE IF NOT EXISTS form_submissions (
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL,
  number TEXT NOT NULL,
  time INTEGER NOT NULL
);
`);


if (require.main == module) {
  const all = db.prepare('SELECT * FROM form_submissions').all();
  console.log(all.map(entry => {
    return JSON.parse(JSON.stringify(entry));
  }));
} else {
  module.exports = db
}
