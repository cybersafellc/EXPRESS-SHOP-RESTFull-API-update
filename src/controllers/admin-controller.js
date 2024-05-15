import adminService from "../services/admin-service.js";

const login = async (req, res, next) => {
  try {
    const result = await adminService.login(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    req.body.admin_id = await req.id;
    const result = await adminService.refreshToken(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const result = await adminService.getUsers();
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const lockedUsers = async (req, res, next) => {
  try {
    const result = await adminService.lockedUsers(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

export default { login, refreshToken, getUsers, lockedUsers };
