const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/profiles — Create new profile
router.post('/', async (req, res) => {
  const {
    name, breed, location, imageUrl, phone, whatsapp,
    bio, birthday, weight, color, chip_id, vaccinations
  } = req.body;

  if (!name) return res.status(400).json({ error: 'Pet name is required' });

  try {
    const result = await pool.query(
      `INSERT INTO user_profiles 
        (name, breed, location, imageurl, phone, whatsapp, bio, birthday, weight, color, chip_id, vaccinations)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [name, breed, location, imageUrl, phone, whatsapp, bio, birthday, weight, color, chip_id,
       JSON.stringify(vaccinations || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/profiles/:id — Get profile by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Profile not found' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/profiles/:id — Update profile
router.put('/:id', async (req, res) => {
  const {
    name, breed, location, imageUrl, phone, whatsapp,
    bio, birthday, weight, color, chip_id, vaccinations
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE user_profiles SET
        name=$1, breed=$2, location=$3, imageurl=$4, phone=$5, whatsapp=$6,
        bio=$7, birthday=$8, weight=$9, color=$10, chip_id=$11, vaccinations=$12
       WHERE id=$13 RETURNING *`,
      [name, breed, location, imageUrl, phone, whatsapp, bio, birthday, weight, color, chip_id,
       JSON.stringify(vaccinations || []), req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;