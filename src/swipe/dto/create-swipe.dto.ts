import { IsEnum } from 'class-validator';
import { SwipeType } from '../entities/swipe-type.enum';

export class CreateSwipeDto {
    @IsEnum(SwipeType)
    status: SwipeType;
}
