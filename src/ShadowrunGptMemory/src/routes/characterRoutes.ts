import { Router } from 'express';
import CharacterController from '../controllers/characterController';

const router = Router();
const characterController = new CharacterController();

router.post('/', characterController.createCharacter.bind(characterController));
router.get('/:id', characterController.getCharacter.bind(characterController));
router.put('/:id', characterController.updateCharacter.bind(characterController));
router.delete('/:id', characterController.deleteCharacter.bind(characterController));

export default function setCharacterRoutes(app) {
    app.use('/api/characters', router);
}