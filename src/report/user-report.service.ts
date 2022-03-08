import { UserReport, CreateReportDto, UpdateStatusDto } from '.';

export const ReportService = new (class {
    async getAllReports() {
        const reports = await UserReport.find();

        if (!reports.length) {
            return null;
        }
        return reports;
    }

    async createReport(data: CreateReportDto) {
        const report = new UserReport();

        report.reason = data.reason;

        return report.save();
    }

    async updateReportStatus(reportID: string, statusData: UpdateStatusDto) {
        const report = await UserReport.findOne(reportID);

        if (!report) {
            return null;
        }

        report.status = statusData.status || report.status;

        return report.save();
    }
})();
