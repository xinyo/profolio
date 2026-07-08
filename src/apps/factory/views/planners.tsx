import type { EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  type DropArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  filterPlannerCustomers,
  useFactoryStore,
  type FactoryCustomer,
} from "@/apps/factory/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

type PlannerView = "timeGridDay" | "timeGridWeek" | "dayGridMonth";

const BOOKING_DURATION_MS = 60 * 60 * 1000;

const plannerViews: { id: PlannerView; labelKey: string }[] = [
  {
    id: "timeGridDay",
    labelKey: "factory.views.planners.day",
  },
  {
    id: "timeGridWeek",
    labelKey: "factory.views.planners.week",
  },
  {
    id: "dayGridMonth",
    labelKey: "factory.views.planners.month",
  },
];

function makeBookingId(customerId: string, start: Date) {
  return `booking-${customerId}-${start.getTime()}`;
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * BOOKING_DURATION_MS);
}

function normalizeDropStart(date: Date, allDay: boolean) {
  if (!allDay) {
    return date;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function PlannersView() {
  const { t } = useTranslation();
  const calendarRef = useRef<FullCalendar | null>(null);
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeView, setActiveView] = useState<PlannerView>("timeGridWeek");
  const [calendarTitle, setCalendarTitle] = useState("");

  const customers = useFactoryStore((s) => s.customers);
  const customerBookings = useFactoryStore((s) => s.customerBookings);
  const addCustomerBooking = useFactoryStore((s) => s.addCustomerBooking);
  const deleteCustomerBooking = useFactoryStore((s) => s.deleteCustomerBooking);

  const filteredCustomers = useMemo(
    () => filterPlannerCustomers(customers, query),
    [customers, query],
  );

  const events = useMemo<EventInput[]>(
    () =>
      Object.values(customerBookings).map((booking) => ({
        id: booking.id,
        title: booking.customerName,
        start: booking.start,
        end: booking.end,
        classNames: ["factory-calendar-booking"],
        extendedProps: {
          customerId: booking.customerId,
        },
      })),
    [customerBookings],
  );

  useEffect(() => {
    const container = draggableContainerRef.current;
    if (!container) return;

    const draggable = new Draggable(container, {
      itemSelector: ".factory-planner-customer",
      eventData: () => ({
        create: false,
        duration: "01:00",
      }),
    });

    return () => draggable.destroy();
  }, [filteredCustomers]);

  function getCalendarApi() {
    return calendarRef.current?.getApi() ?? null;
  }

  function handleViewChange(view: PlannerView) {
    const calendarApi = getCalendarApi();
    setActiveView(view);
    calendarApi?.changeView(view);
  }

  function handleDrop(arg: DropArg) {
    const customerId = arg.draggedEl.dataset.customerId;
    const customer = customers.find((item) => item.id === customerId);

    if (!customer) return;

    const start = normalizeDropStart(arg.date, arg.allDay);
    const end = addHours(start, 1);

    addCustomerBooking({
      id: makeBookingId(customer.id, start),
      customerId: customer.id,
      customerName: customer.name,
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  function handleEventClick(arg: EventClickArg) {
    deleteCustomerBooking(arg.event.id);
  }

  return (
    <section className="factory-view factory-planner-view">
      <div className="factory-planner-shell">
        <aside
          className="factory-planner-sidebar"
          aria-label={t("factory.views.planners.customerList")}
        >
          <div className="factory-planner-sidebar-header">
            <div>
              <h3>{t("factory.views.planners.customers")}</h3>
              <p>{t("factory.views.planners.dragHint")}</p>
            </div>
          </div>

          <div className="factory-search-input-wrapper factory-planner-search">
            <Search className="factory-search-input-icon" />
            <Input
              className="factory-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("factory.views.planners.searchPlaceholder")}
              aria-label={t("factory.views.planners.searchPlaceholder")}
            />
          </div>

          <div
            ref={draggableContainerRef}
            className="factory-planner-customer-list"
            role="list"
          >
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <PlannerCustomerItem key={customer.id} customer={customer} />
              ))
            ) : (
              <div className="factory-planner-empty">
                {t("factory.views.planners.noCustomers")}
              </div>
            )}
          </div>
        </aside>

        <div className="factory-planner-calendar-panel">
          <div className="factory-planner-calendar-toolbar">
            <div className="factory-planner-calendar-title">
              <CalendarDays className="size-4" />
              <span>{calendarTitle}</span>
            </div>

            <div className="factory-planner-calendar-actions">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={t("factory.views.planners.previous")}
                onClick={() => getCalendarApi()?.prev()}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getCalendarApi()?.today()}
              >
                {t("factory.views.planners.today")}
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={t("factory.views.planners.next")}
                onClick={() => getCalendarApi()?.next()}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div
              className="factory-planner-view-toggle"
              aria-label={t("factory.views.planners.viewToggle")}
            >
              {plannerViews.map((view) => (
                <Button
                  key={view.id}
                  variant={activeView === view.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewChange(view.id)}
                  aria-pressed={activeView === view.id}
                >
                  {t(view.labelKey)}
                </Button>
              ))}
            </div>
          </div>

          <div className="factory-calendar-frame">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={activeView}
              headerToolbar={false}
              height="100%"
              allDaySlot={false}
              nowIndicator
              editable={false}
              droppable
              dropAccept=".factory-planner-customer"
              eventOverlap={false}
              events={events}
              drop={handleDrop}
              eventClick={handleEventClick}
              datesSet={(arg) => setCalendarTitle(arg.view.title)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PlannerCustomerItem({ customer }: { customer: FactoryCustomer }) {
  return (
    <Item
      className="factory-planner-customer"
      variant="outline"
      size="sm"
      role="listitem"
      tabIndex={0}
      data-customer-id={customer.id}
      aria-label={`Drag ${customer.name} to the planner calendar`}
    >
      <ItemMedia variant="image">
        <img src={customer.image} alt="" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{customer.name}</ItemTitle>
        <ItemDescription>
          {customer.city}, {customer.state}
        </ItemDescription>
      </ItemContent>
      <GripVertical
        className="factory-planner-customer-drag-icon"
        aria-hidden
      />
    </Item>
  );
}
