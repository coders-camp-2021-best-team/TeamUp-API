import { getRepository } from 'typeorm';
import { UserReport, ReportDto, UpdateStatusDto } from '.';

export const ReportService = new (class {
    async getAllReports() {
        const reportsRepo = getRepository(UserReport);

        const reports = await reportsRepo.find();

        if (!reports.length) {
            return null;
        }
        return reports;
    }
    async createReport(report: ReportDto) {
        const reportsRepo = getRepository(UserReport);

        return reportsRepo.save(report);
    }
    async updateReportStatus(reportID: string, statusData: UpdateStatusDto) {
        const reportRepo = getRepository(UserReport);

        const report = await reportRepo.findOne(reportID);

        if (!report) {
            return null;
        }

        report.status = statusData.status || report.status;

        return reportRepo.save(report);
    }
})();
