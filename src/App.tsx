"use client";
import { AreaChart, Card } from "@tremor/react";
import { Sheet } from "react-modal-sheet";
import { useState } from "react";

const chartdata = [
  {
    date: "Jan 23",
    "Route Requests": 289,
    "Station Requests": 233,
  },
  // ...rm fl
  {
    date: "Sep 23",
    "Route Requests": 280,
    "Station Requests": 221,
  },
  {
    date: "Oct 23",
    "Route Requests": 283,
    "Station Requests": 247,
  },
];

export default function Root() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <h1>MarketBuddy</h1>
      <button onClick={() => setOpen(true)}>Open sheet</button>
      <Sheet isOpen={isOpen} onClose={() => setOpen(false)} detent='content-height' rootId="root">
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>{
            <Card className="max-w-4xl">
              <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Total Requests
              </span>
              <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                6,568
              </p>
              <AreaChart
                className="mt-2 h-80"
                data={chartdata}
                index="date"
                categories={["Route Requests", "Station Requests"]}
                colors={["indigo", "rose"]}
                yAxisWidth={33}
              />
            </Card>
          }</Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setOpen(false)} />
      </Sheet >
    </>
  );
}
