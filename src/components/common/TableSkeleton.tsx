import { Skeleton, Table } from "@mantine/core";

interface TableSkeletonProps {
	rows?: number;
	columns: number;
}

export const TableSkeleton = ({ rows = 5, columns }: TableSkeletonProps) => {
	return (
		<>
			{Array(rows)
				.fill(0)
				.map(() => {
					const rowId = crypto.randomUUID();
					return (
						<Table.Tr key={rowId}>
							{Array(columns)
								.fill(0)
								.map(() => (
									<Table.Td key={crypto.randomUUID()}>
										<Skeleton height={20} />
									</Table.Td>
								))}
						</Table.Tr>
					);
				})}
		</>
	);
};
