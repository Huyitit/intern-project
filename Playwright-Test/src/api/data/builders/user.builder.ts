import { User } from "../../models/user.model";
import { env } from '../../config/env';
import { UserDataGenerator } from '../generators/user-data.generator';

export class UserBuilder{

  private user: Partial<User> = {};
  constructor(){
  }
  
  setValidNewUser(){
    this.user = {
      full_name: UserDataGenerator.validFullname(),
      username: UserDataGenerator.validUsername(),
      password: UserDataGenerator.validPassword(),
      email: UserDataGenerator.validEmail(),
      phone: UserDataGenerator.validPhone(false, false),
      role: 'user',
    };
    return this;
  }

  setExistedAdmin(){
    this.user = {
      username: env.User.admin.username,
      password: env.User.admin.password,
      role: 'admin',
    }
    return this;
  }

  setExistedUser(){
    this.user = {
      username: env.User.normal.username,
      password: env.User.normal.password,
      role: 'user',
    }
    return this;
  }

  setId(id: number){
    this.user.id = id;
    return this;
  }

  setFull_name(full_name:string){
    this.user.full_name = full_name;
    return this;
  }

  setUserName(username:string){
    this.user.username = username;
    return this;
  }

  setPassword(password:string){
    this.user.password = password;
    return this;
  }

  setPhone(phone:string){
    this.user.phone = phone;
    return this;
  }

  setEmail(email:string){
    this.user.email = email;
    return this;
  }

  setRole(role:'admin' | 'user'){
    this.user.role = role;
    return this;
  }

  build():User {
    return this.user as User;
  }
}