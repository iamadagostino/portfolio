import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { Badge } from '~/components/admin/badge';
import { Button } from '~/components/admin/button';
import { Heading, Subheading } from '~/components/admin/heading';
import { Link } from '~/components/admin/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/admin/table';
import { getEvent, getEventOrders } from '~/data/fake';
import { Stat } from '../dashboard/stat';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;
  if (!id) {
    throw new Response('Not Found', { status: 404 });
  }

  const event = await getEvent(id);
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }

  const orders = await getEventOrders(id);

  return { event, orders };
};

type LoaderData = Awaited<ReturnType<typeof loader>>;

export const meta = ({ data }: { data?: LoaderData }) => {
  const eventName = data?.event?.name;

  if (!eventName) {
    return [{ title: 'Event Not Found · Admin' }];
  }

  return [{ title: `${eventName} · Admin` }];
};

export default function Event() {
  const { event, orders } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="max-lg:hidden">
        <Link href="../events" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Events
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="w-32 shrink-0">
            <img className="aspect-3/2 rounded-lg shadow-sm" src={event.imgUrl} alt="" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Heading>{event.name}</Heading>
              <Badge color={event.status === 'On Sale' ? 'lime' : 'zinc'}>{event.status}</Badge>
            </div>
            <div className="mt-2 text-sm/6 text-zinc-500">
              {event.date} at {event.time} <span aria-hidden="true">·</span> {event.location}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button outline>Edit</Button>
          <Button>View</Button>
        </div>
      </div>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <Stat title="Total revenue" value={event.totalRevenue} change={event.totalRevenueChange} />
        <Stat
          title="Tickets sold"
          value={`${event.ticketsSold}/${event.ticketsAvailable}`}
          change={event.ticketsSoldChange}
        />
        <Stat title="Pageviews" value={event.pageViews} change={event.pageViewsChange} />
      </div>
      <Subheading className="mt-12">Recent orders</Subheading>
      <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Order number</TableHeader>
            <TableHeader>Purchase date</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
              <TableCell>{order.id}</TableCell>
              <TableCell className="text-zinc-500">{order.date}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell className="text-right">US{order.amount.usd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
