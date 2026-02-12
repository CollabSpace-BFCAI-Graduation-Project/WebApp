import { JoinViaCodeModal } from "../join-via-code-modal/JoinViaCodeModal";
import { FindSpacesModal } from "../find-spaces-modal/FindSpacesModal";
import { CreateSpaceModal } from "../create-space-modal/CreateSpaceModal";

export const Header = () => {
  const user = {
    name: "mohamed",
  };
  return (
    <header className="flex flex-col lg:flex-row gap-6 items-center justify-between">
      <div className="flex flex-col gap-2 lg:gap-1 items-center lg:items-start">
        <h1 className="text-3xl font-extrabold">My Spaces</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}! 👋</p>
      </div>
      <div className="flex items-center gap-2">
        <FindSpacesModal />
        <JoinViaCodeModal />
        <CreateSpaceModal />
      </div>
    </header>
  );
};
