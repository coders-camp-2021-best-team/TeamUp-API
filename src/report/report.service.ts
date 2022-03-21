import { UserReport, GetReportsDto, CreateReportDto, UpdateReportDto } from '.';
import { User } from '../user';
import { UserReportStatus } from './entities';

export const ReportService = new (class {
    async getReports(data: GetReportsDto) {
        const reports = await UserReport.find({
            where: {
                status: data.status || UserReportStatus.PENDING
            },
            relations: ['submittedBy', 'target']
        });

        return reports;
    }

    async createReport(
        currentID: string,
        targetID: string,
        data: CreateReportDto
    ) {
        const currentUser = await User.findOne(currentID);
        const targetUser = await User.findOne(targetID);

        if (!currentUser || !targetUser) {
            return null;
        }

        const report = new UserReport();
        report.reason = data.reason;
        report.submittedBy = currentUser;
        report.target = targetUser;

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
