'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getMenuItems } from '@/layout/_constant/header-item';

import MobileMenu from '@/layout/_components/mobile-menu';
import ChangeMyInfoModal from '@/layout/_components/modal/change-my-info';
import ChangeMyPasswordModal from '@/layout/_components/modal/change-my-password';
import NavItem from '@/layout/_components/nav-item';

import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Skeleton } from '@/ui/skeleton';

import Api from '@/api';

import { useUserStore } from '@/store/user';

import { nowPath } from '@/util';

import logo from '@/public/logo.png';

import { FolderCode, KeyRound, LogOut, UserIcon, UserPen } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  loading: boolean;
}

export default function Header({ loading }: HeaderProps) {
  const router = useRouter();

  const { user } = useUserStore();

  const [changeMyPasswordModalOpen, setChangeMyPasswordModalOpen] = useState(false);
  const [changeMyInfoModalOpen, setChangeMyInfoModalOpen] = useState(false);

  const menuItems = getMenuItems(user);

  return (
    <>
      <header className="fixed top-0 flex w-full h-14 bg-white items-center justify-between px-4 sm:px-8 shadow z-50">
        <Link href="/">
          <Image
            src={logo}
            alt={logo.src}
            width={200}
            height={80}
            quality={100}
            priority
            className="w-[48px] h-[19.5px] sm:w-[64px] sm:h-[26px]"
          />
        </Link>

        <nav className="hidden sm:flex items-center space-x-4">
          {menuItems.map((item) => (
            <NavItem key={item.title} item={item} />
          ))}

          {loading ? (
            <Button variant="ghost" className="rounded-lg">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-[36.3px] h-4" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt="avatar" />
                    <AvatarFallback>
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>

                  <p>{user.name}</p>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setChangeMyInfoModalOpen(true)}>
                    <UserPen />내 정보 수정
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChangeMyPasswordModalOpen(true)}>
                    <KeyRound />내 비밀번호 변경
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/application')}>
                    <FolderCode />내 애플리케이션
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      Api.Request.removeToken();
                      toast.success('로그아웃되었습니다.');
                    }}
                  >
                    <LogOut />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavItem
              item={{ title: 'Login', href: `/auth/login?next=${encodeURIComponent(nowPath())}` }}
            />
          )}
        </nav>

        <nav className="block sm:hidden">
          <MobileMenu
            loading={loading}
            user={user}
            menuItems={menuItems}
            setChangeMyInfoModalOpen={setChangeMyInfoModalOpen}
            setChangeMyPasswordModalOpen={setChangeMyPasswordModalOpen}
          />
        </nav>
      </header>

      <ChangeMyInfoModal open={changeMyInfoModalOpen} setOpen={setChangeMyInfoModalOpen} />
      <ChangeMyPasswordModal
        open={changeMyPasswordModalOpen}
        setOpen={setChangeMyPasswordModalOpen}
      />
    </>
  );
}
