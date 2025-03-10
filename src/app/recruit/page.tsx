'use client';

import { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import { IconMRocket } from 'react-fluentui-emoji/lib/modern';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { domains } from '@/app/recruit/_constant/domain';
import { qnas } from '@/app/recruit/_constant/qna';

import DomainCard from '@/app/recruit/_component/domain-card';
import InfoCard, { Info } from '@/app/recruit/_component/info-card';
import Items from '@/app/recruit/_component/items';
import RecruitTitle from '@/app/recruit/_component/recruit-title';
import Rocket from '@/app/recruit/_component/rocket';
import ScrollDown from '@/app/recruit/_component/scroll-down';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion';
import { Button } from '@/ui/button';

import Api from '@/api';
import Recruit from '@/api/type/schema/recruit';
import { useApi } from '@/api/useApi';

import { useRecruitStore } from '@/store/recruit';
import { useUserStore } from '@/store/user';

import { formatDate, nowDate, toDate } from '@/util';

import BackgroundImage from '@/public/recruit/background.webp';

import Loading from '@/app/loading';

import { endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { toast } from 'sonner';

export default function RecruitPage() {
  const router = useRouter();

  const { user } = useUserStore();
  const { confetti, setConfetti } = useRecruitStore();

  const [isApi, startApi] = useApi();

  const [recruit, setRecruit] = useState<Recruit>();

  const infos = useMemo<Info[]>(() => {
    if (!recruit) return [];

    return [
      {
        title: '지원 기간',
        content: `${formatDate(recruit.recruitStartDate, true)} ~\n${formatDate(recruit.recruitEndDate, true)}`,
      },
      {
        title: '면접 일정',
        content: `${formatDate(recruit.interviewStartDate, true)} ~\n${formatDate(recruit.interviewEndDate, true)}`,
      },
    ];
  }, [recruit]);

  useEffect(() => {
    startApi(async () => {
      const { recruit } = await Api.Domain.Recruit.getLatestRecruit();
      setRecruit(recruit);
    });
  }, []);

  useEffect(() => {
    if (!confetti) return;
    setConfetti(false);
  }, [confetti]);

  if (isApi) return <Loading />;

  return (
    <>
      <div className="relative w-[100vw] h-[calc(100dvh-56px)] bg-black">
        <Image
          src={BackgroundImage}
          alt="background"
          width={1920}
          height={1080}
          quality={100}
          placeholder="blur"
          className="w-full h-full object-cover"
        />

        <Rocket />
        <RecruitTitle year={recruit?.year ?? new Date().getFullYear()} />
        <ScrollDown />
      </div>

      <div className="flex flex-col space-y-10 sm:space-y-24 pt-20 sm:pt-28">
        <Items
          title="모집 개요"
          description={`${recruit?.year ?? new Date().getFullYear()}년도 ${recruit?.semester ?? 1}학기 WINK 신입 부원 모집 개요`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infos.map((info) => (
              <InfoCard key={info.title} {...info} />
            ))}
          </div>
        </Items>

        <Items title="모집 분야" description="함께 활동을 적극적으로 할 수 있는 누구나 환영합니다">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {domains.map((domain) => (
              <DomainCard key={domain.tag} {...domain} />
            ))}
          </div>
        </Items>
      </div>

      {recruit && (
        <div className="flex flex-col items-center justify-center py-20 sm:py-28 space-y-10 sm:space-y-14">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="size-[48px] sm:size-[72px]">
              <IconMRocket size="auto" />
            </div>
            <p className="text-lg sm:text-2xl font-bold">
              {recruit.year}년도 {recruit.semester}학기 WINK 신규 부원
            </p>
          </div>

          {isBefore(startOfDay(nowDate()), startOfDay(toDate(recruit.recruitStartDate))) ? (
            <p className="text-neutral-500">
              {formatDate(startOfDay(toDate(recruit.recruitStartDate)), true)}부터 지원할 수
              있습니다.
            </p>
          ) : isAfter(startOfDay(nowDate()), endOfDay(toDate(recruit.recruitEndDate))) ? (
            <p className="text-neutral-500">지원이 종료되었습니다.</p>
          ) : !user ? (
            <Button variant="wink" onClick={() => router.push(`/recruit/form`)}>
              지원하기
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                Api.Request.removeToken();
                toast.success('로그아웃되었습니다.');
              }}
            >
              로그아웃
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col items-center py-20 sm:py-28 bg-wink-50">
        <Items title="자주 묻는 질문">
          <Accordion
            type="single"
            collapsible
            className="w-[300px] sm:w-[608px] bg-white rounded-3xl px-6"
          >
            {qnas.map(({ question, answer }, index) => (
              <AccordionItem key={index} value={index.toString()}>
                <AccordionTrigger className="text-sm sm:text-base text-start">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-base ">{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Items>
      </div>

      {confetti && <Confetti recycle={false} />}
    </>
  );
}
