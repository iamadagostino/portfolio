import { useLoaderData, useParams } from 'react-router';
import { Avatar } from '~/components/admin/avatar';
import { Button } from '~/components/admin/button';
import { Heading } from '~/components/admin/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/admin/table';
import { getOrders } from '~/data/fake';

export const meta = () => [{ title: 'Orders · Admin' }];

export const loader = async () => {
  const orders = await getOrders();
  return { orders };
};

export default function Orders() {
  const { orders } = useLoaderData<typeof loader>();
  const { lang } = useParams();
  
  const getOrderAdminUrl = (orderId: number) => `/${lang}/admin/order/${orderId}`;

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Orders</Heading>
        <Button className="-my-0.5">Create order</Button>
      </div>
      <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Order number</TableHeader>
            <TableHeader>Purchase date</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Event</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} href={getOrderAdminUrl(order.id)} title={`Order #${order.id}`}>
              <TableCell>{order.id}</TableCell>
              <TableCell className="text-zinc-500">{order.date}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar src={order.event.thumbUrl} className="size-6" />
                  <span>{order.event.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">US{order.amount.usd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
