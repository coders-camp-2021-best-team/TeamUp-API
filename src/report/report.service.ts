// import { getRepository } from "typeorm";
// import { ReportDto, UserReportStatus } from './report.dto';
// import { UserReport } from "./report.entity";

// export const ReportService = new (class {
//     getAllReports() {
//         const reportsRepo = getRepository(UserReport)

//         return reportsRepo.find();
//     }
//     createReport(report: ReportDto) {
//         const reportsRepo = getRepository(UserReport)

//         return reportsRepo.save(report)
//     }
//     updateReportStatus(reportID: string, status: UserReportStatus) {
//         const reportsRepo = getRepository(UserReport)

//         return reportsRepo.update(reportID, { status })
//     }
// })
