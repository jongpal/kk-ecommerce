import express from 'express';
import { setCurrentUser, requireAuth } from '@jong_ecommerce/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  setCurrentUser,
  requireAuth,
  (req, res) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
