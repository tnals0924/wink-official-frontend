import { ComponentType, Dispatch, SetStateAction } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ############################################################################################

export type Step<T> = ComponentType<T>[];

export interface StepProps<T extends FieldValues> {
  go: Dispatch<SetStateAction<number>>;
  setStep: Dispatch<SetStateAction<number>>;
  form: UseFormReturn<T>;
}

// ############################################################################################

export function nowDate() {
  return new Date();
}

export function toDate(date: Date | string): Date {
  if (date instanceof Date) return date;
  return new Date(new Date(date).getTime() + 9 * 60 * 60 * 1000);
}

export function formatDateApi(date: Date | string) {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date | string, showDayOfWeek = false) {
  const d = toDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

  return `${year}년 ${month}월 ${day}일${showDayOfWeek ? ` (${dayOfWeek})` : ''}`;
}

// ############################################################################################

export function nowPath() {
  return window.location.href.substring(window.location.origin.length);
}

// ############################################################################################

export async function uploadS3(
  files: FileList,
  getUrl: () => Promise<{ url: string }>,
  timeout: number = 10,
) {
  const promise = Array.from(files).map(async (file) => {
    const { url } = await getUrl();

    await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    const imageUrl = url.replace(/\?.+$/, '');

    return new Promise<string>((resolve, reject) => {
      let attempts = 0;

      const checkInterval = setInterval(async () => {
        try {
          const response = await fetch(imageUrl);

          if (response.ok) {
            clearInterval(checkInterval);
            resolve(imageUrl);
          }

          attempts++;
          if (attempts >= timeout) {
            clearInterval(checkInterval);
            reject(new Error(`${timeout}초가 넘어 사진 업로드가 취소되었습니다.`));
          }
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  });

  return await toast
    .promise(Promise.all(promise), {
      loading: '사진을 업로드하고 있습니다.',
      success: (imgs) => `${imgs.length}개의 사진을 업로드했습니다.`,
      error: '사진을 업로드하던 중 오류가 발생했습니다.',
    })
    .unwrap();
}
