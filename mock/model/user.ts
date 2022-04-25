interface ModelUser {
  userId: string;
  userName: string;
  password: string;
  role: Auth.RoleType;
}

const users: ModelUser[] = [
  {
    userId: '0',
    userName: 'Soybean',
    password: 'soybean',
    role: 'super'
  },
  {
    userId: '1',
    userName: 'Super',
    password: 'super',
    role: 'super'
  },
  {
    userId: '2',
    userName: 'Admin',
    password: 'admin',
    role: 'admin'
  },
  {
    userId: '3',
    userName: 'User01',
    password: 'user01',
    role: 'user'
  }
];

export default users;
