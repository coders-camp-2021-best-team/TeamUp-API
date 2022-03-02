// import { Request, Response } from 'express';
// import { validate } from 'class-validator';
// import { ReportDto } from './report.dto';
// import { ReportService } from './report.service';
// import { Controller } from '../common/controller.class';

// export class ReportController extends Controller {
//     constructor() {
//         super('/report');

//         const router = this.getRouter();

// router.get('/report', this.getAllReports)
// router.post('/report/:id', this.createReport)
// router.put('report/:id', this.updateReportStatus)
// }
// async getAllReports(req: Request, res: Response) {
//     res.send(await ReportService.getAllReports())
// }
// async createReport(
//     req: Request<unknown, unknown, ReportDto>,
//     res: Response
// ) {
//     const data = new ReportDto();
//     data.reason = req.body.reason
//     data.status = req.body.status
//     const errors = await validate(data);
//     if (errors.length > 0) {
//         return res.status(400).json(errors);
//     }

//     const created = await ReportService.createReport(data);

//     res.send(created)
// }
// async updateReportStatus(
//     req: Request<unknown, unknown, Partial<ReportDto>>,
//     res:Response
// ) {

// }

// }
