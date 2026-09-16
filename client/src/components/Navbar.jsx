import React ,{ useState ,useEffect } from "react";
import { Link ,useNavigate ,useLocation } from "react-router-dom";

import {
  Building2,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  MapPin,
  LayoutDashboard,
} from "lucide-react";
import {useAuth} from  "../context/AuthContext";
import { notificationService} from "../services/notificationService";

const Navbar = () => {
  const {user, isAuthenticated,layout,role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen,setMobileMenuOpen] = useState(false);
  const [userDropdownOpen,setuserDropdownOpen] = useState(false);
  const [notificationOpen,setNotificationOpen] = useState(false);
  const [notification,setNotification] = useState([]);
  const [unreadCount,setUnreadCount] = useState(0);

  useEffect( () =>{
    
  })
}