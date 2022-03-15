import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { GameService } from '../../game';
import { Middleware } from './middleware.type';

export const gameMiddleware: Middleware = async (req, res, next) => {
    const id = req.params.id;
    try {
        const game = await GameService.getGame(id);

        if (!game) {
            return res.status(StatusCodes.NOT_FOUND).send('Game not found');
        }
        next();
    } catch (error) {
        console.error(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
};
