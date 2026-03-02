""

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface UserAvatarProps{
  name?: string;
  imageUrl?: string;
}

const UserAvatar : React.FC<UserAvatarProps> = ({ name = "Test User", imageUrl}) => {
  return (
    <Avatar>
      {imageUrl && <AvatarImage src={imageUrl} />}
      <AvatarFallback className="bg-primary text-white">{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}

function getInitials(name: string){
  if(!name) return "U";
  const names = name.trim().split(" ").filter(Boolean);
  if(names.length === 0) return "U";
  if(names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length-1][0]).toUpperCase();
}

export default UserAvatar
