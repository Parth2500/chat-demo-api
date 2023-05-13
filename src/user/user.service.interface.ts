export interface IUserService {
  create;
  findAll;
  findOne;
  update;
  remove;
}

export const UserServiceToken = 'UserService';
