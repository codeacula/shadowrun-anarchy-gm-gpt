import { Router } from 'express';
import SessionController from '../controllers/sessionController';

const router = Router();
const sessionController = new SessionController();

router.post('/', sessionController.createSession.bind(sessionController));
router.get('/:id', sessionController.getSession.bind(sessionController));
router.put('/:id', sessionController.updateSession.bind(sessionController));
router.delete('/:id', sessionController.deleteSession.bind(sessionController));

export default function setSessionRoutes(app: Router) {
    app.use('/api/sessions', router);
}