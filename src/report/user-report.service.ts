import { getRepository } from 'typeorm';
import { UserReport, CreateReportDto, UpdateStatusDto } from '.';

export const ReportService = new (class {
    async getAllReports() {
        const reportsRepo = getRepository(UserReport);

        const reports = await reportsRepo.find();

        if (!reports.length) {
            return null;
        }
        return reports;
    }

    async createReport(data: CreateReportDto) {
        const reportsRepo = getRepository(UserReport);

        const report = new UserReport();

        report.reason = data.reason;

        return await reportsRepo.save(report);
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
