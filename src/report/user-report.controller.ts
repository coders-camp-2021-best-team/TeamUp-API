import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { ReportDto, UpdateStatusDto, ReportService } from '.';
import { Controller } from '../common/controller.class';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class ReportController extends Controller {
    constructor() {
        super('/report');

        const router = this.getRouter();

        router.post('/report/:id', this.createReport);
        router.get('/report', this.getAllReports);
        router.put('report/:id', this.updateReportStatus);
    }
    async getAllReports(req: Request, res: Response) {
        return res.status(200).send(await ReportService.getAllReports());
    }
    async createReport(req: Request, res: Response) {
        const body = plainToInstance(ReportDto, req.body as ReportDto);
        body.reason = req.body.reason;
        const errors = await validate(body);
        if (errors.length) {
            return res.status(400).json(errors);
        }

        const created = await ReportService.createReport(body);

        return res.status(201).send(instanceToPlain(created));
    }
    async updateReportStatus(req: Request, res: Response) {
        const body = plainToInstance(
            UpdateStatusDto,
            req.body as UpdateStatusDto
        );

        const errors = await validate(body);
        if (errors.length) {
            return res.status(400).json(errors);
        }
        const id = req.params.id;

        const updated = await ReportService.updateReportStatus(id, body);

        return res.status(200).send(instanceToPlain(updated));
    }
}
