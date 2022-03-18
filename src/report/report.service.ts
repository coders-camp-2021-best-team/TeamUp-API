import { UserReport, GetReportsDto, CreateReportDto, UpdateReportDto } from '.';

export const ReportService = new (class {
    async getReports(data: GetReportsDto) {
        const reports = await UserReport.find({
            where: {
                status: data.status
            }
        });

        return reports;
    }

    async createReport(data: CreateReportDto) {
        const report = new UserReport();

        report.reason = data.reason;

        return report.save();
    }

    async updateReport(id: string, data: UpdateReportDto) {
        const report = await UserReport.findOne(id);

        if (!report) {
            return null;
        }

        report.status = data.status || report.status;

        return report.save();
    }
})();
