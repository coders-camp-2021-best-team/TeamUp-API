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

        return res.send(await ReportService.getReports(query));
    }

    async createReport(req: Request, res: Response) {
        const body = plainToInstance(CreateReportDto, req.body);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const created = await ReportService.createReport(body);

        return res.status(StatusCodes.CREATED).send(instanceToPlain(created));
    }

    async updateReport(req: Request, res: Response) {
        const body = plainToInstance(UpdateReportDto, req.body);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const id = req.params.id;

        const updated = await ReportService.updateReport(id, body);

        return res.send(instanceToPlain(updated));
    }
}
