import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { IUser } from 'src/user/entities/user.interface';

export interface IUserService {
  create(createUser: IUser): Observable<IUser>;
  findAll(options: IPaginationOptions): Observable<Pagination<IUser>>;
  findById(id: number): Observable<IUser>;
  findByIdPromise(id: number): Promise<IUser>;
  findByEmail(email: string): Observable<IUser>;
  findByEmailForLogin(email: string): Observable<IUser>;
  findByUserName(username: string): Observable<IUser>;
  update;
  remove;
  login(loginUser: IUser): Observable<string>;
}

export const UserServiceToken = 'UserService';
