import { useState, useEffect } from 'react';
import { ZardioLoading } from '@/components/shared/ZardioLoading';
import { userService } from 'services';
import { AddEdit } from 'components/settings/profile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'components/ui/card';
import { CircleUserRound } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = userService.userValue;
    
    if (!currentUser) {
      console.error('Usuario no encontrado');
      return;
    }

    userService
      .getById()
      .then(x => setUser(x))
      .catch(console.error);
  }, []);

  return (
    <Card className="bg-sidebar rounded-xl">
      <div className="rounded-xl bg-background">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CircleUserRound className="size-6 text-muted-foreground" />
            Perfil
          </CardTitle>
          <CardDescription>
            Gestiona la información de tu perfil
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-4">
                       <AddEdit user={user} />
      

        </CardContent>
      </div>
    </Card>
  );
}

