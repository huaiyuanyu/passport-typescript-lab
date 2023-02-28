import {userModel, database} from "../models/userModel";

const getUserByEmailIdAndPassword = (email: string, password: string) => {
  let user = userModel.findOne(email);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    } else {
      return false;
    }
  } else {
    return "email";
  }
};
const getUserById = (id:any) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user: any, password: string) {
  return user.password === password;
}

const addGitHubUserToDatabase = (profile: any) => {
  const user = {
    id: profile.id,
    name: profile.username,
    email: "",
    password: "",
  }

  database.push(user);

}

export {
  getUserByEmailIdAndPassword,
  getUserById,
  addGitHubUserToDatabase
};
