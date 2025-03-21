import { format, formatDistance } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { supabase } from '~/utils/supabase';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const SHORT = 'hh:mm:ss a';
const DEFAULT = `yyyy-MM-dd'T'${SHORT}`;

interface RunLog {
	created_at: string;
	ended_at: string | null;
	id: string;
}

const useLog = () => {
	const [syncRunLog, setSyncRunLog] = useState<RunLog>();

	useEffect(() => {
		const doIt = async () => {
			const { data } = await supabase
				.from('sync_run_log')
				.select('*')
				.order('created_at', { ascending: false })
				.limit(1)
				.single();
			if (data) setSyncRunLog(data);
		};

		doIt();
	}, []);

	return { syncRunLog };
};

const SystemInfo = () => {
	const { syncRunLog } = useLog();
	if (!syncRunLog) return null;

	const createdAt = new Date(syncRunLog.created_at);
	const endedAt = syncRunLog.ended_at ? new Date(syncRunLog.ended_at) : undefined;
	const duration = endedAt ? formatDistance(endedAt, createdAt) : undefined;

	return (
		<Popover>
			<PopoverTrigger>
				<HiOutlineInformationCircle className="text-3xl text-emerald-500 hover:text-emerald-400" />
			</PopoverTrigger>
			<PopoverContent className="w-48 p-2 rounded-sm bg-neutral-700 text-neutral-200 shadow-2xl border-none">
				<div className="flex flex-col gap-4 text-sm">
					<div className="font-bold">Sync Stats</div>
					<div className="flex flex-col">
						<div>Start</div>
						<div>{format(createdAt, DEFAULT)}</div>
					</div>
					<div className="flex flex-col">
						<div>End</div>
						<div>{endedAt ? format(endedAt, DEFAULT) : 'pending'}</div>
					</div>
					<div className="flex flex-col">
						<div>Duration</div>
						<div>{duration || 'pending'}</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default React.memo(SystemInfo);
