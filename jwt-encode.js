import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

(async () => {
  const id = uuidv4();
  console.log('🚀 ~ id:', id);

  const data = jwt.sign(
    {
      userId: id,
      email: 'mujahidwaleed11@gmail.com',
      scope: 'USER',
    },
    'just testing',
  );
  console.log('🚀 ~ data:', data);
})();
