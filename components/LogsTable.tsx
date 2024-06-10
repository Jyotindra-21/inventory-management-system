
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
const formatDate = (isoString: any) => {
    const date = new Date(isoString);

    // Extract the date components
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Extract the time components
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format the date and time
    const formattedDate = `${day} ${month} ${year}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return `${formattedDate} at ${formattedTime}`;
};
export const LogsTable = ({ logs }: any) => {
    return (
        <>
            {logs.length === 0 ?
                <div className="text-center mt-5">
                    <h2 className="text-3xl font-semibold">No Logs</h2>
                </div>
                :
                <div className="text-center mt-5">
                    <h2 className="text-3xl font-semibold">Logs</h2>
                    <div className="border rounded-lg shadow-sm m-5 text-left">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Datetime</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{log.id}</TableCell>
                                        <TableCell>{log.name}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.quantity}</TableCell>
                                        <TableCell>{log.username}</TableCell>
                                        <TableCell>{log.role}</TableCell>
                                        <TableCell>{formatDate(log.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            }


        </>
    )
}