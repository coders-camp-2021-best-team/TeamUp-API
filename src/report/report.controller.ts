import { Request, Response } from 'express';
import { validateSync } from 'class-validator';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { AuthMiddleware, Controller } from '../common';
import {
    GetReportsDto,
    CreateReportDto,
    UpdateReportDto,
    ReportService
} from '.';

export class ReportController extends Controller {
    constructor() {
        super('/report');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getReports);
        router.post('/:id', this.createReport);
        router.put('/:id', this.updateReport);
    }

    async getReports(req: Request, res: Response) {
        const query = plainToInstance(GetReportsDto, req.query);
        const errors = validateSync(query);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        return res.send(instanceToPlain(await ReportService.getReports(query)));
    }

    async createReport(req: Request, res: Response) {
        const body = plainToInstance(CreateReportDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const currentID = req.session.userID;
        const targetID = req.params.id;

        if (!currentID) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }

        const created = await ReportService.createReport(
            currentID,
            targetID,
            body
        );

        if (!created) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.status(StatusCodes.CREATED).send(instanceToPlain(created));
    }

    async updateReport(req: Request, res: Response) {
        const body = plainToInstance(UpdateReportDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const id = req.params.id;

        const updated = await ReportService.updateReport(id, body);

        return res.send(instanceToPlain(updated));
    }
}
