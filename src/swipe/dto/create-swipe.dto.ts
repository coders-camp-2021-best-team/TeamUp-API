import { IsEnum } from 'class-validator';
import { UserSwipeType } from '../../swipe/entities/user-swipe.enum';

export class CreateSwipeDto {
    @IsEnum(UserSwipeType)
    status: UserSwipeType;
}
