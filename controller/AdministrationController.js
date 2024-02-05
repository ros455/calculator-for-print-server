import AdministrationModel from '../model/Administration.js';

export const register = async (req, res) => {
    try {
        const { login, password, color } = req.body;
        const canditate = await AdministrationModel.findOne({ login });

        if (canditate) {
            return res.status(500).json({ message: 'Email already exists' });
          }
    
          const data = await AdministrationModel.create({
            login,
            password,
            isAdmin: false,
            color
        });
    
        res.status(200).json(data);
    } catch(error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register' });
    }
}

export const login = async (req, res) => {
    try {
        const { login, password } = req.body;

        console.log('login',login);
        console.log('password',password);

        const canditate = await AdministrationModel.findOne({ login });

        if (!canditate) {
            return res.status(404).json({ message: 'Login wrong' });
          }

        if(canditate.password !== password) {
            return res.status(400).json({ message: 'Password wrong' });
        }

        res.status(200).json(canditate);

    } catch(error) {
        console.error('Помилка входу:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
}

export const getMe = async (req, res) => {
    try {
      const {login} = req.params;
      const user = await AdministrationModel.findOne({ login });

      console.log('user',user);
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
  
      const { password, ...userData} = user._doc;
      res.json(userData);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: 'Access denied'
      });
    }
  }

export const getAllManagers = async (req, res) => {
    try {
      const query = {
        isAdmin: { $ne: true }, // Додаємо умову, щоб ігнорувати адміністраторів
      };

      const users = await AdministrationModel.find(query);
  
      if (!users) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
  
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: 'Access denied'
      });
    }
  }