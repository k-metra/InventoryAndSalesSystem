import { MdOutlineDashboard, MdOutlineCategory, MdOutlinePointOfSale, MdOutlineInventory } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import { IoMdReturnLeft, IoMdPeople } from "react-icons/io";
import { RiCustomerService2Fill } from "react-icons/ri";
import { TbMessageReport } from "react-icons/tb";
import { FaMoneyBill } from "react-icons/fa6";

const sidebarLayout = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: MdOutlineDashboard
  },
  {
    label: 'Inventory',
    children: [
      { label: 'Products', href: '/dashboard/products', icon: AiOutlineProduct },
      { label: 'Categories', href: '/dashboard/categories', icon: MdOutlineCategory },
      { label: 'Suppliers', href: '/dashboard/suppliers', icon: IoPeopleCircleOutline },
    ]
  },
  {
    label: 'Sales',
    children: [
      { label: 'POS', href: '/dashboard/pos', icon: MdOutlinePointOfSale },
      { label: 'Sales History', href: '/dashboard/sales-history', icon: LuHistory },
      { label: 'Returns', href: '/dashboard/returns', icon: IoMdReturnLeft },
    ]
  },
  {
    label: 'Customers',
    children: [
      { label: 'Customer List', href: '/dashboard/customers', icon: RiCustomerService2Fill }
    ]
  },
  {
    label: 'Reports',
    children: [
      { label: 'Sales Reports', href: '/dashboard/sales-reports', icon: TbMessageReport },
      { label: 'Inventory Reports', href: '/dashboard/inventory-reports', icon: MdOutlineInventory },
      { label: 'Profit & Loss', href: '/dashboard/profit-loss', icon: FaMoneyBill },
    ]
  },
  {
    label: 'Settings',
    adminOnly: true,
    children: [
      { label: 'Users', href: '/dashboard/users', icon: IoMdPeople }
    ]
  }
];


export default sidebarLayout;