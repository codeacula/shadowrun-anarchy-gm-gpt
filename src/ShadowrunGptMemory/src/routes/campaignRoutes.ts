import { Router } from 'express';
import CampaignController from '../controllers/campaignController';

const router = Router();
const campaignController = new CampaignController();

router.post('/', campaignController.createCampaign.bind(campaignController));
router.get('/:id', campaignController.getCampaign.bind(campaignController));
router.put('/:id', campaignController.updateCampaign.bind(campaignController));
router.delete('/:id', campaignController.deleteCampaign.bind(campaignController));

export default function setCampaignRoutes(app: Router) {
    app.use('/api/campaigns', router);
}