import { Request, Response } from 'express';
import { validate } from 'class-validator';
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
        const errors = await validate(query);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const reports = await ReportService.getReports(
            req.session.userID || '',
            query
        );
        if (!reports) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }

        return res.send(instanceToPlain(reports));
    }

    async createReport(req: Request, res: Response) {
        const body = plainToInstance(CreateReportDto, req.body);
        const errors = await validate(body);
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
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const id = req.params.id;

        const updated = await ReportService.updateReport(
            req.session.userID || '',
            id,
            body
        );

        if (!updated) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.send(instanceToPlain(updated));
    }
}
