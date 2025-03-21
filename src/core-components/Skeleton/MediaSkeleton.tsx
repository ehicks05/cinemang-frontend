import { Sk } from './Skeleton';

const MediaSkeleton = () => (
	<div className="bg-neutral-800 sm:rounded-lg">
		<div className="flex animate-pulse flex-col gap-4 p-4 sm:rounded-lg">
			<div className="flex gap-4">
				<div className="shrink-0">
					<Sk.Image />
				</div>
				<div className="flex w-full flex-col gap-4">
					<div>
						<Sk.Text h="h-6" />
					</div>
					<Sk.Text />
					<div className="flex flex-col gap-2">
						<Sk.Text />
						<Sk.Text />
						<Sk.Text />
					</div>
					<div />
					<div className="grow" />
					<div className="flex w-3/4 gap-2">
						<Sk.Text h="h-10" />
						<Sk.Text h="h-10" />
						<Sk.Text h="h-10" />
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-between gap-5">
				<div className="flex gap-3">
					<Sk.Text h="h-9" />
					<Sk.Text h="h-9" />
					<Sk.Text h="h-9" />
					<Sk.Text h="h-9" />
				</div>
				<div className="flex w-full flex-col gap-2">
					<Sk.Text h="h-3" />
					<Sk.Text h="h-3" />
					<Sk.Text h="h-3" />
				</div>
			</div>
		</div>
	</div>
);

export default MediaSkeleton;
