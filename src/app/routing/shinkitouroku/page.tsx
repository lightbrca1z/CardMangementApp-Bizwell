'use client';

import React from "react";
import Header from '@/components/Header';
import FormContainer from './components/FormContainer';

export default function RoutingFormPage() {
  return (
    <div className="min-h-screen bg-green-100 p-6 sm:p-12 font-sans">
      <Header />
      <FormContainer />
    </div>
  );
}
