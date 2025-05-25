"use client";

import { Suspense } from 'react';
import Loading from '../components/loading';
import VerifyPage from './verifyPage';

export default function VerifyEmail() {
  return <Suspense fallback={<Loading />}>
      <VerifyPage />
    </Suspense>
}