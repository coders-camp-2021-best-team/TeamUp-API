import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { ReportDto, ReportService, UpdateStatusDto } from '.';
import { Controller } from '../common/controller.class';
import { plainToInstance } from 'class-transformer';

export class ReportController extends Controller {
    constructor() {
        super('/report');

        const router = this.getRouter();

        router.post('/report/:id', this.createReport);
        router.get('/report', this.getAllReports);
        router.put('report/:id', this.updateReportStatus);
    }
    async getAllReports(req: Request, res: Response) {
        res.send(await ReportService.getAllReports());
    }
    async createReport(req: Request, res: Response) {
        const body = plainToInstance(ReportDto, req.body as ReportDto);
        body.reason = req.body.reason;
        const errors = await validate(body);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const created = await ReportService.createReport(body);

        res.send(created);
    }
    async updateReportStatus(req: Request, res: Response) {
        const body = plainToInstance(
            UpdateStatusDto,
            req.body as UpdateStatusDto
        );

        const errors = await validate(body);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        const id = req.params.id;

        const updated = await ReportService.updateReportStatus(id, body);

        res.send(updated);
    }
}
