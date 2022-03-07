import { getRepository } from 'typeorm';
import { UserReport, ReportDto, UpdateStatusDto } from '.';

export const ReportService = new (class {
    getAllReports() {
        const reportsRepo = getRepository(UserReport);

        return reportsRepo.find();
    }
    createReport(report: ReportDto) {
        const reportsRepo = getRepository(UserReport);

        return reportsRepo.save(report);
    }
    updateReportStatus(reportID: string, status: UpdateStatusDto) {
        const reportsRepo = getRepository(UserReport);

        return reportsRepo.update(reportID, status);
    }
})();
