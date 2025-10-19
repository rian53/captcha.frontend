import { userService } from "services";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { canceled } = router.query;

  useEffect(() => {
    if (canceled) {
      console.log('Order canceled - continue to shop around and checkout when you are ready.');

      setTimeout(() => {
        const user = userService.userValue;
        if (!user) {
          router.push("/account/login");
        } else {
          router.push("/home");
        }
      }, 2000);
    } else {
      const user = userService.userValue;
      if (!user) {
        router.push("/account/login");
      } else {
        router.push("/home");
      }
    }
  }, [router, canceled]);

  return (
    <>
      {canceled && <p className="text-red-500">Pedido cancelado.</p>}
    </>
  );
}
