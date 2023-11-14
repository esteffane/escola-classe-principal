const { Pool } = require('pg');

const pool = new Pool({
  user:'srhwvxrk',
  host:'bubble.db.elephantsql.com',
  database:'srhwvxrk',
  password:'ni4THRtaefStKG4deyUNZYLzIo7FsYbS',
  port:5432, // Porta padrão do PostgreSQL
});

module.exports = pool;