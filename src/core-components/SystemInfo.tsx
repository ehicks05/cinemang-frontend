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
			<PopoverContent className="z-20 w-60 rounded-sm bg-neutral-700 p-2 text-neutral-200 shadow-2xl border-none">
				<table className="w-full text-sm">
					<thead>
						<tr>
							<th colSpan={2}>Sync Stats</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="text-left">start</td>
							<td className="text-right">{format(createdAt, DEFAULT)}</td>
						</tr>
						<tr>
							<td className="text-left">end</td>
							<td className="text-right">
								{endedAt ? format(endedAt, DEFAULT) : 'pending'}
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th className="text-left">duration</th>
							<th className="text-right">{duration || 'pending'}</th>
						</tr>
					</tfoot>
				</table>
			</PopoverContent>
		</Popover>
	);
};

export default React.memo(SystemInfo);
