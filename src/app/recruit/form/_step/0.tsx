import { useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import PrivacyModal from '@/app/recruit/form/_component/modal/privacy';

import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';

import Hand from '@/public/recruit/icon/hand.png';

import { RecruitStepProps } from '@/app/recruit/form/page';

import { CheckedState } from '@radix-ui/react-checkbox';
import { motion } from 'framer-motion';

export default function Step0({ go }: RecruitStepProps) {
  const router = useRouter();

  const [openPrivacyModal, setOpenPrivacyModal] = useState<boolean>(false);
  const [isAgreePrivacy, setAgreePrivacy] = useState<CheckedState>('indeterminate');

  const [clicked, setClicked] = useState<boolean>(false);

  const isFinalEdit = useMemo(() => sessionStorage.getItem('recruit:final_edit') === 'true', []);

  return (
    <>
      <motion.div
        initial={{
          scale: 1.1,
          rotate: -10,
        }}
        animate={{
          scale: [1.1, 1],
          rotate: [-20, 0],
          transition: {
            delay: 0.5,
            duration: 0.4,
            repeat: 3,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
      >
        <Image
          src={Hand}
          width={72}
          height={72}
          quality={100}
          className="w-[48px] h-[48px] sm:w-[72px] sm:h-[72px]"
          alt="icon"
        />
      </motion.div>

      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 2.4,
              duration: 0.4,
              ease: 'easeInOut',
            },
          }}
        >
          <p className="font-medium text-lg">안녕하세요!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 3.1,
              duration: 0.4,
              ease: 'easeInOut',
            },
          }}
        >
          <p>WINK 신입 부원 모집에 지원하시겠어요?</p>
        </motion.div>

        <motion.div
          className="flex space-x-2 mt-4 items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 3.8,
              duration: 0.4,
              ease: 'easeInOut',
            },
          }}
        >
          <Checkbox
            id="privacy"
            checked={isAgreePrivacy}
            onCheckedChange={(value) => setAgreePrivacy(value)}
          />
          <Label htmlFor="privacy" className="text-neutral-500 font-normal">
            <span
              className="underline cursor-pointer "
              onClick={(e) => {
                e.preventDefault();
                setOpenPrivacyModal(true);
              }}
            >
              개인정보처리약관
            </span>
            에 동의합니다.
          </Label>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            delay: 4.7,
            duration: 0.4,
            ease: 'easeInOut',
          },
        }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="destructive"
          disabled={clicked}
          onClick={() => {
            setClicked(true);

            router.back();
          }}
        >
          아니요
        </Button>
        <Button
          className="transition-opacity"
          variant="wink"
          disabled={clicked || isAgreePrivacy !== true}
          onClick={() => {
            setClicked(true);

            go((prev) => (isFinalEdit ? 18 : prev + 1));
          }}
        >
          {isFinalEdit ? '수정 완료' : '네'}
        </Button>
      </motion.div>

      <PrivacyModal open={openPrivacyModal} setOpen={setOpenPrivacyModal} />
    </>
  );
}
