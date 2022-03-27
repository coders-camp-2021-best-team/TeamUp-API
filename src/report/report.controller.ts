import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
    AdminMiddleware,
    AuthMiddleware,
    Controller,
    validate
} from '../common';
import {
    CreateReportDto,
    GetReportsDto,
    ReportService,
    UpdateReportDto
} from '.';

export class ReportController extends Controller {
    constructor() {
        super('/report');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getReports);
        router.post('/:id', this.createReport);
        router.put('/:id', AdminMiddleware, this.updateReport);
    }

    async getReports(req: Request, res: Response) {
        const query = validate(GetReportsDto, req.query);

        const reports = await ReportService.getReports(req.user!, query);

        return res.send(instanceToPlain(reports));
    }

    async createReport(req: Request, res: Response) {
        const targetID = req.params.id;
        const body = validate(CreateReportDto, req.body);

        const created = await ReportService.createReport(
            req.user!,
            targetID,
            body
        );

        return res.status(StatusCodes.CREATED).send(instanceToPlain(created));
    }

    async updateReport(req: Request, res: Response) {
        const id = req.params.id;
        const body = validate(UpdateReportDto, req.body);

        const updated = await ReportService.updateReport(req.user!, id, body);

        return res.send(instanceToPlain(updated));
    }
}
