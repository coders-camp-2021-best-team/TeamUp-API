import { NotFoundException } from '../common';
import { User } from '../user';
import { CreateReportDto, GetReportsDto, UpdateReportDto, UserReport } from '.';
import { UserReportStatus } from './entities';

export const ReportService = new (class {
    async getReports(user: User, data: GetReportsDto) {
        return UserReport.find({
            where: {
                status: data.status || UserReportStatus.PENDING
            },
            relations: ['submittedBy', 'target']
        });
    }

    async createReport(
        currentUser: User,
        targetID: string,
        data: CreateReportDto
    ) {
        const targetUser = await User.findOne(targetID);
        if (!targetUser) throw new NotFoundException();

        const report = new UserReport();
        report.reason = data.reason;
        report.submittedBy = currentUser;
        report.target = targetUser;

        return report.save();
    }

    async updateReport(user: User, id: string, data: UpdateReportDto) {
        const report = await UserReport.findOne(id);
        if (!report) throw new NotFoundException();

        report.status = data.status || report.status;

        return report.save();
    }
})();
