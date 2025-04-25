'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

type MasterType = 'category' | 'organization' | 'representative' | 'region';

interface ActionButtonsProps {
  masterType: MasterType;
  setMasterType: (type: MasterType) => void;
}

export default function ActionButtons({ masterType, setMasterType }: ActionButtonsProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={() => setMasterType('category')}
        className={masterType === 'category' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
      >
        区分一覧
      </Button>
      <Button
        onClick={() => setMasterType('organization')}
        className={masterType === 'organization' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
      >
        関係機関一覧
      </Button>
      <Button
        onClick={() => setMasterType('representative')}
        className={masterType === 'representative' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
      >
        担当者一覧
      </Button>
      <Button
        onClick={() => setMasterType('region')}
        className={masterType === 'region' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
      >
        エリア一覧
      </Button>
    </div>
  );
} 