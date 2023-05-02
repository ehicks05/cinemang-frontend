import React from 'react';
import { format, formatDistance } from 'date-fns';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import * as Popover from '@radix-ui/react-popover';
import { HiX } from 'react-icons/hi';
import { supabase } from '../supabase';

const DF = 'MMM dd hh:mm:ss a';

const SystemInfo = () => {
  const { data: systemInfo } = useQuery(
    ['systemInfo'],
    async () => (await supabase.from('system_info').select('*').limit(1)).data?.[0],
  );
  if (!systemInfo) return null;

  const syncStartedAt = new Date(systemInfo.loadStartedAt);
  const syncEndedAt = new Date(systemInfo.loadFinishedAt);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="IconButton" aria-label="Update dimensions">
          <HiOutlineInformationCircle className="text-3xl text-green-500 hover:text-green-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={5} className="z-20">
          <div className="z-50 w-60 rounded bg-neutral-700 p-2 text-neutral-200 shadow-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th colSpan={2}>Sync Stats</th>
                </tr>
              </thead>
              <tr>
                <td className="text-left">start</td>
                <td className="text-right">{format(syncStartedAt, DF)}</td>
              </tr>
              <tr>
                <td className="text-left">end</td>
                <td className="text-right">{format(syncEndedAt, DF)}</td>
              </tr>
              <tfoot>
                <tr>
                  <th className="text-left">duration</th>
                  <th className="text-right">
                    {formatDistance(syncEndedAt, syncStartedAt)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
          <Popover.Close className="absolute top-0 right-0" aria-label="Close">
            <HiX className="rounded-full p-1 text-2xl text-neutral-500 hover:bg-neutral-600" />
          </Popover.Close>
          <Popover.Arrow className="fill-neutral-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default React.memo(SystemInfo);
