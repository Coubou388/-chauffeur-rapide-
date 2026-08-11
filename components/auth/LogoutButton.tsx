import { logoutAction } from "@/app/actions/logout";
import { buttonClasses } from "@/components/ui/Button";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button type="submit" className={buttonClasses("ghost", "sm", className)}>
        Déconnexion
      </button>
    </form>
  );
}
