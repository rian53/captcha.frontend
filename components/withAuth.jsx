import { useEffect } from 'react';
import { userService } from 'services';

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    
    useEffect(() => {
      const checkAdmin = async () => {
        const isAdmin = await userService.isAdmin();
        if (isAdmin === false) {
          userService.logout();
        }
      };
      checkAdmin();
    }, []);

    return <Component {...props} />;
  };
}
