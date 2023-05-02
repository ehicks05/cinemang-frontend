import React from 'react';
import { formatDistance } from 'date-fns';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

const SystemInfo = () => {
  const { data: systemInfo } = useQuery(
    ['systemInfo'],
    async () => (await supabase.from('system_info').select('*').limit(1)).data?.[0],
  );
  if (!systemInfo) return null;

  const { loadStartedAt, loadFinishedAt } = systemInfo;
  return (
    <HiOutlineInformationCircle
      className="text-3xl text-green-500 hover:text-green-400"
      title={`Sync started at ${loadStartedAt}, finished at ${loadFinishedAt}, took ${formatDistance(
        new Date(loadFinishedAt),
        new Date(loadStartedAt),
      )}`}
    />
  );
};

export default React.memo(SystemInfo);
