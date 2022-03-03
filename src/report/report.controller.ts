import { Request, Response } from 'express';
import { IsEnum, validate, IsString, IsNotEmpty } from 'class-validator';
import { ReportDto, ReportService, UserReport, UserReportStatus } from '.';
import { Controller } from '../common/controller.class';
import { adminAuthMiddleware } from '../common/middlewares/admin.middleware';
import { loggedInUserMiddleware } from '../common/middlewares/logged-in.middleware';
// TODO Inject proper auth middleware

class updateStatus {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsEnum(UserReportStatus)
    status: UserReportStatus;
}

export class ReportController extends Controller {
    constructor() {
        super('/report');

        const router = this.getRouter();

        router.post('/report/:id', loggedInUserMiddleware, this.createReport);
        router.get('/report', adminAuthMiddleware, this.getAllReports);
        router.put('report/:id', adminAuthMiddleware, this.updateReportStatus);
    }
    async getAllReports(req: Request, res: Response) {
        res.send(await ReportService.getAllReports());
    }
    async createReport(
        req: Request<Pick<UserReport, 'id'>, unknown, ReportDto>,
        res: Response
    ) {
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
    async updateReportStatus(
        req: Request<
            Pick<UserReport, 'id'>,
            unknown,
            Pick<ReportDto, 'status'>
        >,
        res: Response
    ) {
        const data = new updateStatus();

        data.id = req.params.id;
        data.status = req.body.status;

        const errors = await validate(data);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        const updated = await ReportService.updateReportStatus(
            data.id,
            data.status
        );

        res.send(updated);
    }
}
