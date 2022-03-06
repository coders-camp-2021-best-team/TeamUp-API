import { getRepository } from 'typeorm';
import { UserReport } from '.';
import { ReportDto } from '.';

export const ReportService = new (class {
    getAllReports() {
        const reportsRepo = getRepository(UserReport);

        return reportsRepo.find();
    }
    createReport(report: ReportDto) {
        const reportsRepo = getRepository(UserReport);

        return reportsRepo.save(report);
    }
    updateReportStatus(
        reportID: string,
        status: Partial<Pick<ReportDto, 'status'>>
    ) {
        const reportsRepo = getRepository(UserReport);

        return reportsRepo.update(reportID, status);
    }
})();
