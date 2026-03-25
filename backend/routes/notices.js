import express from 'express';
import { Op } from 'sequelize';
import Notice from '../models/Notice.js';
import sequelize from '../config/database.js';

const router = express.Router();

// 1. Get Notices for a Student (Filtering)
router.get('/notices', async (req, res) => {
  try {
    const { branch } = req.query; // e.g., 'CSE'
    
    const notices = await Notice.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { target_branch: branch },
              { target_branch: null }
            ]
          },
          {
            [Op.or]: [
              { expires_at: null },
              { expires_at: { [Op.gt]: new Date() } }
            ]
          }
        ]
      },
      order: [
        ['is_emergency', 'DESC'],
        ['created_at', 'DESC']
      ],
      attributes: ['notice_id', 'title', 'type', 'is_emergency', 'deadline', 'created_at']
    });

    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 2. Get Notices with Priority Scoring
router.get('/notices/priority', async (req, res) => {
  try {
    const { branch } = req.query;

    const notices = await Notice.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { target_branch: branch },
              { target_branch: null }
            ]
          },
          {
            [Op.or]: [
              { expires_at: null },
              { expires_at: { [Op.gt]: new Date() } }
            ]
          }
        ]
      },
      attributes: {
        include: [
          [
            sequelize.literal(`
              CASE 
                WHEN is_emergency = TRUE THEN 100 
                ELSE 
                  ( 
                    CASE 
                      WHEN type = 'exam' THEN 20 
                      WHEN type = 'assignment' THEN 15 
                      WHEN type = 'event' THEN 10 
                      ELSE 5 
                    END 
                    + 
                    CASE 
                      WHEN deadline IS NOT NULL AND deadline <= NOW() + INTERVAL '2 DAYS' THEN 30 
                      WHEN deadline IS NOT NULL AND deadline <= NOW() + INTERVAL '5 DAYS' THEN 20 
                      ELSE 0 
                    END 
                    + 
                    CASE 
                      WHEN DATE(created_at) = CURRENT_DATE THEN 10 
                      ELSE 0 
                    END 
                  ) 
              END
            `),
            'priority_score'
          ]
        ]
      },
      order: [[sequelize.literal('priority_score'), 'DESC']]
    });

    res.json(notices);
  } catch (error) {
    console.error('Error fetching priority notices:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 3. "Why Am I Seeing This?" - Explainability
router.get('/notices/:id/explain', async (req, res) => {
  try {
    const { id } = req.params;
    
    const notice = await Notice.findByPk(id, {
      attributes: [
        'title',
        [
          sequelize.literal(`
            CASE WHEN is_emergency = TRUE THEN 'Emergency notice' 
            ELSE 'Normal notice' END
          `),
          'emergency_reason'
        ],
        [
          sequelize.literal(`
            CASE 
              WHEN deadline IS NOT NULL AND deadline <= NOW() + INTERVAL '2 DAYS' THEN 'Deadline within 2 days'
              WHEN deadline IS NOT NULL AND deadline <= NOW() + INTERVAL '5 DAYS' THEN 'Deadline within 5 days'
              ELSE 'No urgent deadline' 
            END
          `),
          'deadline_reason'
        ],
        [
          sequelize.literal(`
            CASE 
              WHEN DATE(created_at) = CURRENT_DATE THEN 'Recently posted' 
              ELSE 'Posted earlier' 
            END
          `),
          'freshness_reason'
        ]
      ]
    });

    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    res.json(notice);
  } catch (error) {
    console.error('Error fetching explainability:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
