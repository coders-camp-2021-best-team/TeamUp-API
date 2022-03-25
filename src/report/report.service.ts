import { User, UserRank } from '../user';
import { CreateReportDto, GetReportsDto, UpdateReportDto, UserReport } from '.';
import { UserReportStatus } from './entities';

export const ReportService = new (class {
    async getReports(userID: string, data: GetReportsDto) {
        const user = await User.findOne(userID);
        if (!user || user.rank !== UserRank.ADMIN) {
            return null;
        }

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

    async updateReport(userID: string, id: string, data: UpdateReportDto) {
        const user = await User.findOne(userID);
        if (!user || user.rank !== UserRank.ADMIN) {
            return null;
        }

        const report = await UserReport.findOne(id);
        if (!report) {
            return null;
        }

        report.status = data.status || report.status;

        return report.save();
    }
})();
