import React from 'react';
import { format, formatDistance } from 'date-fns';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import * as Popover from '@radix-ui/react-popover';
import { HiX } from 'react-icons/hi';
import { supabase } from '../supabase';

const SHORT = 'hh:mm:ss a';
const DEFAULT = `MMM dd ${SHORT}`;

const SystemInfo = () => {
  const { data: syncRunLogs } = useQuery(
    ['sync_run_log'],
    async () => (await supabase.from('sync_run_log').select('*')).data,
  );
  if (!syncRunLogs) return null;

  const latestRun = syncRunLogs[syncRunLogs.length - 1];

  const createdAt = new Date(latestRun.created_at);
  const endedAt = new Date(latestRun?.ended_at || 0);
  const df = createdAt.getDate() === endedAt.getDate() ? SHORT : DEFAULT;

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
                <td className="text-right">{format(createdAt, df)}</td>
              </tr>
              <tr>
                <td className="text-left">end</td>
                <td className="text-right">{format(endedAt, df)}</td>
              </tr>
              <tfoot>
                <tr>
                  <th className="text-left">duration</th>
                  <th className="text-right">
                    {formatDistance(endedAt, createdAt)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
          <Popover.Close className="absolute right-0 top-0" aria-label="Close">
            <HiX className="rounded-full p-1 text-2xl text-neutral-500 hover:bg-neutral-600" />
          </Popover.Close>
          <Popover.Arrow className="fill-neutral-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default React.memo(SystemInfo);
