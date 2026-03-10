"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovementSlugLinks } from "@/components/movements/LearningUI";
import type { UserStateKey, UserStateGuidance } from "@/lib/movement-learning";

interface MovementStateItem {
  key: UserStateKey;
  label: string;
  description: string;
  data: UserStateGuidance;
}

export default function MovementStateTabs({ items }: { items: MovementStateItem[] }) {
  return (
    <Tabs defaultValue={items[0]?.key} className="w-full">
      <TabsList variant="line" className="w-full justify-start gap-1 overflow-x-auto pb-1">
        {items.map(item => (
          <TabsTrigger
            key={item.key}
            value={item.key}
            className="flex-none rounded-lg border border-gray-200 px-3 py-2 text-xs font-black data-[state=active]:border-gray-300 data-[state=active]:bg-white"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map(item => (
        <TabsContent key={item.key} value={item.key} className="mt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <div>
              <p className="text-sm font-black text-gray-900">{item.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{item.description}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-sm leading-relaxed text-gray-700">{item.data.summary}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Priority Focus</p>
                <ul className="space-y-2">
                  {item.data.priorities.map((priority, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#9BEC00] shrink-0" />
                      {priority}
                    </li>
                  ))}
                </ul>
              </div>
              {item.data.blockers && item.data.blockers.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Likely Blockers</p>
                  <ul className="space-y-2">
                    {item.data.blockers.map((blocker, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {blocker}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {item.data.nextMovementSlugs && item.data.nextMovementSlugs.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">What To Do Next</p>
                <MovementSlugLinks slugs={item.data.nextMovementSlugs} />
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
