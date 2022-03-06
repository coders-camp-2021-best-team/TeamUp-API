import { Request, Response } from 'express';
import { IsEnum, validate } from 'class-validator';
import { ReportDto, ReportService, UserReportStatus } from '.';
import { Controller } from '../common/controller.class';
import { plainToInstance } from 'class-transformer';

class updateStatus {
    @IsEnum(UserReportStatus)
    status: UserReportStatus;
}

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
        const data = new ReportDto();
        data.reason = req.body.reason;
        data.status = req.body.status;
        const errors = await validate(data);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const created = await ReportService.createReport(data);

        res.send(created);
    }
    async updateReportStatus(req: Request, res: Response) {
        const body = plainToInstance(updateStatus, req.body as updateStatus);

        const errors = await validate(body);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        const id = req.params.id;

        const updated = await ReportService.updateReportStatus(id, body);

        res.send(updated);
    }
}
