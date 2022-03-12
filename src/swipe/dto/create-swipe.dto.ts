import { IsString } from 'class-validator';
import { UserSwipeType } from '../entities';

export class SwipeUserDto {
    @IsString()
    target: string;

    @IsString()
    submittedBy: string;

    @IsString()
    status: UserSwipeType;
}
