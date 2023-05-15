import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, mapTo, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUser } from '../entities/user.interface';
import { IUserService } from './iservices/user.service.interface';
import * as bcrypt from 'bcryptjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //#region create
  create(createUser: IUser): Observable<IUser> {
    return this.isMailExists(createUser.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.hashPassword(createUser.password).pipe(
            switchMap((hashedPassword: string) => {
              createUser.password = hashedPassword;
              return from(this.userRepository.save(createUser)).pipe(
                switchMap((user: IUser) => this.findById(user.Id)),
              );
            }),
          );
        } else {
          throw new HttpException(
            'Email is already in use!',
            HttpStatus.CONFLICT,
          );
        }
      }),
    );
  }
  //#endregion

  //#region find
  findAll(options: IPaginationOptions): Observable<Pagination<IUser>> {
    return from(paginate<User>(this.userRepository, options));
  }

  findById(id: number): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: {
          Id: id,
        },
      }),
    ).pipe(
      catchError(() => {
        throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
      }),
    );
  }

  findByEmail(email: string): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: {
          email: email,
        },
      }),
    ).pipe(
      catchError(() => {
        throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
      }),
    );
  }

  findByEmailForLogin(email: string): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: {
          email: email,
        },
        select: {
          Id: true,
          email: true,
          username: true,
          password: true,
        },
      }),
    ).pipe(
      catchError(() => {
        throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
      }),
    );
  }

  findByUserName(username: string): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: {
          username: username,
        },
      }),
    ).pipe(
      catchError(() => {
        throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
      }),
    );
  }
  //#endregion

  //#region update
  update(id: number, updateUser: IUser) {
    return `This action updates a #${id} user`;
  }
  //#endregion

  //#region delete
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  //#endregion

  //#region utility
  private isMailExists(email: string): Observable<boolean> {
    return from(
      this.userRepository.findOne({
        where: {
          email: email,
        },
      }),
    ).pipe(map((user: IUser) => (user ? true : false)));
  }

  private hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  private validatePassword(
    password: string,
    storedPassword: string,
  ): Observable<boolean> {
    return from(bcrypt.compare(password, storedPassword));
  }
  //#endregion

  //#region  login
  login(loginUser: IUser): Observable<boolean> {
    return this.findByEmailForLogin(loginUser.email).pipe(
      switchMap((foundUser: IUser) => {
        if (foundUser) {
          return this.validatePassword(
            loginUser.password,
            foundUser.password,
          ).pipe(
            switchMap((match: boolean) => {
              if (match) {
                return this.findById(foundUser.Id).pipe(map(() => true));
              } else {
                throw new HttpException(
                  'Login was not successful, wrong credentials!',
                  HttpStatus.UNAUTHORIZED,
                );
              }
            }),
          );
        } else {
          throw new HttpException('No User Found!', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }
  //#endregion
}
