import { IsEnum } from 'class-validator';
import { UserSwipeType } from '../../swipe';

export class CreateSwipeDto {
    @IsEnum(UserSwipeType)
    status: UserSwipeType;
}
