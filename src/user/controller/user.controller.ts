import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, switchMap } from 'rxjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUser } from '../entities/user.interface';
import {
  IUserHelperService,
  UserHelperServiceToken,
} from '../services/iservices/user-helper.service.interface';
import {
  IUserService,
  UserServiceToken,
} from '../services/iservices/user.service.interface';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: IUserService,
    @Inject(UserHelperServiceToken)
    private readonly userHelperService: IUserHelperService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<IUser> {
    return this.userHelperService
      .createUserDtoToEntity(createUserDto)
      .pipe(switchMap((user: IUser) => this.userService.create(user)));
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Observable<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Observable<boolean> {
    return this.userHelperService.loginUserDtoToEntity(loginUserDto).pipe(
      switchMap((user: IUser) => {
        return this.userService.login(user);
      }),
    );
  }
}
